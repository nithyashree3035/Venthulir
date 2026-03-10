const Product = require('../models/Product');

// Fields to EXCLUDE from customer-facing responses
const STOCK_FIELDS_EXCLUDE = '-initialStock -currentStock -updatedAt';

exports.getProducts = async (req, res) => {
    try {
        const { category, search, badge, page = 1, limit = 12 } = req.query;
        let query = {};

        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        if (badge === 'New Arrival') {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query.$or = [
                { badge: 'New Arrival' },
                { createdAt: { $gte: thirtyDaysAgo } }
            ];
        } else if (badge) {
            query.badge = badge;
        }

        const products = await Product.find(query)
            .select(STOCK_FIELDS_EXCLUDE)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalItems: count
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select(STOCK_FIELDS_EXCLUDE);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
