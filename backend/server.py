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
    imgs = [{"url": f"{CDN}/{base}_{n}.jpg", "altText": f"{alt} — View {n}"} for n in range(1, angles + 1)]
    imgs.append({"url": POUCH, "altText": "Included: case and microfiber cloth"})
    return imgs

# variant images keyed by frame color (shared across lens types for same frame)
BEAST_VI = {
    "Black Matte": vi("Beast_Black_Frame_Brown_with_Red_Mirror_Lenses", "BEAST Black"),
    "Pink Matte Metallic": vi("beast_pink_frame_brown_with_red_mirror_lenses", "BEAST Pink"),
    "Orange Matte Metallic": vi("beast_orange_frame_brown_with_red_mirror_lenses", "BEAST Orange"),
    "Redcat™ Red Matte Metallic": vi("beast_red_frame_brown_with_red_mirror_lenses", "BEAST Red"),
    "Cyan Matte Metallic": vi("beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses", "BEAST Cyan"),
}
ROAR_VI = {
    "Black Matte": vi("roar_matte_blk_brown_red_2_mirror", "ROAR Black"),
    "Crystal Matte": vi("roar_matte_crystal_gray_green_oil_slick_mirror_mirror", "ROAR Crystal"),
    "Smoke Matte": vi("roar_matte_blk_brown_red_2_mirror", "ROAR Smoke"),  # fallback to black
    "Cyan Matte Metallic": vi("roar_matte_met_cyan_gray_green_oil_slick_mirror", "ROAR Cyan"),
    "Redcat™ Red Matte Metallic": vi("roar_matt_met_red_brown_red_mirror", "ROAR Red"),
}
LEAP_POUCH = f"{CDN}/redcat-eyewear-case-cloth-pouch_9bb7c203-447d-4bae-8948-3cf49bffb6fe.png"
LEAP_VI = {
    "Black Matte": [{"url": f"{CDN}/leap_matte_black_lumiglo_outdoor_1.jpg", "altText": "LEAP Black"}, {"url": LEAP_POUCH, "altText": "Accessories"}],
    "Crystal Matte": [{"url": f"{CDN}/leap_matte_crystal_fireglo_oudoor_1.jpg", "altText": "LEAP Crystal"}, {"url": LEAP_POUCH, "altText": "Accessories"}],
    "Pink Matte Metallic": [{"url": f"{CDN}/leap_matte_metallic_pink_fireglo_outdoor_1.jpg", "altText": "LEAP Pink"}, {"url": LEAP_POUCH, "altText": "Accessories"}],
    "Red Matte Metallic": [{"url": f"{CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg", "altText": "LEAP Red"}, {"url": LEAP_POUCH, "altText": "Accessories"}],
}
STRIKE_POUCH = f"{CDN}/redcat-eyewear-case-cloth-pouch_2522e8ab-d458-4cfb-9c25-024080f4d084.png"
STRIKE_VI = {
    "Matte Black": [{"url": f"{CDN}/strike_matte_black_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Black"}, {"url": STRIKE_POUCH, "altText": "Accessories"}],
    "Tortoise Matte": [{"url": f"{CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Tortoise"}, {"url": STRIKE_POUCH, "altText": "Accessories"}],
    "Smoke Matte": [{"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Smoke"}, {"url": STRIKE_POUCH, "altText": "Accessories"}],
    "Pink Matte Metallic": [{"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Pink"}, {"url": STRIKE_POUCH, "altText": "Accessories"}],
    "Crystal Matte": [{"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Crystal"}, {"url": STRIKE_POUCH, "altText": "Accessories"}],
}

def v(id_, frame, lens, price, avail=True, qty=20, vi_map=None):
    img = (vi_map or {}).get(frame, [])
    return {"id": str(id_), "title": f"{frame} / {lens}", "availableForSale": avail, "quantityAvailable": qty, "price": {"amount": str(price), "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": frame}, {"name": "Lens Type", "value": lens}], "variantImages": img}

