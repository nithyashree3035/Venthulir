import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

const WishlistPage = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { toggleCart, isInCart } = useCart();

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
                    <Link to="/" className="continue-shopping">
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </Link>
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
                        <Link to="/" className="shop-now-btn">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="wishlist-grid">
                        <AnimatePresence>
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="wishlist-item-card"
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {/* Image */}
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
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
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>

                                    {/* Add to Cart - Shows cart status */}
                                    <motion.button
                                        className={`add-to-cart-btn ${isInCart(item.id) ? 'in-cart' : ''}`}
                                        onClick={() => handleAddToCart(item)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ShoppingCart size={16} />
                                        {isInCart(item.id) ? '✓ In Cart - Remove' : 'Add to Cart'}
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
