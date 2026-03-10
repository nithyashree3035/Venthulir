const Product = require('../models/Product');

/**
 * GET /api/admin/inventory
 * Returns full inventory dashboard for admin only.
 */
exports.getInventory = async (req, res) => {
    try {
        const products = await Product.find().sort({ currentStock: 1 });




        const totalProducts = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
        const lowStockProducts = products.filter(p => p.currentStock > 0 && p.currentStock < 10);
        const outOfStockProducts = products.filter(p => p.currentStock === 0);

        res.json({
            totalProducts,
            totalStock,
            lowStockProducts,
            outOfStockProducts,
            allProducts: products
        });
    } catch (err) {
        console.error('Inventory fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

/**
 * PUT /api/admin/inventory/:productId/restock
 * Manually adjust stock for a product.
 * Body: { quantity: Number }
 */
exports.restockProduct = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 0) {
            return res.status(400).json({ error: 'Invalid quantity. Must be a positive number.' });
        }

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.currentStock += Number(quantity);
        product.updatedAt = new Date();
        await product.save();

        res.json({ msg: 'Stock updated successfully', product });
    } catch (err) {
        console.error('Restock error:', err);
        res.status(500).json({ error: 'Failed to update stock' });
    }
};

/**
 * Utility: Atomically reduce stock when an order is placed.
 * Called internally from couponController (checkout).
 * Returns { success: boolean, error?: string }
 */
exports.reduceStock = async (items) => {
    for (const item of items) {
        const productId = item.product;
        const qty = item.quantity || 1;

        // Atomic find + update: only succeeds if stock is sufficient
        const updated = await Product.findOneAndUpdate(
            { _id: productId, currentStock: { $gte: qty } },
            { $inc: { currentStock: -qty }, $set: { updatedAt: new Date() } },
            { new: true }
        );

        if (!updated) {
            // Could not reduce stock - either out of stock or product not found
            const product = await Product.findById(productId).select('name currentStock');
            const stockLeft = product ? product.currentStock : 0;
            const name = product ? product.name : productId;
            return { success: false, error: `"${name}" is Out of Stock. Only ${stockLeft} left.` };
        }
    }
    return { success: true };
};

/**
 * Utility: Restore stock on cancellation or return.
 */
exports.restoreStock = async (items) => {
    for (const item of items) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { currentStock: item.quantity || 1 }, $set: { updatedAt: new Date() } }
        );
    }
};
