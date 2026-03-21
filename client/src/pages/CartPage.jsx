import React from 'react';
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
                <div className="cart-header fade-in">
                    <div className="header-left">
                        <ShoppingCart size={32} className="header-icon" />
                        <div>
                            <h1>Your Cart</h1>
                            <p>{cart.length} product{cart.length !== 1 ? 's' : ''} • {getTotalItems()} total items</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => appNavigate('home')} className="continue-shopping" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart fade-in">
                        <ShoppingBag size={80} />
                        <h2>Your cart is empty</h2>
                        <p>Add some organic treasures to get started!</p>
                        <button type="button" onClick={() => appNavigate('home')} className="shop-now-btn" style={{ background: '#0b3d2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', textDecoration: 'none' }}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Items List */}
                        <div className="cart-items-section">
                            {cart.map((item, index) => {
                                const itemId = item._id || item.id;
                                const variantLabel = item.selectedVariant;
                                return (
                                    <div
                                        key={`${itemId}-${variantLabel || 'default'}`}
                                        className="cart-item-card fade-in-up"
                                        style={{ animationDelay: `${index * 0.05}s` }}
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
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => decrementQuantity(itemId, variantLabel)}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-value">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => incrementQuantity(itemId, variantLabel)}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="item-subtotal">
                                            <span className="subtotal-label">Subtotal</span>
                                            <span className="subtotal-value">₹{item.price * item.quantity}</span>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeFromCart(itemId, variantLabel)}
                                            aria-label="Remove item from cart"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="order-summary slide-in-right">
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

                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={() => appNavigate('checkout')}
                            >
                                Proceed to Checkout
                            </button>

                            <button type="button" className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .fade-in { animation: fadeIn 0.5s ease forwards; }
                .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
                .slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default CartPage;
