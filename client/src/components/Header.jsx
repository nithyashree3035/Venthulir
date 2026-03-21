import React from 'react';
import logo from '../assets/organic.png';
import './Header.css';

const Header = () => {
    const tickerSentence = "🌿 Nature's Best, For all the Rest • 100% Organic Certified • Free Shipping on Orders Above ₹499 • Royal Quality Guaranteed • ";

    return (
        <header className="vent-royal-header">
            {/* LAYER 1: THE RUNNING SLOGAN */}
            <div className="announcement-ticker">
                <div className="ticker-wrap">
                    <div className="ticker-move">
                        <span>{tickerSentence}</span>
                        <span>{tickerSentence}</span>
                    </div>
                </div>
            </div>

            {/* LAYER 2: MAIN ROYAL NAV */}
            <nav className="nav-main">
                <div className="nav-left">
                    <div className="nav-logo">
                        <img src={logo} alt="Venthulir Logo" style={{ height: '45px', objectFit: 'contain' }} />
                    </div>
                    <div className="nav-location">
                        <span className="loc-icon">📍</span>
                        <div className="loc-stack">
                            <span className="text-small">Deliver to</span>
                            <span className="text-bold">India</span>
                        </div>
                    </div>
                </div>

                {/* Amazon-Style Wide Search */}
                <div className="nav-search">
                    <input type="text" placeholder="Search fresh harvest, cold pressed oils, raw honey..." aria-label="Search products" />
                    <button className="search-btn" aria-label="Search submit">🔍</button>
                </div>

                <div className="nav-right">
                    <a href="/" className="nav-link-item">
                        <span className="text-bold">Home</span>
                    </a>

                    <a href="/products" className="nav-link-item">
                        <span className="text-bold">Products</span>
                    </a>

                    <a href="/wishlist" className="nav-link-item">
                        <div className="nav-stack">
                            <span className="text-small">Saved</span>
                            <span className="text-bold">Wishlist</span>
                        </div>
                    </a>

                    <a href="/about" className="nav-link-item">
                        <span className="text-bold">About</span>
                    </a>

                    {/* PROFILE / AUTH SECTION */}
                    <div className="nav-link-item profile-dropdown">
                        <div className="nav-stack">
                            <span className="text-small">Hello, Sign in</span>
                            <span className="text-bold">Profile ▾</span>
                        </div>
                        {/* The Login/Signup Dropdown */}
                        <div className="dropdown-panel">
                            <button className="login-btn">Sign in</button>
                            <p className="signup-note">New customer? <span>Start here.</span></p>
                            <hr className="nav-divider" />
                            <ul className="dropdown-links">
                                <li>Your Account</li>
                                <li>Your Orders</li>
                                <li>Personal Harvest</li>
                            </ul>
                        </div>
                    </div>

                    <a href="/cart" className="nav-link-item cart-btn">
                        <div className="cart-icon-container">
                            <span className="cart-badge">0</span>
                            <span className="cart-icon">🛒</span>
                        </div>
                        <span className="text-bold">Cart</span>
                    </a>
                </div>
            </nav>

            {/* LAYER 3: QUICK CATEGORY BAR */}
            <div className="nav-sub">
                <ul>
                    <li><strong>☰ All Categories</strong></li>
                    <li>Fresh Harvest</li>
                    <li>Cold Pressed Oils</li>
                    <li>Raw Honey</li>
                    <li>Traditional Ghee</li>
                    <li>Handmade Textiles</li>
                    <li>Royal Gift Boxes</li>
                </ul>
            </div>
        </header>
    );
};

export default Header;