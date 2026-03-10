import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowLeft } from 'lucide-react';
import { useAppNavigation } from '../context/NavigationContext';
import './CartPage.css';

const CartPage = () => {
    const { cart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems, getTotalShipping } = useCart();
    const { appNavigate } = useAppNavigation();

    const shippingCharge = getTotalShipping();
    const grandTotal = getTotalPrice() + shippingCharge;

    return (
        <div className="cart-page-root">
            <div className="cart-container">
                {/* Header */}
                <motion.div
                    className="cart-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="header-left">
                        <ShoppingCart size={32} className="header-icon" />
                        <div>
                            <h1>Your Cart</h1>
                            <p>{cart.length} product{cart.length !== 1 ? 's' : ''} • {getTotalItems()} total items</p>
                        </div>
                    </div>
                    <button onClick={() => appNavigate('home')} className="continue-shopping" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </button>
                </motion.div>

                {cart.length === 0 ? (
                    <motion.div
                        className="empty-cart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <ShoppingBag size={80} />
                        <h2>Your cart is empty</h2>
                        <p>Add some organic treasures to get started!</p>
                        <button onClick={() => appNavigate('home')} className="shop-now-btn" style={{ background: '#0b3d2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', textDecoration: 'none' }}>
                            Browse Products
                        </button>
                    </motion.div>
                ) : (
                    <div className="cart-layout">
                        {/* Items List */}
                        <div className="cart-items-section">
                            <AnimatePresence>
                                {cart.map((item, index) => {
                                    const itemId = item._id || item.id;
                                    const variantLabel = item.selectedVariant;
                                    return (
                                        <motion.div
                                            key={`${itemId}-${variantLabel || 'default'}`}
                                            className="cart-item-card"
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {/* Image */}
                                            <div className="item-image">
                                                <img src={item.imageUrl || item.image} alt={item.name} />
                                            </div>

                                            {/* Details */}
                                            <div className="item-details">
                                                <span className="item-category">{item.category}</span>
                                                <h3 className="item-name">{item.name}</h3>
                                                {variantLabel && <span className="item-variant" style={{ fontSize: '12px', background: '#ececec', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{variantLabel}</span>}
                                                <p className="item-price">₹{item.price}</p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="quantity-controls">
                                                <motion.button
                                                    className="qty-btn"
                                                    onClick={() => decrementQuantity(itemId, variantLabel)}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Minus size={14} />
                                                </motion.button>
                                                <motion.span
                                                    className="qty-value"
                                                    key={item.quantity}
                                                    initial={{ scale: 1.2 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    {item.quantity}
                                                </motion.span>
                                                <motion.button
                                                    className="qty-btn"
                                                    onClick={() => incrementQuantity(itemId, variantLabel)}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Plus size={14} />
                                                </motion.button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="item-subtotal">
                                                <span className="subtotal-label">Subtotal</span>
                                                <span className="subtotal-value">₹{item.price * item.quantity}</span>
                                            </div>

                                            {/* Remove */}
                                            <motion.button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(itemId, variantLabel)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Summary */}
                        <motion.div
                            className="order-summary"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="summary-header">
                                <Leaf size={20} />
                                <h2>Order Summary</h2>
                            </div>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span>Subtotal ({getTotalItems()} items)</span>
                                    <span>₹{getTotalPrice()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    {shippingCharge === 0 ? <span className="free">FREE</span> : <span>₹{shippingCharge}</span>}
                                </div>
                                <div className="summary-row">
                                    <span>Eco Packaging</span>
                                    <span className="free">FREE</span>
                                </div>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span className="total-value">₹{grandTotal}</span>
                            </div>

                            <motion.button
                                className="checkout-btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => appNavigate('checkout')}
                            >
                                Proceed to Checkout
                            </motion.button>

                            <button className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
