---
description: Add a new product to the Venthulir catalog (admin panel)
---

## Steps

1. Login to the Admin Panel at `http://localhost:5173` using admin credentials.

2. Click **"Add Harvest"** in the sidebar.

3. Fill in the form:
   - **Harvest Gallery** – Upload up to 5 images (1st = primary)
   - **Name** – Product name (required)
   - **Category** – Select from: General, Spices, Essential Oils, Health & Skin Care, Wellness Products
   - **Badge** – Optional: Best Seller, New Arrival, Pure, Premium, Organic
   - **Initial Stock (Units) 🔒** – Number of units available at launch (admin-only, hidden from customers)
   - **Measurements & Pricing** – Add variants like "100g - ₹150"
   - **Description** – Product details (required)

4. Click **"Publish Harvest"** to save.

5. Verify in:
   - **All Products tab** → Product appears with auto-generated `VNT-XXXXXX` code
   - **Inventory tab** → Stock levels show correctly as IN STOCK / LOW STOCK / OUT OF STOCK

## Notes
- `productCode` is auto-generated (format: `VNT-XXXXXX`) — no manual input needed
- `currentStock` is automatically set equal to `initialStock` on creation
- Stock is **never visible to customers** — only admin sees it
- Editing `initialStock` in Edit mode resets `currentStock` to match
