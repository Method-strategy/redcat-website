import httpx
import asyncio
import re
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ['DB_NAME']]

SHOPIFY_STORE_DOMAIN = "abf950-4.myshopify.com"
SHOPIFY_STOREFRONT_TOKEN = os.environ.get('SHOPIFY_STOREFRONT_TOKEN', '')
SHOPIFY_API_VERSION = "2024-10"
SHOPIFY_URL = f"https://{SHOPIFY_STORE_DOMAIN}/api/{SHOPIFY_API_VERSION}/graphql.json"

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


async def shopify_gql(query: str, variables: dict = None) -> dict:
    headers = {
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        "Content-Type": "application/json",
    }
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    async with httpx.AsyncClient(timeout=30.0) as c:
        r = await c.post(SHOPIFY_URL, json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()
        if "errors" in data:
            logger.error(f"Shopify GQL errors: {data['errors']}")
            raise Exception(str(data['errors']))
        return data.get("data", {})


PRODUCTS_QUERY = """
query Products($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        handle
        title
        description
        tags
        productType
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        images(first: 5) {
          edges { node { url altText } }
        }
        variants(first: 30) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
        options { name values }
      }
    }
  }
}
"""

PRODUCT_QUERY = """
query Product($handle: String!) {
  productByHandle(handle: $handle) {
    id handle title description descriptionHtml tags productType
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 30) { edges { node { url altText } } }
    variants(first: 60) {
      edges {
        node {
          id title availableForSale quantityAvailable
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText }
        }
      }
    }
    options { id name values }
  }
}
"""

CART_CREATE_MUTATION = """
mutation CartCreate($lines: [CartLineInput!]) {
  cartCreate(input: {lines: $lines}) {
    cart {
      id checkoutUrl totalQuantity
      cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
      lines(first: 100) {
        edges {
          node {
            id quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                image { url altText }
                product { id title handle }
              }
            }
          }
        }
      }
    }
    userErrors { field message }
  }
}
"""

CART_QUERY = """
query Cart($cartId: ID!) {
  cart(id: $cartId) {
    id checkoutUrl totalQuantity
    cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
    lines(first: 100) {
      edges {
        node {
          id quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id title
              price { amount currencyCode }
              selectedOptions { name value }
              image { url altText }
              product { id title handle }
            }
          }
        }
      }
    }
  }
}
"""

CART_ADD_MUTATION = """
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id checkoutUrl totalQuantity
      cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
      lines(first: 100) {
        edges {
          node {
            id quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                image { url altText }
                product { id title handle }
              }
            }
          }
        }
      }
    }
    userErrors { field message }
  }
}
"""

CART_REMOVE_MUTATION = """
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id checkoutUrl totalQuantity
      cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
      lines(first: 100) {
        edges {
          node {
            id quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                image { url altText }
                product { id title handle }
              }
            }
          }
        }
      }
    }
    userErrors { field message }
  }
}
"""

CART_UPDATE_MUTATION = """
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id checkoutUrl totalQuantity
      cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
      lines(first: 100) {
        edges {
          node {
            id quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                selectedOptions { name value }
                image { url altText }
                product { id title handle }
              }
            }
          }
        }
      }
    }
    userErrors { field message }
  }
}
"""


CDN = "https://cdn.shopify.com/s/files/1/0774/1784/0936/files"
POUCH = f"{CDN}/redcat-eyewear-case-cloth-pouch.png"

def vi(base, alt="", angles=3):
    """Build variantImages: up to `angles` product views + accessories."""
    imgs = [{"url": f"{CDN}/{base}_{n}.jpg", "altText": f"{alt} — View {n}"} for n in range(1, angles + 1)]
    imgs.append({"url": POUCH, "altText": "Included: case and microfiber cloth"})
    return imgs

STATIC_PRODUCTS = [
    {
        "id": "gid://shopify/Product/9596029141261",
        "handle": "beast",
        "title": "Redcat® BEAST™ Performance Sunglasses",
        "description": "The BEAST™ is our flagship shield-style performance sunglass — designed for mountain biking, cycling, and high-adrenaline outdoor sports. Ultra-lightweight TR-90 thermoplastic frame with shatterproof polycarbonate color-tuned lenses. Made in Italy.",
        "tags": ["cycling", "mountain biking", "outdoors", "shield"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "204.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "224.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST Red Frame"},
            {"url": f"{CDN}/beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses_1.jpg", "altText": "BEAST Cyan Frame"},
            {"url": f"{CDN}/Beast_Black_Frame_Brown_with_Red_Mirror_Lenses_1.jpg", "altText": "BEAST Black Frame"},
            {"url": f"{CDN}/beast_orange_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST Orange Frame"},
        ],
        "variants": [
            {"id": "gid://shopify/ProductVariant/49999041921293", "title": "Black Matte / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 20, "price": {"amount": "204.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Black Matte"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("Beast_Black_Frame_Brown_with_Red_Mirror_Lenses", "BEAST Black / Red Mirror")},
            {"id": "gid://shopify/ProductVariant/49999041954061", "title": "Redcat Red / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 15, "price": {"amount": "204.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Redcat Red Matte Metallic"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("beast_red_frame_brown_with_red_mirror_lenses", "BEAST Red / Red Mirror")},
            {"id": "gid://shopify/ProductVariant/49999041986829", "title": "Cyan / CarbonGlo™ Oil Slick Mirror", "availableForSale": True, "quantityAvailable": 12, "price": {"amount": "204.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Cyan Matte Metallic"}, {"name": "Lens Type", "value": "CarbonGlo™ Oil Slick Mirror"}], "variantImages": vi("beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses", "BEAST Cyan / Oil Slick")},
            {"id": "gid://shopify/ProductVariant/49999042019597", "title": "Orange / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 10, "price": {"amount": "204.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Orange Matte Metallic"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("beast_orange_frame_brown_with_red_mirror_lenses", "BEAST Orange / Red Mirror")},
            {"id": "gid://shopify/ProductVariant/49999042052365", "title": "Pink / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 8, "price": {"amount": "204.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Pink Matte Metallic"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("beast_pink_frame_brown_with_red_mirror_lenses", "BEAST Pink / Red Mirror")},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Pink Matte Metallic", "Orange Matte Metallic", "Redcat Red Matte Metallic", "Cyan Matte Metallic"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Red Mirror", "CarbonGlo™ Oil Slick Mirror", "LumiGlo™ Outdoor", "FireGlo™ Outdoor"]},
        ],
    },
    {
        "id": "gid://shopify/Product/9596029108493",
        "handle": "roar",
        "title": "Redcat® ROAR™ Performance Sunglasses",
        "description": "The ROAR™ is a wrap-shield performance sunglass perfect for pickleball, tennis, cycling, and running. Lightweight TR-90 frame, color-tuned polycarbonate lenses. Available in outdoor, indoor, and polarized options. Made in Italy.",
        "tags": ["pickleball", "tennis", "cycling", "running", "wrap"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "184.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "204.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg", "altText": "ROAR Cyan Frame"},
            {"url": f"{CDN}/roar_matte_blk_brown_red_2_mirror_1.jpg", "altText": "ROAR Black Frame"},
            {"url": f"{CDN}/roar_matt_met_red_brown_red_mirror_1.jpg", "altText": "ROAR Red Frame"},
            {"url": f"{CDN}/roar_matte_crystal_gray_green_oil_slick_mirror_mirror_1.jpg", "altText": "ROAR Crystal Frame"},
        ],
        "variants": [
            {"id": "gid://shopify/ProductVariant/50000000000001", "title": "Black Matte / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 18, "price": {"amount": "184.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Black Matte"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("roar_matte_blk_brown_red_2_mirror", "ROAR Black / Red Mirror")},
            {"id": "gid://shopify/ProductVariant/50000000000002", "title": "Cyan / CarbonGlo™ Oil Slick Mirror", "availableForSale": True, "quantityAvailable": 14, "price": {"amount": "184.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Cyan Matte Metallic"}, {"name": "Lens Type", "value": "CarbonGlo™ Oil Slick Mirror"}], "variantImages": vi("roar_matte_met_cyan_gray_green_oil_slick_mirror", "ROAR Cyan / Oil Slick")},
            {"id": "gid://shopify/ProductVariant/50000000000007", "title": "Redcat Red / BronzeGlo™ Red Mirror", "availableForSale": True, "quantityAvailable": 12, "price": {"amount": "184.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Redcat Red Matte Metallic"}, {"name": "Lens Type", "value": "BronzeGlo™ Red Mirror"}], "variantImages": vi("roar_matt_met_red_brown_red_mirror", "ROAR Red / Red Mirror")},
            {"id": "gid://shopify/ProductVariant/50000000000008", "title": "Matte Crystal / CarbonGlo™ Oil Slick Mirror", "availableForSale": True, "quantityAvailable": 9, "price": {"amount": "184.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Matte Crystal"}, {"name": "Lens Type", "value": "CarbonGlo™ Oil Slick Mirror"}], "variantImages": vi("roar_matte_crystal_gray_green_oil_slick_mirror_mirror", "ROAR Crystal / Oil Slick")},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Redcat Red Matte Metallic", "Cyan Matte Metallic", "Matte Crystal"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Red Mirror", "CarbonGlo™ Oil Slick Mirror", "LumiGlo™ Outdoor", "LumiGlo™ Indoor", "FireGlo™ Outdoor"]},
        ],
    },
    {
        "id": "gid://shopify/Product/9596029075725",
        "handle": "leap",
        "title": "Redcat® LEAP™ Performance Sunglasses",
        "description": "The LEAP™ delivers versatile wrap-frame performance for pickleball, tennis, golf, and general sports. Color-tuned lenses. Lightweight TR-90 frame. Made in Italy.",
        "tags": ["pickleball", "tennis", "golf", "general sports"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "144.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "164.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg", "altText": "LEAP Red Frame"},
            {"url": f"{CDN}/leap_matte_black_lumiglo_outdoor_1.jpg", "altText": "LEAP Black Frame"},
            {"url": f"{CDN}/leap_matte_crystal_fireglo_oudoor_1.jpg", "altText": "LEAP Crystal Frame"},
        ],
        "variants": [
            {"id": "gid://shopify/ProductVariant/50000000000003", "title": "Redcat Red / PolarGlo™ Blue Mirror", "availableForSale": True, "quantityAvailable": 20, "price": {"amount": "144.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Redcat Red Matte Metallic"}, {"name": "Lens Type", "value": "PolarGlo™ Blue Mirror"}], "variantImages": vi("leap_matte_metallic_red_gray_polar_blue_mirror", "LEAP Red / Polar Blue", angles=1)},
            {"id": "gid://shopify/ProductVariant/50000000000004", "title": "Black Matte / LumiGlo™ Outdoor", "availableForSale": True, "quantityAvailable": 22, "price": {"amount": "144.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Black Matte"}, {"name": "Lens Type", "value": "LumiGlo™ Outdoor"}], "variantImages": vi("leap_matte_black_lumiglo_outdoor", "LEAP Black / LumiGlo Outdoor", angles=1)},
            {"id": "gid://shopify/ProductVariant/50000000000009", "title": "Matte Crystal / FireGlo™ Outdoor", "availableForSale": True, "quantityAvailable": 16, "price": {"amount": "144.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Matte Crystal"}, {"name": "Lens Type", "value": "FireGlo™ Outdoor"}], "variantImages": vi("leap_matte_crystal_fireglo_oudoor", "LEAP Crystal / FireGlo Outdoor", angles=1)},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Pink Matte Metallic", "Redcat Red Matte Metallic", "Matte Crystal"]},
            {"name": "Lens Type", "values": ["LumiGlo™ Outdoor", "LumiGlo™ Indoor", "FireGlo™ Outdoor", "PolarGlo™ Blue Mirror", "PolarGlo™ Silver Mirror"]},
        ],
    },
    {
        "id": "gid://shopify/Product/9596029042957",
        "handle": "strike",
        "title": "Redcat® STRIKE™ Performance Sunglasses",
        "description": "The STRIKE™ is our most classic-feeling performance wrap sunglass — ideal for pickleball, tennis, running, and everyday sports. Lightweight, versatile, and available in the full color-tuned lens lineup. Made in Italy.",
        "tags": ["pickleball", "tennis", "running", "general sports"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "119.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "139.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Tortoise Frame"},
            {"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Smoke Frame"},
            {"url": f"{CDN}/strike_matte_black_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Black Frame"},
        ],
        "variants": [
            {"id": "gid://shopify/ProductVariant/50000000000005", "title": "Matte Tortoise / PolarGlo™ Green Mirror", "availableForSale": True, "quantityAvailable": 25, "price": {"amount": "119.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Matte Tortoise"}, {"name": "Lens Type", "value": "PolarGlo™ Green Mirror"}], "variantImages": vi("strike_matte_tortoise_gray_polar_green_mirror", "STRIKE Tortoise / Polar Green", angles=1)},
            {"id": "gid://shopify/ProductVariant/50000000000006", "title": "Black Matte / PolarGlo™ Green Mirror", "availableForSale": True, "quantityAvailable": 30, "price": {"amount": "119.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Black Matte"}, {"name": "Lens Type", "value": "PolarGlo™ Green Mirror"}], "variantImages": vi("strike_matte_black_gray_polar_green_mirror", "STRIKE Black / Polar Green", angles=1)},
            {"id": "gid://shopify/ProductVariant/50000000000010", "title": "Smoke Matte / LumiGlo™ Outdoor", "availableForSale": True, "quantityAvailable": 18, "price": {"amount": "119.99", "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": "Smoke Matte"}, {"name": "Lens Type", "value": "LumiGlo™ Outdoor"}], "variantImages": vi("strike_matte_smoke_translucent_lumiglo_outdoor", "STRIKE Smoke / LumiGlo Outdoor", angles=1)},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Pink Matte Metallic", "Matte Tortoise", "Smoke Matte"]},
            {"name": "Lens Type", "values": ["LumiGlo™ Outdoor", "LumiGlo™ Indoor", "FireGlo™ Outdoor", "PolarGlo™ Silver Mirror", "PolarGlo™ Green Mirror"]},
        ],
    },
]


