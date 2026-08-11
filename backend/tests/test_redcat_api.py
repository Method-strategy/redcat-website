import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProductAPI:
    """Product endpoints tests"""

    def test_get_products_returns_4(self):
        r = requests.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        data = r.json()
        assert "products" in data
        assert len(data["products"]) == 4
        print(f"PASS: Got {len(data['products'])} products")

    def test_get_products_has_expected_handles(self):
        r = requests.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        handles = [p["handle"] for p in r.json()["products"]]
        for h in ["beast", "roar", "leap", "strike"]:
            assert h in handles, f"Missing product: {h}"
        print(f"PASS: All 4 handles found: {handles}")

    def test_get_products_has_prices(self):
        r = requests.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        for p in r.json()["products"]:
            price = p["priceRange"]["minVariantPrice"]["amount"]
            assert float(price) > 0
        print("PASS: All products have valid prices")

    def test_get_beast_product(self):
        r = requests.get(f"{BASE_URL}/api/products/beast")
        assert r.status_code == 200
        data = r.json()
        assert data["handle"] == "beast"
        assert "BEAST" in data["title"]
        assert len(data["variants"]) > 0
        assert len(data["options"]) >= 2
        print(f"PASS: BEAST product - {data['title']}, {len(data['variants'])} variants")

    def test_get_beast_has_frame_and_lens_options(self):
        r = requests.get(f"{BASE_URL}/api/products/beast")
        assert r.status_code == 200
        data = r.json()
        option_names = [o["name"] for o in data["options"]]
        assert "Frame Color" in option_names
        assert "Lens Type" in option_names
        print(f"PASS: Options found: {option_names}")

    def test_get_roar_product(self):
        r = requests.get(f"{BASE_URL}/api/products/roar")
        assert r.status_code == 200
        assert r.json()["handle"] == "roar"

    def test_get_leap_product(self):
        r = requests.get(f"{BASE_URL}/api/products/leap")
        assert r.status_code == 200
        assert r.json()["handle"] == "leap"

    def test_get_strike_product(self):
        r = requests.get(f"{BASE_URL}/api/products/strike")
        assert r.status_code == 200
        assert r.json()["handle"] == "strike"

    def test_get_nonexistent_product_404(self):
        r = requests.get(f"{BASE_URL}/api/products/nonexistent-product")
        assert r.status_code == 404
        print("PASS: 404 for non-existent product")


class TestNewsletterAPI:
    """Newsletter subscription tests"""

    def test_subscribe_newsletter(self):
        r = requests.post(f"{BASE_URL}/api/newsletter", json={"email": "test_redcat@example.com"})
        assert r.status_code == 200
        assert "subscribed" in r.json().get("message", "").lower()
        print(f"PASS: Newsletter: {r.json()}")

    def test_subscribe_newsletter_duplicate_ok(self):
        # Upsert should be idempotent
        r = requests.post(f"{BASE_URL}/api/newsletter", json={"email": "test_redcat@example.com"})
        assert r.status_code == 200
        print("PASS: Duplicate subscription is idempotent")