STATIC_PRODUCTS = [
    {
        "id": "gid://shopify/Product/9596029141261",
        "handle": "beast",
        "title": "Redcat® BEAST™",
        "description": "The BEAST™ is our flagship shield-style performance sunglass — designed for mountain biking, cycling, and high-adrenaline outdoor sports. Ultra-lightweight TR-90 thermoplastic frame with shatterproof polycarbonate color-tuned lenses. Made in Italy.",
        "tags": ["cycling", "mountain biking", "outdoors", "shield"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "204.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "224.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST"},
            {"url": f"{CDN}/beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses_1.jpg", "altText": "BEAST Cyan"},
            {"url": f"{CDN}/Beast_Black_Frame_Brown_with_Red_Mirror_Lenses_1.jpg", "altText": "BEAST Black"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Pink Matte Metallic", "Orange Matte Metallic", "Redcat™ Red Matte Metallic", "Cyan Matte Metallic"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Red Mirror", "CarbonGlo™ Oil Slick Mirror", "BronzeGlo™ Silver Mirror", "CarbonGlo™ No Mirror"]},
        ],
        "variants": [
            v(48760812339496, "Black Matte", "BronzeGlo™ Red Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812503336, "Black Matte", "CarbonGlo™ Oil Slick Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812568872, "Pink Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812798248, "Orange Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=BEAST_VI),
            v(48760866668840, "Redcat™ Red Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=BEAST_VI),
            v(48760838029608, "Cyan Matte Metallic", "CarbonGlo™ Oil Slick Mirror", "204.99", vi_map=BEAST_VI),
            v(48760837898536, "Cyan Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=BEAST_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029108493",
        "handle": "roar",
        "title": "Redcat® ROAR™",
        "description": "The ROAR™ is a wrap-shield performance sunglass perfect for pickleball, tennis, cycling, and running. Lightweight TR-90 frame, color-tuned polycarbonate lenses. Made in Italy.",
        "tags": ["pickleball", "tennis", "cycling", "running", "wrap"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "184.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "204.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg", "altText": "ROAR Cyan"},
            {"url": f"{CDN}/roar_matte_blk_brown_red_2_mirror_1.jpg", "altText": "ROAR Black"},
            {"url": f"{CDN}/roar_matt_met_red_brown_red_mirror_1.jpg", "altText": "ROAR Red"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Crystal Matte", "Smoke Matte", "Cyan Matte Metallic", "Redcat™ Red Matte Metallic"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Red Mirror", "CarbonGlo™ Oil Slick Mirror", "BronzeGlo™ Silver Mirror", "CarbonGlo™ No Mirror"]},
        ],
        "variants": [
            v(48772751753512, "Black Matte", "BronzeGlo™ Red Mirror", "184.99", vi_map=ROAR_VI),
            v(48772751917352, "Black Matte", "CarbonGlo™ Oil Slick Mirror", "184.99", vi_map=ROAR_VI),
            v(48772751950120, "Crystal Matte", "BronzeGlo™ Red Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752081192, "Crystal Matte", "CarbonGlo™ Oil Slick Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752113960, "Smoke Matte", "BronzeGlo™ Red Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752638248, "Cyan Matte Metallic", "CarbonGlo™ Oil Slick Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752507176, "Cyan Matte Metallic", "BronzeGlo™ Red Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752867624, "Redcat™ Red Matte Metallic", "BronzeGlo™ Red Mirror", "184.99", vi_map=ROAR_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029075725",
        "handle": "leap",
        "title": "Redcat® LEAP™",
        "description": "The LEAP™ delivers versatile wrap-frame performance for pickleball, tennis, golf, and general sports. Color-tuned lenses, lightweight TR-90 frame. Made in Italy.",
        "tags": ["pickleball", "tennis", "golf", "general sports"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "144.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "164.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg", "altText": "LEAP Red"},
            {"url": f"{CDN}/leap_matte_black_lumiglo_outdoor_1.jpg", "altText": "LEAP Black"},
            {"url": f"{CDN}/leap_matte_crystal_fireglo_oudoor_1.jpg", "altText": "LEAP Crystal"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Crystal Matte", "Pink Matte Metallic", "Red Matte Metallic"]},
            {"name": "Lens Type", "values": ["LumiGlo™ Outdoor", "LumiGlo™ Indoor", "FireGlo™ Outdoor", "FireGlo™ Indoor", "PolarGlo™ Blue Mirror", "PolarGlo™ Green Mirror"]},
        ],
        "variants": [
            v(48772808933672, "Black Matte", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772808835368, "Black Matte", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772808966440, "Black Matte", "PolarGlo™ Blue Mirror", "144.99", vi_map=LEAP_VI),
            v(48772809064744, "Crystal Matte", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809130280, "Crystal Matte", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809457960, "Pink Matte Metallic", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809490728, "Pink Matte Metallic", "PolarGlo™ Blue Mirror", "144.99", vi_map=LEAP_VI),
            v(48772809752872, "Red Matte Metallic", "PolarGlo™ Blue Mirror", "144.99", vi_map=LEAP_VI),
            v(48772809720104, "Red Matte Metallic", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029042957",
        "handle": "strike",
        "title": "Redcat® STRIKE™",
        "description": "The STRIKE™ is our most versatile performance wrap sunglass — ideal for pickleball, tennis, running, and everyday sports. Lightweight, available in the full color-tuned lens lineup. Made in Italy.",
        "tags": ["pickleball", "tennis", "running", "general sports"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "119.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "139.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Tortoise"},
            {"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Smoke"},
            {"url": f"{CDN}/strike_matte_black_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Black"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Matte Black", "Tortoise Matte", "Smoke Matte", "Pink Matte Metallic", "Crystal Matte"]},
            {"name": "Lens Type", "values": ["PolarGlo™ Green Mirror", "PolarGlo™ Blue Mirror", "LumiGlo™ Outdoor", "LumiGlo™ Indoor", "FireGlo™ Outdoor", "FireGlo™ Indoor"]},
        ],
        "variants": [
            v(48767581258024, "Matte Black", "PolarGlo™ Green Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581094184, "Matte Black", "PolarGlo™ Blue Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581323560, "Tortoise Matte", "PolarGlo™ Green Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767580995880, "Tortoise Matte", "CarbonGlo™ No Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767582011688, "Smoke Matte", "LumiGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767581192488, "Smoke Matte", "PolarGlo™ Blue Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581684008, "Pink Matte Metallic", "FireGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767581225256, "Pink Matte Metallic", "PolarGlo™ Blue Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581946152, "Crystal Matte", "LumiGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767581290792, "Crystal Matte", "PolarGlo™ Green Mirror", "119.99", vi_map=STRIKE_VI),
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