def fmt_cart(cart: dict) -> dict:
    if not cart:
        return None
    return {
        "id": cart["id"],
        "checkoutUrl": cart["checkoutUrl"],
        "totalQuantity": cart["totalQuantity"],
        "cost": cart["cost"],
        "lines": [
            {
                "id": e["node"]["id"],
                "quantity": e["node"]["quantity"],
                "totalPrice": e["node"]["cost"]["totalAmount"],
                "variant": {
                    "id": e["node"]["merchandise"]["id"],
                    "title": e["node"]["merchandise"]["title"],
                    "price": e["node"]["merchandise"]["price"],
                    "selectedOptions": e["node"]["merchandise"]["selectedOptions"],
                    "image": e["node"]["merchandise"].get("image"),
                    "product": e["node"]["merchandise"]["product"],
                }
            }
            for e in cart.get("lines", {}).get("edges", [])
        ]
    }


@api_router.get("/")
async def root():
    return {"message": "Redcat Eyewear API v1.0"}


@api_router.get("/products")
async def get_products():
    try:
        data = await shopify_gql(PRODUCTS_QUERY, {"first": 50})
        products = []
        for edge in data.get("products", {}).get("edges", []):
            n = edge["node"]
            products.append({
                "id": n["id"],
                "handle": n["handle"],
                "title": n["title"],
                "description": n["description"],
                "tags": n["tags"],
                "productType": n["productType"],
                "priceRange": n["priceRange"],
                "images": [e["node"] for e in n["images"]["edges"]],
                "variants": [e["node"] for e in n["variants"]["edges"]],
                "options": n["options"],
            })
        if products:
            return {"products": products}
        return {"products": STATIC_PRODUCTS}
    except Exception as e:
        logger.warning(f"Shopify API unavailable, using static data: {e}")
        return {"products": STATIC_PRODUCTS}


