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
SHOPIFY_API_VERSION = "2026-07"
SHOPIFY_URL = f"https://{SHOPIFY_STORE_DOMAIN}/api/{SHOPIFY_API_VERSION}/graphql.json"

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


async def shopify_gql(query: str, variables: dict = None) -> dict:
    headers = {
        "Shopify-Storefront-Private-Token": SHOPIFY_STOREFRONT_TOKEN,
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
          id title availableForSale
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
POUCH_LEAP = f"{CDN}/redcat-eyewear-case-cloth-pouch_9bb7c203-447d-4bae-8948-3cf49bffb6fe.png"
POUCH_STRIKE = f"{CDN}/redcat-eyewear-case-cloth-pouch_2522e8ab-d458-4cfb-9c25-024080f4d084.png"

def vi(base, alt="", pouch=POUCH, angles=3):
    imgs = [{"url": f"{CDN}/{base}_{n}.jpg", "altText": f"{alt} — View {n}"} for n in range(1, angles + 1)]
    imgs.append({"url": pouch, "altText": "Included: case and microfiber cloth"})
    return imgs

def vi1(base, alt="", pouch=POUCH):
    return [{"url": f"{CDN}/{base}_1.jpg", "altText": alt}, {"url": pouch, "altText": "Included: case and microfiber cloth"}]

# Per-variant image maps keyed by "Frame Color/Lens Type" (exact) or "Frame Color" (fallback)
BEAST_VI = {
    "Black Matte/BronzeGlo™ Red Mirror": vi("Beast_Black_Frame_Brown_with_Red_Mirror_Lenses", "BEAST Black BronzeGlo Red"),
    "Black Matte/BronzeGlo™ Gold Mirror": vi("Beast_Black_Frame_Brown_with_Gold_Mirror_Lenses", "BEAST Black BronzeGlo Gold"),
    "Black Matte/BronzeGlo™ Silver Mirror": vi("beast_black_frame_brown_with_silver_mirror_lenses", "BEAST Black BronzeGlo Silver"),
    "Black Matte/CarbonGlo™ Oil Slick Mirror": vi("beast_black_frame_gray_with_green_oil_slick_mirror_lenses", "BEAST Black CarbonGlo Oil Slick"),
    "Black Matte/CarbonGlo™ No Mirror": vi("beast_black_frame_gray_with_no_mirror_lenses", "BEAST Black CarbonGlo"),
    "Black Matte/CarbonGlo™ Silver Mirror": vi("beast_black_frame_gray_with_silver_mirror_lenses", "BEAST Black CarbonGlo Silver"),
    "Black Matte/CarbonGlo™ Blue Mirror": vi("beast_black_frame_gray_with_blue_mirror_lenses", "BEAST Black CarbonGlo Blue"),
    "Pink Matte Metallic/BronzeGlo™ Red Mirror": vi("beast_pink_frame_brown_with_red_mirror_lenses", "BEAST Pink BronzeGlo Red"),
    "Pink Matte Metallic/BronzeGlo™ Silver Mirror": vi("beast_pink_frame_brown_with_silver_mirror_lenses", "BEAST Pink BronzeGlo Silver"),
    "Pink Matte Metallic/CarbonGlo™ No Mirror": vi("beast_pink_frame_gray_with_no_mirror_lenses", "BEAST Pink CarbonGlo"),
    "Pink Matte Metallic/CarbonGlo™ Silver Mirror": vi("beast_pink_frame_gray_with_silver_mirror_lenses", "BEAST Pink CarbonGlo Silver"),
    "Pink Matte Metallic/CarbonGlo™ Blue Mirror": vi("beast_pink_frame_gray_with_blue_mirror_lenses", "BEAST Pink CarbonGlo Blue"),
    "Orange Matte Metallic/BronzeGlo™ Red Mirror": vi("beast_orange_frame_brown_with_red_mirror_lenses", "BEAST Orange BronzeGlo Red"),
    "Orange Matte Metallic/BronzeGlo™ Silver Mirror": vi("beast_orange_frame_brown_with_silver_mirror_lenses", "BEAST Orange BronzeGlo Silver"),
    "Orange Matte Metallic/CarbonGlo™ No Mirror": vi("beast_orange_frame_gray_with_no_mirror_lenses", "BEAST Orange CarbonGlo"),
    "Orange Matte Metallic/CarbonGlo™ Silver Mirror": vi("beast_orange_frame_gray_with_silver_mirror_lenses", "BEAST Orange CarbonGlo Silver"),
    "Orange Matte Metallic/CarbonGlo™ Blue Mirror": vi("beast_orange_frame_gray_with_blue_mirror_lenses", "BEAST Orange CarbonGlo Blue"),
    "Redcat™ Red Matte Metallic/BronzeGlo™ Silver Mirror": vi("beast_red_frame_brown_with_silver_mirror_lenses", "BEAST Red BronzeGlo Silver"),
    "Redcat™ Red Matte Metallic/BronzeGlo™ Red Mirror": vi("beast_red_frame_brown_with_red_mirror_lenses", "BEAST Red BronzeGlo Red"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ No Mirror": vi("beast_red_frame_gray_with_no_mirror_lenses", "BEAST Red CarbonGlo"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ Silver Mirror": vi("beast_red_frame_gray_with_silver_mirror_lenses", "BEAST Red CarbonGlo Silver"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ Blue Mirror": vi("beast_red_frame_gray_with_blue_mirror_lenses", "BEAST Red CarbonGlo Blue"),
    "Cyan Matte Metallic/BronzeGlo™ Red Mirror": vi("beast_cyan_frame_brown_with_red_mirror_lenses", "BEAST Cyan BronzeGlo Red"),
    "Cyan Matte Metallic/BronzeGlo™ Silver Mirror": vi("beast_cyan_frame_brown_with_silver_mirror_lenses", "BEAST Cyan BronzeGlo Silver"),
    "Cyan Matte Metallic/CarbonGlo™ Oil Slick Mirror": vi("beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses", "BEAST Cyan CarbonGlo Oil Slick"),
    "Cyan Matte Metallic/CarbonGlo™ No Mirror": vi("beast_cyan_frame_gray_with_no_mirror_lenses", "BEAST Cyan CarbonGlo"),
    "Cyan Matte Metallic/CarbonGlo™ Silver Mirror": vi("beast_cyan_frame_gray_with_silver_mirror_lenses", "BEAST Cyan CarbonGlo Silver"),
    "Cyan Matte Metallic/CarbonGlo™ Blue Mirror": vi("beast_cyan_frame_gray_with_blue_mirror_lenses", "BEAST Cyan CarbonGlo Blue"),
}

ROAR_VI = {
    "Black Matte/BronzeGlo™ Silver Mirror": vi("roar_matte_blk_brown_silver_mirror", "ROAR Black BronzeGlo Silver"),
    "Black Matte/BronzeGlo™ Red Mirror": vi("roar_matte_blk_brown_red_2_mirror", "ROAR Black BronzeGlo Red"),
    "Black Matte/BronzeGlo™ Gold Mirror": vi("roar_matte_blk_brown_gold_mirror", "ROAR Black BronzeGlo Gold"),
    "Black Matte/CarbonGlo™ No Mirror": vi("roar_matte_blk_gray_no_mirror", "ROAR Black CarbonGlo"),
    "Black Matte/CarbonGlo™ Silver Mirror": vi("roar_matte_blk_gray_silver_mirror", "ROAR Black CarbonGlo Silver"),
    "Black Matte/CarbonGlo™ Blue Mirror": vi("roar_matte_blk_gray_blue_mirror", "ROAR Black CarbonGlo Blue"),
    "Black Matte/CarbonGlo™ Green Oil Slick Mirror": vi("roar_matte_blk_gray_green_oil_slick_mirror", "ROAR Black CarbonGlo Oil Slick"),
    "Crystal Matte/BronzeGlo™ Red Mirror": vi("roar_matte_crystal_brown_red_mirror", "ROAR Crystal BronzeGlo Red"),
    "Crystal Matte/BronzeGlo™ Gold Mirror": vi("roar_matte_crystal_brown_gold_mirror", "ROAR Crystal BronzeGlo Gold"),
    "Crystal Matte/CarbonGlo™ Silver Mirror": vi("roar_matte_crystal_gray_silver_mirror_mirror", "ROAR Crystal CarbonGlo Silver"),
    "Crystal Matte/CarbonGlo™ Blue Mirror": vi("roar_matte_crystal_gray_blue_mirror_mirror", "ROAR Crystal CarbonGlo Blue"),
    "Crystal Matte/CarbonGlo™ Green Oil Slick Mirror": vi("roar_matte_crystal_gray_green_oil_slick_mirror_mirror", "ROAR Crystal CarbonGlo Oil Slick"),
    "Smoke Matte/BronzeGlo™ Red Mirror": vi("roar_matte_smoke_brown_red_mirror", "ROAR Smoke BronzeGlo Red"),
    "Smoke Matte/BronzeGlo™ Gold Mirror": vi("roar_matte_smoke_brown_gold_mirror", "ROAR Smoke BronzeGlo Gold"),
    "Smoke Matte/CarbonGlo™ Silver Mirror": vi("roar_matte_smoke_gray_silver_mirror", "ROAR Smoke CarbonGlo Silver"),
    "Smoke Matte/CarbonGlo™ Blue Mirror": vi("roar_matte_smoke_gray_blue_mirror", "ROAR Smoke CarbonGlo Blue"),
    "Smoke Matte/CarbonGlo™ Green Oil Slick Mirror": vi("roar_matte_smoke_green_oil_slick_mirror", "ROAR Smoke CarbonGlo Oil Slick"),
    "Metallic Green/BronzeGlo™ Silver Mirror": vi("roar_matte_met_green_brown_silver_mirror", "ROAR Green BronzeGlo Silver"),
    "Metallic Green/BronzeGlo™ Red Mirror": vi("roar_matte_met_green_brown_red_mirror_v2", "ROAR Green BronzeGlo Red"),
    "Metallic Green/BronzeGlo™ Gold Mirror": vi("roar_matte_met_green_brown_gold_mirror", "ROAR Green BronzeGlo Gold"),
    "Metallic Green/CarbonGlo™ No Mirror": vi("roar_matte_met_green_gray_no_mirror", "ROAR Green CarbonGlo"),
    "Metallic Green/CarbonGlo™ Silver Mirror": vi("roar_matte_met_green_gray_silver_mirror", "ROAR Green CarbonGlo Silver"),
    "Metallic Green/CarbonGlo™ Blue Mirror": vi("roar_matte_met_green_gray_blue_mirror", "ROAR Green CarbonGlo Blue"),
    "Cyan Matte Metallic/BronzeGlo™ Silver Mirror": vi("roar_matte_met_cyan_brown_silver_mirror", "ROAR Cyan BronzeGlo Silver"),
    "Cyan Matte Metallic/BronzeGlo™ Red Mirror": vi("roar_matte_met_cyan_brown_red_mirror_v2", "ROAR Cyan BronzeGlo Red"),
    "Cyan Matte Metallic/CarbonGlo™ No Mirror": vi("roar_matte_met_cyan_gray_no_mirror", "ROAR Cyan CarbonGlo"),
    "Cyan Matte Metallic/CarbonGlo™ Silver Mirror": vi("roar_matte_met_cyan_gray_silver_mirror", "ROAR Cyan CarbonGlo Silver"),
    "Cyan Matte Metallic/CarbonGlo™ Blue Mirror": vi("roar_matte_met_cyan_gray_blue_mirror", "ROAR Cyan CarbonGlo Blue"),
    "Cyan Matte Metallic/CarbonGlo™ Green Oil Slick Mirror": vi("roar_matte_met_cyan_gray_green_oil_slick_mirror", "ROAR Cyan CarbonGlo Oil Slick"),
    "Orange Matte Metallic/BronzeGlo™ Silver Mirror": vi("roar_matt_met_orange_brown_silver_mirror", "ROAR Orange BronzeGlo Silver"),
    "Orange Matte Metallic/BronzeGlo™ Red Mirror": vi("roar_matt_met_orange_brown_red_mirror_v2", "ROAR Orange BronzeGlo Red"),
    "Orange Matte Metallic/CarbonGlo™ No Mirror": vi("roar_matt_met_orange_gray_no_mirror", "ROAR Orange CarbonGlo"),
    "Orange Matte Metallic/CarbonGlo™ Silver Mirror": vi("roar_matt_met_orange_gray_silver_mirror", "ROAR Orange CarbonGlo Silver"),
    "Orange Matte Metallic/CarbonGlo™ Blue Mirror": vi("roar_matt_met_orange_gray_blue_mirror", "ROAR Orange CarbonGlo Blue"),
    "Redcat™ Red Matte Metallic/BronzeGlo™ Red Mirror": vi("roar_matt_met_red_brown_red_mirror", "ROAR Red BronzeGlo Red"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ No Mirror": vi("roar_matt_met_red_gray_no_mirror", "ROAR Red CarbonGlo"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ Silver Mirror": vi("roar_matt_met_red_gray_silver_mirror", "ROAR Red CarbonGlo Silver"),
    "Redcat™ Red Matte Metallic/CarbonGlo™ Blue Mirror": vi("roar_matt_met_red_gray_blue_mirror", "ROAR Red CarbonGlo Blue"),
}

LEAP_VI = {
    "Black Matte/FireGlo™ Indoor": vi1("leap_matte_black_fireglo_indoor", "LEAP Black FireGlo Indoor", POUCH_LEAP),
    "Black Matte/FireGlo™ Outdoor": vi1("leap_matte_black_fireglo_outdoor", "LEAP Black FireGlo Outdoor", POUCH_LEAP),
    "Black Matte/LumiGlo™ Indoor": vi1("leap_matte_black_lumiglo_indoor", "LEAP Black LumiGlo Indoor", POUCH_LEAP),
    "Black Matte/LumiGlo™ Outdoor": vi1("leap_matte_black_lumiglo_outdoor", "LEAP Black LumiGlo Outdoor", POUCH_LEAP),
    "Black Matte/PolarGlo™ Blue Mirror": vi1("leap_matte_black_gray_polar_blue_mirror", "LEAP Black PolarGlo Blue", POUCH_LEAP),
    "Black Matte/PolarGlo™ Green Mirror": vi1("leap_matte_black_gray_polar_green_mirror", "LEAP Black PolarGlo Green", POUCH_LEAP),
    "Crystal Matte/FireGlo™ Indoor": vi1("leap_matte_crystal_fireglo_indoor", "LEAP Crystal FireGlo Indoor", POUCH_LEAP),
    "Crystal Matte/FireGlo™ Outdoor": vi1("leap_matte_crystal_fireglo_oudoor", "LEAP Crystal FireGlo Outdoor", POUCH_LEAP),
    "Crystal Matte/LumiGlo™ Indoor": vi1("leap_matte_crystal_lumiglo_indoor", "LEAP Crystal LumiGlo Indoor", POUCH_LEAP),
    "Crystal Matte/LumiGlo™ Outdoor": vi1("leap_matte_crystal_lumiglo_oudoor", "LEAP Crystal LumiGlo Outdoor", POUCH_LEAP),
    "Crystal Matte/PolarGlo™ Blue Mirror": vi1("leap_matte_crystal_gray_polar_blue_mirror", "LEAP Crystal PolarGlo Blue", POUCH_LEAP),
    "Crystal Matte/PolarGlo™ Green Mirror": vi1("leap_matte_crystal_gray_polar_green_mirror", "LEAP Crystal PolarGlo Green", POUCH_LEAP),
    "Smoke Matte/FireGlo™ Indoor": vi1("leap_matte_smoke_translucent_fireglo_indoor", "LEAP Smoke FireGlo Indoor", POUCH_LEAP),
    "Smoke Matte/FireGlo™ Outdoor": vi1("leap_matte_smoke_translucent_fireglo_outdoor", "LEAP Smoke FireGlo Outdoor", POUCH_LEAP),
    "Smoke Matte/LumiGlo™ Indoor": vi1("leap_matte_smoke_translucent_lumiglo_indoor", "LEAP Smoke LumiGlo Indoor", POUCH_LEAP),
    "Smoke Matte/LumiGlo™ Outdoor": vi1("leap_matte_smoke_translucent_lumiglo_outdoor", "LEAP Smoke LumiGlo Outdoor", POUCH_LEAP),
    "Smoke Matte/PolarGlo™ Blue Mirror": vi1("leap_matte_smoke_translucent_gray_polar_blue_mirror", "LEAP Smoke PolarGlo Blue", POUCH_LEAP),
    "Smoke Matte/PolarGlo™ Green Mirror": vi1("leap_matte_smoke_translucent_gray_polar_green_mirror", "LEAP Smoke PolarGlo Green", POUCH_LEAP),
    "Pink Matte Metallic/FireGlo™ Indoor": vi1("leap_matte_metallic_pink_fireglo_indoor", "LEAP Pink FireGlo Indoor", POUCH_LEAP),
    "Pink Matte Metallic/FireGlo™ Outdoor": vi1("leap_matte_metallic_pink_fireglo_outdoor", "LEAP Pink FireGlo Outdoor", POUCH_LEAP),
    "Pink Matte Metallic/PolarGlo™ Blue Mirror": vi1("leap_matte_metallic_pink_gray_oolar_blue_mirror", "LEAP Pink PolarGlo Blue", POUCH_LEAP),
    "Blue Matte Metallic/FireGlo™ Indoor": vi("leap_matte_metallic_blue_fireglo_indoor", "LEAP Blue FireGlo Indoor", POUCH_LEAP),
    "Blue Matte Metallic/FireGlo™ Outdoor": vi1("leap_matte_metallic_blue_fireglo_outdoor", "LEAP Blue FireGlo Outdoor", POUCH_LEAP),
    "Blue Matte Metallic/LumiGlo™ Indoor": vi("leap_matte_metallic_blue_lumiglo_indoor", "LEAP Blue LumiGlo Indoor", POUCH_LEAP),
    "Blue Matte Metallic/LumiGlo™ Outdoor": vi("leap_matte_metallic_blue_lumiglo_outdoor", "LEAP Blue LumiGlo Outdoor", POUCH_LEAP),
    "Blue Matte Metallic/PolarGlo™ Blue Mirror": vi("leap_matte_metallic_blue_gray_polar_blue_mirror", "LEAP Blue PolarGlo Blue", POUCH_LEAP),
    "Blue Matte Metallic/PolarGlo™ Green Mirror": vi("leap_matte_metallic_blue_gray_polar_green_mirror", "LEAP Blue PolarGlo Green", POUCH_LEAP),
    "Red Matte Metallic/FireGlo™ Indoor": vi("leap_matte_metallic_red_fireglo_indoor", "LEAP Red FireGlo Indoor", POUCH_LEAP),
    "Red Matte Metallic/PolarGlo™ Blue Mirror": vi1("leap_matte_metallic_red_gray_polar_blue_mirror", "LEAP Red PolarGlo Blue", POUCH_LEAP),
}

STRIKE_VI = {
    "Smoke Matte/FireGlo™ Indoor": vi("strike_matte_smoke_translucent_fireglo_indoor", "STRIKE Smoke FireGlo Indoor", POUCH_STRIKE),
    "Smoke Matte/FireGlo™ Outdoor": vi("strike_matte_smoke_translucent_fireglo_outdoor", "STRIKE Smoke FireGlo Outdoor", POUCH_STRIKE),
    "Smoke Matte/LumiGlo™ Indoor": vi("strike_matte_smoke_translucent_lumiglo_indoor", "STRIKE Smoke LumiGlo Indoor", POUCH_STRIKE),
    "Smoke Matte/LumiGlo™ Outdoor": vi("strike_matte_smoke_translucent_lumiglo_outdoor", "STRIKE Smoke LumiGlo Outdoor", POUCH_STRIKE),
    "Smoke Matte/PolarGlo™ Blue Mirror": vi("strike_matte_smoke_translucent_gray_blue_mirror", "STRIKE Smoke PolarGlo Blue", POUCH_STRIKE),
    "Matte Black/BronzeGlo™ No Mirror": vi("strike_matte_black_brown_no_mirror", "STRIKE Black BronzeGlo", POUCH_STRIKE),
    "Matte Black/BronzeGlo™ Silver Mirror": vi("strike_matte_black_brown_silver_mirror", "STRIKE Black BronzeGlo Silver", POUCH_STRIKE),
    "Matte Black/CarbonGlo™ No Mirror": vi("strike_matte_black_gray_no_mirror", "STRIKE Black CarbonGlo", POUCH_STRIKE),
    "Matte Black/PolarGlo™ Blue Mirror": vi("strike_matte_black_gray_polar_blue_mirror", "STRIKE Black PolarGlo Blue", POUCH_STRIKE),
    "Matte Black/PolarGlo™ Green Mirror": vi("strike_matte_black_gray_polar_green_mirror", "STRIKE Black PolarGlo Green", POUCH_STRIKE),
    "Tortoise Matte/BronzeGlo™ No Mirror": vi("strike_matte_tortoise_brown_no_mirror", "STRIKE Tortoise BronzeGlo", POUCH_STRIKE),
    "Tortoise Matte/BronzeGlo™ Silver Mirror": vi("strike_matte_tortoise_brown_silver_mirror", "STRIKE Tortoise BronzeGlo Silver", POUCH_STRIKE),
    "Tortoise Matte/CarbonGlo™ No Mirror": vi("strike_matte_tortoise_gray_no_mirror", "STRIKE Tortoise CarbonGlo", POUCH_STRIKE),
    "Tortoise Matte/PolarGlo™ Green Mirror": vi("strike_matte_tortoise_gray_polar_green_mirror", "STRIKE Tortoise PolarGlo Green", POUCH_STRIKE),
    "Pink Matte Metallic/FireGlo™ Indoor": vi("strike_matte_met_pink_fireglo_indoor", "STRIKE Pink FireGlo Indoor", POUCH_STRIKE),
    "Pink Matte Metallic/BronzeGlo™ Silver Mirror": vi("strike_matte_met_pink_brown_silver_mirror", "STRIKE Pink BronzeGlo Silver", POUCH_STRIKE),
    "Pink Matte Metallic/PolarGlo™ Blue Mirror": vi("strike_matte_met_pink_gray_blue_mirror", "STRIKE Pink PolarGlo Blue", POUCH_STRIKE),
    "Crystal Matte/FireGlo™ Indoor": vi("strike_matte_crystal_fireglo_indoor", "STRIKE Crystal FireGlo Indoor", POUCH_STRIKE),
    "Crystal Matte/FireGlo™ Outdoor": vi("strike_matte_crystal_fireglo_outdoor", "STRIKE Crystal FireGlo Outdoor", POUCH_STRIKE),
    "Crystal Matte/LumiGlo™ Indoor": vi("strike_matte_crystal_lumiglo_indoor", "STRIKE Crystal LumiGlo Indoor", POUCH_STRIKE),
    "Crystal Matte/LumiGlo™ Outdoor": vi("strike_matte_crystal_lumiglo_outdoor", "STRIKE Crystal LumiGlo Outdoor", POUCH_STRIKE),
    "Crystal Matte/PolarGlo™ Blue Mirror": vi("strike_matte_crystal_gray_blue_mirror", "STRIKE Crystal PolarGlo Blue", POUCH_STRIKE),
    "Crystal Matte/PolarGlo™ Green Mirror": vi("strike_matte_crystal_gray_green_mirror", "STRIKE Crystal PolarGlo Green", POUCH_STRIKE),
}

def v(id_, frame, lens, price, avail=True, qty=20, vi_map=None):
    key = f"{frame}/{lens}"
    img = (vi_map or {}).get(key) or (vi_map or {}).get(frame, [])
    return {"id": str(id_), "title": f"{frame} / {lens}", "availableForSale": avail, "quantityAvailable": qty, "price": {"amount": str(price), "currencyCode": "USD"}, "selectedOptions": [{"name": "Frame Color", "value": frame}, {"name": "Lens Type", "value": lens}], "variantImages": img}

STATIC_PRODUCTS = [
    {
        "id": "gid://shopify/Product/9596029141261",
        "handle": "beast",
        "title": "Redcat® BEAST™",
        "description": "BEAST is the biggest shield we make. Maximum coverage, maximum field of view, and light enough that you forget it's there. The single-lens geometry means nothing crosses your sightline. TR-90 frame flexes on impact instead of breaking. Choose BronzeGlo™ for mountain biking, cycling, and driving — or CarbonGlo™ for sharper aqua and green-gray tones. Made in Italy.",
        "tags": ["cycling", "mountain biking", "outdoors", "shield", "driving"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "204.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "234.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST Red BronzeGlo"},
            {"url": f"{CDN}/beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses_1.jpg", "altText": "BEAST Cyan CarbonGlo"},
            {"url": f"{CDN}/Beast_Black_Frame_Brown_with_Red_Mirror_Lenses_1.jpg", "altText": "BEAST Black BronzeGlo"},
            {"url": f"{CDN}/beast_orange_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST Orange"},
            {"url": f"{CDN}/beast_pink_frame_brown_with_red_mirror_lenses_1.jpg", "altText": "BEAST Pink"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Pink Matte Metallic", "Orange Matte Metallic", "Redcat™ Red Matte Metallic", "Cyan Matte Metallic"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Red Mirror", "BronzeGlo™ Gold Mirror", "BronzeGlo™ Silver Mirror", "CarbonGlo™ Oil Slick Mirror", "CarbonGlo™ No Mirror", "CarbonGlo™ Silver Mirror", "CarbonGlo™ Blue Mirror"]},
        ],
        "variants": [
            v(48760812339496, "Black Matte", "BronzeGlo™ Red Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812372264, "Black Matte", "BronzeGlo™ Gold Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812405032, "Black Matte", "BronzeGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812503336, "Black Matte", "CarbonGlo™ Oil Slick Mirror", "234.99", vi_map=BEAST_VI),
            v(48760812470568, "Black Matte", "CarbonGlo™ No Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812437800, "Black Matte", "CarbonGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812536104, "Black Matte", "CarbonGlo™ Blue Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812568872, "Pink Matte Metallic", "BronzeGlo™ Red Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812601640, "Pink Matte Metallic", "BronzeGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812634408, "Pink Matte Metallic", "CarbonGlo™ No Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812667176, "Pink Matte Metallic", "CarbonGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812699944, "Pink Matte Metallic", "CarbonGlo™ Blue Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812798248, "Orange Matte Metallic", "BronzeGlo™ Red Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812831016, "Orange Matte Metallic", "BronzeGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812863784, "Orange Matte Metallic", "CarbonGlo™ No Mirror", "204.99", vi_map=BEAST_VI),
            v(48760812896552, "Orange Matte Metallic", "CarbonGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760812929320, "Orange Matte Metallic", "CarbonGlo™ Blue Mirror", "224.99", vi_map=BEAST_VI),
            v(48760866668840, "Redcat™ Red Matte Metallic", "BronzeGlo™ Red Mirror", "224.99", vi_map=BEAST_VI),
            v(48760866701608, "Redcat™ Red Matte Metallic", "BronzeGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760866734376, "Redcat™ Red Matte Metallic", "CarbonGlo™ No Mirror", "204.99", vi_map=BEAST_VI),
            v(48760866767144, "Redcat™ Red Matte Metallic", "CarbonGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760866799912, "Redcat™ Red Matte Metallic", "CarbonGlo™ Blue Mirror", "224.99", vi_map=BEAST_VI),
            v(48760837898536, "Cyan Matte Metallic", "BronzeGlo™ Red Mirror", "224.99", vi_map=BEAST_VI),
            v(48760837931304, "Cyan Matte Metallic", "BronzeGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760838029608, "Cyan Matte Metallic", "CarbonGlo™ Oil Slick Mirror", "234.99", vi_map=BEAST_VI),
            v(48760837996840, "Cyan Matte Metallic", "CarbonGlo™ No Mirror", "204.99", vi_map=BEAST_VI),
            v(48760838062376, "Cyan Matte Metallic", "CarbonGlo™ Silver Mirror", "224.99", vi_map=BEAST_VI),
            v(48760838095144, "Cyan Matte Metallic", "CarbonGlo™ Blue Mirror", "224.99", vi_map=BEAST_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029108493",
        "handle": "roar",
        "title": "Redcat® ROAR™",
        "description": "ROAR is a wrap-shield performance frame built for cycling, mountain biking, and high-output sport. Lightweight TR-90, full lens coverage, and the complete BronzeGlo™ and CarbonGlo™ lineup. BronzeGlo sharpens warm tones for trail and road hazards. CarbonGlo boosts cool tones for sky contrast and green canopy detail. Made in Italy.",
        "tags": ["cycling", "mountain biking", "outdoors", "running", "wrap"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "184.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "204.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg", "altText": "ROAR Cyan"},
            {"url": f"{CDN}/roar_matte_blk_brown_red_2_mirror_1.jpg", "altText": "ROAR Black BronzeGlo"},
            {"url": f"{CDN}/roar_matt_met_red_brown_red_mirror_1.jpg", "altText": "ROAR Red"},
            {"url": f"{CDN}/roar_matte_met_green_brown_red_mirror_v2_1.jpg", "altText": "ROAR Green"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Crystal Matte", "Smoke Matte", "Metallic Green", "Cyan Matte Metallic", "Orange Matte Metallic", "Redcat™ Red Matte Metallic"]},
            {"name": "Lens Type", "values": ["BronzeGlo™ Silver Mirror", "BronzeGlo™ Red Mirror", "BronzeGlo™ Gold Mirror", "CarbonGlo™ No Mirror", "CarbonGlo™ Silver Mirror", "CarbonGlo™ Blue Mirror", "CarbonGlo™ Green Oil Slick Mirror"]},
        ],
        "variants": [
            v(48772751753512, "Black Matte", "BronzeGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751786280, "Black Matte", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751819048, "Black Matte", "BronzeGlo™ Gold Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751851816, "Black Matte", "CarbonGlo™ No Mirror", "184.99", vi_map=ROAR_VI),
            v(48772751884584, "Black Matte", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751917352, "Black Matte", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751950120, "Crystal Matte", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772751982888, "Crystal Matte", "BronzeGlo™ Gold Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752015656, "Crystal Matte", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752081192, "Crystal Matte", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752113960, "Smoke Matte", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752146728, "Smoke Matte", "BronzeGlo™ Gold Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752179496, "Smoke Matte", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752212264, "Smoke Matte", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752245032, "Metallic Green", "BronzeGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752277800, "Metallic Green", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752310568, "Metallic Green", "BronzeGlo™ Gold Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752343336, "Metallic Green", "CarbonGlo™ No Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752376104, "Metallic Green", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752408872, "Metallic Green", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752507176, "Cyan Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752540104, "Cyan Matte Metallic", "BronzeGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752572872, "Cyan Matte Metallic", "CarbonGlo™ No Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752605640, "Cyan Matte Metallic", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752638248, "Cyan Matte Metallic", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752671016, "Cyan Matte Metallic", "CarbonGlo™ Green Oil Slick Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752736552, "Orange Matte Metallic", "BronzeGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752769320, "Orange Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752802088, "Orange Matte Metallic", "CarbonGlo™ No Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752834856, "Orange Matte Metallic", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752867624, "Redcat™ Red Matte Metallic", "BronzeGlo™ Red Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752900392, "Redcat™ Red Matte Metallic", "CarbonGlo™ No Mirror", "184.99", vi_map=ROAR_VI),
            v(48772752933160, "Redcat™ Red Matte Metallic", "CarbonGlo™ Silver Mirror", "204.99", vi_map=ROAR_VI),
            v(48772752965928, "Redcat™ Red Matte Metallic", "CarbonGlo™ Blue Mirror", "204.99", vi_map=ROAR_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029075725",
        "handle": "leap",
        "title": "Redcat® LEAP™",
        "description": "LEAP is built for all-day wear and high-output activity — feather-light, with FlexiFit™ nose piece and AirFlo™ vents. For pickleball, LumiGlo™ and FireGlo™ make the ball color pop against the background. Available in matte metallics and classic neutrals. Made in Italy.",
        "tags": ["pickleball", "tennis", "cycling", "general sports"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "144.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "174.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg", "altText": "LEAP Red"},
            {"url": f"{CDN}/leap_matte_black_lumiglo_outdoor_1.jpg", "altText": "LEAP Black"},
            {"url": f"{CDN}/leap_matte_crystal_fireglo_oudoor_1.jpg", "altText": "LEAP Crystal"},
            {"url": f"{CDN}/leap_matte_metallic_blue_fireglo_indoor_1.jpg", "altText": "LEAP Blue"},
            {"url": f"{CDN}/leap_matte_metallic_pink_fireglo_indoor_1.jpg", "altText": "LEAP Pink"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Black Matte", "Crystal Matte", "Smoke Matte", "Pink Matte Metallic", "Blue Matte Metallic", "Red Matte Metallic"]},
            {"name": "Lens Type", "values": ["FireGlo™ Indoor", "FireGlo™ Outdoor", "LumiGlo™ Indoor", "LumiGlo™ Outdoor", "PolarGlo™ Blue Mirror", "PolarGlo™ Green Mirror"]},
        ],
        "variants": [
            v(48772808835368, "Black Matte", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772808868136, "Black Matte", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772808900904, "Black Matte", "LumiGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772808933672, "Black Matte", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772808966440, "Black Matte", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
            v(48772808999208, "Black Matte", "PolarGlo™ Green Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809064744, "Crystal Matte", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809097512, "Crystal Matte", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809130280, "Crystal Matte", "LumiGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809163048, "Crystal Matte", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809195816, "Crystal Matte", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809228584, "Crystal Matte", "PolarGlo™ Green Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809261352, "Smoke Matte", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809294120, "Smoke Matte", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809326888, "Smoke Matte", "LumiGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809359656, "Smoke Matte", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809392424, "Smoke Matte", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809425192, "Smoke Matte", "PolarGlo™ Green Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809457960, "Pink Matte Metallic", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809490728, "Pink Matte Metallic", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809523496, "Pink Matte Metallic", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809556264, "Blue Matte Metallic", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809589032, "Blue Matte Metallic", "FireGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809621800, "Blue Matte Metallic", "LumiGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809654568, "Blue Matte Metallic", "LumiGlo™ Outdoor", "144.99", vi_map=LEAP_VI),
            v(48772809687336, "Blue Matte Metallic", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809720104, "Blue Matte Metallic", "PolarGlo™ Green Mirror", "174.99", vi_map=LEAP_VI),
            v(48772809752872, "Red Matte Metallic", "FireGlo™ Indoor", "144.99", vi_map=LEAP_VI),
            v(48772809785640, "Red Matte Metallic", "PolarGlo™ Blue Mirror", "174.99", vi_map=LEAP_VI),
        ],
    },
    {
        "id": "gid://shopify/Product/9596029042957",
        "handle": "strike",
        "title": "Redcat® STRIKE™",
        "description": "STRIKE is our classic sport frame, built for all-day wear across any pursuit — pickleball, disc golf, hiking, cycling, or the beach. TR-90, ultra-light and flexible. BronzeGlo™ brings out reds, oranges, and browns. CarbonGlo™ sharpens aquas, greens, and blue-grays. For pickleball, LumiGlo™ and FireGlo™ make the ball color pop. Made in Italy.",
        "tags": ["pickleball", "tennis", "running", "general sports", "disc golf"],
        "productType": "Sunglasses",
        "priceRange": {"minVariantPrice": {"amount": "119.99", "currencyCode": "USD"}, "maxVariantPrice": {"amount": "149.99", "currencyCode": "USD"}},
        "images": [
            {"url": f"{CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Tortoise"},
            {"url": f"{CDN}/strike_matte_smoke_translucent_lumiglo_outdoor_1.jpg", "altText": "STRIKE Smoke"},
            {"url": f"{CDN}/strike_matte_black_gray_polar_green_mirror_1.jpg", "altText": "STRIKE Black"},
            {"url": f"{CDN}/strike_matte_met_pink_fireglo_indoor_1.jpg", "altText": "STRIKE Pink"},
            {"url": f"{CDN}/strike_matte_crystal_fireglo_indoor_1.jpg", "altText": "STRIKE Crystal"},
        ],
        "options": [
            {"name": "Frame Color", "values": ["Smoke Matte", "Matte Black", "Tortoise Matte", "Pink Matte Metallic", "Crystal Matte"]},
            {"name": "Lens Type", "values": ["FireGlo™ Indoor", "FireGlo™ Outdoor", "LumiGlo™ Indoor", "LumiGlo™ Outdoor", "BronzeGlo™ No Mirror", "BronzeGlo™ Silver Mirror", "CarbonGlo™ No Mirror", "PolarGlo™ Blue Mirror", "PolarGlo™ Green Mirror"]},
        ],
        "variants": [
            v(48767582011688, "Smoke Matte", "FireGlo™ Indoor", "119.99", vi_map=STRIKE_VI),
            v(48767582044456, "Smoke Matte", "FireGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767582077224, "Smoke Matte", "LumiGlo™ Indoor", "119.99", vi_map=STRIKE_VI),
            v(48767582109992, "Smoke Matte", "LumiGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767581192488, "Smoke Matte", "PolarGlo™ Blue Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767581029928, "Matte Black", "BronzeGlo™ No Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581062696, "Matte Black", "BronzeGlo™ Silver Mirror", "139.99", vi_map=STRIKE_VI),
            v(48767580930344, "Matte Black", "CarbonGlo™ No Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581094184, "Matte Black", "PolarGlo™ Blue Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767581258024, "Matte Black", "PolarGlo™ Green Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767580963112, "Tortoise Matte", "BronzeGlo™ No Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767580995880, "Tortoise Matte", "BronzeGlo™ Silver Mirror", "139.99", vi_map=STRIKE_VI),
            v(48767581028648, "Tortoise Matte", "CarbonGlo™ No Mirror", "119.99", vi_map=STRIKE_VI),
            v(48767581323560, "Tortoise Matte", "PolarGlo™ Green Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767581684008, "Pink Matte Metallic", "FireGlo™ Indoor", "119.99", vi_map=STRIKE_VI),
            v(48767581716776, "Pink Matte Metallic", "BronzeGlo™ Silver Mirror", "139.99", vi_map=STRIKE_VI),
            v(48767581225256, "Pink Matte Metallic", "PolarGlo™ Blue Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767581946152, "Crystal Matte", "FireGlo™ Indoor", "119.99", vi_map=STRIKE_VI),
            v(48767581978920, "Crystal Matte", "FireGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767582011688, "Crystal Matte", "LumiGlo™ Indoor", "119.99", vi_map=STRIKE_VI),
            v(48767582044456, "Crystal Matte", "LumiGlo™ Outdoor", "119.99", vi_map=STRIKE_VI),
            v(48767582077224, "Crystal Matte", "PolarGlo™ Blue Mirror", "149.99", vi_map=STRIKE_VI),
            v(48767581290792, "Crystal Matte", "PolarGlo™ Green Mirror", "149.99", vi_map=STRIKE_VI),
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
    # Static variant image map for enriching live data
    static_product = next((p for p in STATIC_PRODUCTS if p["handle"] == handle), None)
    # Static variant image map — keyed by "Frame/Lens" (exact) and "Frame" (fallback)
    static_vi_map = {}
    if static_product:
        for sv in static_product.get("variants", []):
            frame = next((o["value"] for o in sv.get("selectedOptions", []) if o["name"] == "Frame Color"), None)
            lens = next((o["value"] for o in sv.get("selectedOptions", []) if o["name"] == "Lens Type"), None)
            if frame and sv.get("variantImages"):
                static_vi_map[frame] = sv["variantImages"]  # frame-level fallback
                if lens:
                    static_vi_map[f"{frame}/{lens}"] = sv["variantImages"]  # per-variant exact key

    try:
        data = await shopify_gql(PRODUCT_QUERY, {"handle": handle})
        p = data.get("productByHandle")
        if p:
            variants = []
            for e in p["variants"]["edges"]:
                var = e["node"]
                frame = next((o["value"] for o in var.get("selectedOptions", []) if o["name"] == "Frame Color"), None)
                lens = next((o["value"] for o in var.get("selectedOptions", []) if o["name"] == "Lens Type"), None)
                key = f"{frame}/{lens}" if frame and lens else frame
                var["variantImages"] = static_vi_map.get(key) or static_vi_map.get(frame, [])
                variants.append(var)
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
                "variants": variants,
                "options": p["options"],
            }
    except Exception as e:
        logger.warning(f"Shopify API unavailable for {handle}, using static: {e}")
    # Fallback to static data
    if static_product:
        return static_product
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
