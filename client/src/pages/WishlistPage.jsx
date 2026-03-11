import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAppNavigation } from '../context/NavigationContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import './WishlistPage.css';

const WishlistPage = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { toggleCart, isInCart } = useCart();
    const { appNavigate } = useAppNavigation();

    const handleAddToCart = (product) => {
        toggleCart(product);
    };

    const handleRemove = (product) => {
        toggleWishlist(product);
    };

    return (
        <div className="wishlist-page-root">
            <div className="wishlist-container">
                {/* Header */}
                <motion.div
                    className="wishlist-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="header-left">
                        <Heart size={32} className="header-icon" fill="#d4af37" />
                        <div>
                            <h1>Your Wishlist</h1>
                            <p>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
                        </div>
                    </div>
                    <button
                        className="continue-shopping"
                        onClick={() => appNavigate('home')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                    >
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </button>
                </motion.div>

                {wishlist.length === 0 ? (
                    <motion.div
                        className="empty-wishlist"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Heart size={80} />
                        <h2>Your wishlist is empty</h2>
                        <p>Save your favorite organic products here!</p>
                        <button
                            className="shop-now-btn"
                            onClick={() => appNavigate('home')}
                            style={{ background: '#0b3d2e', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', fontWeight: '700', fontSize: '14px' }}
                        >
                            Browse Products
                        </button>
                    </motion.div>
                ) : (
                    <div className="wishlist-grid">
                        <AnimatePresence>
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id || item._id}
                                    className="wishlist-item-card"
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {/* Image */}
                                    <div className="item-image">
                                        <img src={item.imageUrl || item.image} alt={item.name} />
                                        <motion.button
                                            className="remove-btn"
                                            onClick={() => handleRemove(item)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>

                                    {/* Details */}
                                    <div className="item-details">
                                        <span className="item-category">{item.category}</span>
                                        <h3
                                            className="item-name"
                                            onClick={() => appNavigate('product', { id: item._id || item.id })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>

                                    {/* Add to Cart */}
                                    <motion.button
                                        className={`add-to-cart-btn ${isInCart(item.id || item._id) ? 'in-cart' : ''}`}
                                        onClick={() => handleAddToCart(item)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ShoppingCart size={16} />
                                        {isInCart(item.id || item._id) ? '✓ In Cart - Remove' : 'Add to Cart'}
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