@api_router.get("/products/{handle}")
async def get_product(handle: str):
    try:
        data = await shopify_gql(PRODUCT_QUERY, {"handle": handle})
        p = data.get("productByHandle")
        if p:
            return {
                "id": p["id"],
                "handle": p["handle"],
                "title": p["title"],
                "description": p["description"],
                "descriptionHtml": p.get("descriptionHtml", ""),
                "tags": p["tags"],
                "productType": p["productType"],
                "priceRange": p["priceRange"],
                "images": [e["node"] for e in p["images"]["edges"]],
                "variants": [e["node"] for e in p["variants"]["edges"]],
                "options": p["options"],
            }
    except Exception as e:
        logger.warning(f"Shopify API unavailable for {handle}, using static: {e}")
    # Fallback to static data
    static = next((p for p in STATIC_PRODUCTS if p["handle"] == handle), None)
    if static:
        return static
    raise HTTPException(status_code=404, detail="Product not found")


class CartCreateReq(BaseModel):
    lines: List[Dict[str, Any]] = []


@api_router.post("/cart")
async def create_cart(req: CartCreateReq):
    try:
        data = await shopify_gql(CART_CREATE_MUTATION, {"lines": req.lines})
        cart = data.get("cartCreate", {}).get("cart")
        errs = data.get("cartCreate", {}).get("userErrors", [])
        if errs:
            raise HTTPException(status_code=400, detail=errs[0]["message"])
        return fmt_cart(cart)
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Cart create error (Shopify API unavailable): {e}")
        raise HTTPException(status_code=503, detail="Cart service unavailable. Please visit redcateyewear.com to complete your purchase.")


@api_router.get("/cart/{cart_id:path}")
async def get_cart(cart_id: str):
    try:
        data = await shopify_gql(CART_QUERY, {"cartId": cart_id})
        cart = data.get("cart")
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        return fmt_cart(cart)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cart get error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class CartAddReq(BaseModel):
    cartId: str
    lines: List[Dict[str, Any]]


@api_router.post("/cart/add")
async def add_to_cart(req: CartAddReq):
    try:
        data = await shopify_gql(CART_ADD_MUTATION, {"cartId": req.cartId, "lines": req.lines})
        cart = data.get("cartLinesAdd", {}).get("cart")
        errs = data.get("cartLinesAdd", {}).get("userErrors", [])
        if errs:
            raise HTTPException(status_code=400, detail=errs[0]["message"])
        return fmt_cart(cart)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cart add error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class CartRemoveReq(BaseModel):
    cartId: str
    lineIds: List[str]


@api_router.post("/cart/remove")
async def remove_from_cart(req: CartRemoveReq):
    try:
        data = await shopify_gql(CART_REMOVE_MUTATION, {"cartId": req.cartId, "lineIds": req.lineIds})
        cart = data.get("cartLinesRemove", {}).get("cart")
        errs = data.get("cartLinesRemove", {}).get("userErrors", [])
        if errs:
            raise HTTPException(status_code=400, detail=errs[0]["message"])
        return fmt_cart(cart)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cart remove error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class CartUpdateReq(BaseModel):
    cartId: str
    lines: List[Dict[str, Any]]


@api_router.post("/cart/update")
async def update_cart(req: CartUpdateReq):
    try:
        data = await shopify_gql(CART_UPDATE_MUTATION, {"cartId": req.cartId, "lines": req.lines})
        cart = data.get("cartLinesUpdate", {}).get("cart")
        errs = data.get("cartLinesUpdate", {}).get("userErrors", [])
        if errs:
            raise HTTPException(status_code=400, detail=errs[0]["message"])
        return fmt_cart(cart)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cart update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class NewsletterReq(BaseModel):
    email: str


@api_router.post("/newsletter")
async def subscribe_newsletter(req: NewsletterReq):
    try:
        await db.newsletter_subscribers.update_one(
            {"email": req.email},
            {"$set": {"email": req.email, "subscribed_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )
        return {"message": "Successfully subscribed!"}
    except Exception as e:
        logger.error(f"Newsletter error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()
