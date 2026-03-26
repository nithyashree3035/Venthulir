import React, { useState, useEffect, useCallback } from 'react';
import {
    ShoppingCart, Clock, Star, Tag, Zap,
    Check, Heart, Eye, ChevronRight, Flame
} from 'lucide-react';
import { API_BASE } from '../constants';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAppNavigation } from '../context/NavigationContext';
import './SpecialOffers.css';

/* ─── Countdown hook ─────────────────────────────────────────── */
function useCountdown(endDate) {
    const calc = useCallback(() => {
        const diff = new Date(endDate) - Date.now();
        if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
        return {
            d: Math.floor(diff / 86400000),
            h: Math.floor((diff % 86400000) / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            expired: false,
        };
    }, [endDate]);

    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [calc]);
    return time;
}

/* ─── Single Offer Card ─────────────────────────────────────── */
function OfferCard({ offer }) {
    const { addToCart, toggleCart, isInCart } = useCart() || {};
    const { wishlist, toggleWishlist } = useWishlist() || {};
    const { isAuthenticated } = useAuth() || {};
    const { appNavigate } = useAppNavigation() || {};

    const time = useCountdown(offer.endDate);
    // Use admin-set values where available, fall back to auto-calculated
    const displayMrp = offer.mrpIllusion || offer.price;
    const discountPct = offer.discountPercent
        ? Math.round(offer.discountPercent)
        : Math.round(((displayMrp - offer.offerPrice) / displayMrp) * 100);
    const isStockOver = offer.stock <= 0;
    const productId = offer._id;
    const inCart = isInCart ? isInCart(productId) : false;
    const isWishlisted = wishlist ? wishlist.some(i => (i._id || i.id) === productId) : false;

    const pad = n => String(n).padStart(2, '0');

    const handleCart = (e) => {
        e.stopPropagation();
        if (isStockOver || !addToCart) return;
        /* Normalise the offer into the cart shape the rest of the app expects */
        const cartItem = {
            _id: offer._id,
            id: offer._id,
            name: offer.name,
            price: offer.offerPrice,         // buyer pays offer price
            originalPrice: offer.price,      // for display
            imageUrl: offer.imageUrl || offer.images?.[0] || '',
            images: offer.images || [],
            category: offer.category,
            description: offer.description,
            shippingCharge: 0,
            isOffer: true,
        };
        toggleCart(cartItem);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        if (!toggleWishlist) return;
        toggleWishlist({ _id: offer._id, name: offer.name, price: offer.offerPrice, imageUrl: offer.imageUrl, category: offer.category });
    };

    return (
        <article className="sof-card" aria-label={`Special offer: ${offer.name}`}>
            {/* ── Image area ── */}
            <div className="sof-media">
                {/* Discount badge */}
                <div className="sof-discount-badge">-{discountPct}%</div>

                {/* Wishlist & eye hover actions */}
                <div className="sof-hover-actions">
                    <button className={`sof-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
                        onClick={handleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                    <button className="sof-icon-btn" aria-label="Preview offer">
                        <Eye size={16} />
                    </button>
                </div>

                <img
                    src={offer.imageUrl || offer.images?.[0] || '/organic.png'}
                    alt={offer.name}
                    loading="lazy"
                    className="sof-img"
                    onError={e => { e.target.onerror = null; e.target.src = '/organic.png'; }}
                />

                {/* Badge label */}
                {offer.badge && (
                    <span className="sof-img-badge">
                        <Zap size={10} fill="currentColor" /> {offer.badge}
                    </span>
                )}
            </div>

            {/* ── Body ── */}
            <div className="sof-body">
                {/* Category + Condition */}
                <div className="sof-meta-row">
                    <span className="sof-category"><Tag size={10} /> {offer.category}</span>
                    {offer.condition && (
                        <span className="sof-condition-chip">{offer.condition}</span>
                    )}
                </div>

                <h3 className="sof-name">{offer.name}</h3>
                <p className="sof-desc">{offer.description}</p>

                {/* Star rating */}
                {offer.rating > 0 && (
                    <div className="sof-rating" aria-label={`${offer.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12}
                                fill={s <= Math.round(offer.rating) ? '#d4af37' : 'none'}
                                color={s <= Math.round(offer.rating) ? '#d4af37' : '#ccc'} />
                        ))}
                        <span className="sof-rating-num">({offer.rating.toFixed(1)})</span>
                    </div>
                )}

                {/* Pricing */}
                <div className="sof-discount-row">
                    <span className="sof-disc-tag">-{discountPct}% OFF</span>
                    <span className="sof-flash-tag">FLASH OFFER</span>
                </div>
                <div className="sof-pricing">
                    <span className="sof-symbol">₹</span>
                    <span className="sof-offer-price">{offer.offerPrice.toLocaleString('en-IN')}</span>
                    <span className="sof-mrp">M.R.P: <s>₹{displayMrp.toLocaleString('en-IN')}</s></span>
                </div>
                <div className="sof-save-chip">
                    You save ₹{(displayMrp - offer.offerPrice).toLocaleString('en-IN')}
                </div>

                {/* Countdown timer */}
                {!time.expired && !isStockOver && (
                    <div className="sof-timer" aria-label="Offer countdown timer">
                        <Clock size={12} /> <span>Ends in</span>
                        <div className="sof-timer-blocks">
                            <span className="sof-tblock">{pad(time.d)}<small>d</small></span>
                            <span className="sof-tsep">:</span>
                            <span className="sof-tblock">{pad(time.h)}<small>h</small></span>
                            <span className="sof-tsep">:</span>
                            <span className="sof-tblock">{pad(time.m)}<small>m</small></span>
                            <span className="sof-tsep">:</span>
                            <span className="sof-tblock">{pad(time.s)}<small>s</small></span>
                        </div>
                    </div>
                )}

                {/* Stock progress */}
                <div className="sof-stock-row">
                    <div className="sof-stock-bar">
                        <div
                            className="sof-stock-fill"
                            style={{ width: `${Math.min((Math.max(offer.stock, 0) / 60) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="sof-stock-label">
                        {isStockOver ? 'Offer Closed' : `${offer.stock} left`}
                    </span>
                </div>

                {/* CTA Buttons */}
                <div className="sof-btn-row">
                    <button
                        className={`sof-cart-btn ${inCart ? 'in-cart' : ''} ${isStockOver ? 'closed' : ''}`}
                        onClick={handleCart}
                        disabled={isStockOver}
                        aria-label={isStockOver ? 'Offer closed' : inCart ? 'Added to cart' : `Add ${offer.name} to cart`}
                    >
                        {inCart ? <Check size={15} /> : <ShoppingCart size={15} />}
                        <span>{isStockOver ? 'OFFER CLOSED' : inCart ? 'ADDED' : 'ADD TO CART'}</span>
                    </button>
                    {!isStockOver && (
                        <button
                            className="sof-buy-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isAuthenticated) {
                                    appNavigate?.('checkout', { productId });
                                } else {
                                    appNavigate?.('auth', { redirectView: 'checkout', redirectParams: { productId } });
                                }
                            }}
                        >
                            BUY NOW
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ─── Main Section ─────────────────────────────────────────────── */
export default function SpecialOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/offers/active`, { signal: controller.signal });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setOffers(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name !== 'AbortError') console.warn('Offers load failed:', err.message);
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    return (
        <section className="sof-section" id="special-offers" aria-labelledby="sof-heading">

            {/* ══ FULL-WIDTH RED BANNER — ALWAYS VISIBLE ══ */}
            <div className="sof-banner" role="banner">
                <div className="sof-banner-inner">
                    <div className="sof-banner-left">
                        <span className="sof-banner-icon">🔥</span>
                        <span className="sof-banner-title">LIMITED OFFER</span>
                    </div>
                    <div className="sof-banner-center">
                        <span>First 60 Members Only</span>
                        <span className="sof-banner-sep">•</span>
                        <span>Hurry Up! Stock Running Out Fast!</span>
                        <span className="sof-banner-sep">•</span>
                        <span>Grab Your Exclusive Deal Now!</span>
                    </div>
                    <div className="sof-banner-right">
                        <span className="sof-banner-tag">HURRY!</span>
                    </div>
                </div>
            </div>

            {/* ══ OFFER CARDS — only when active offers exist ══ */}
            {!loading && offers.length > 0 && (
                <>
                    <div className="sof-header-wrap">
                        <div className="sof-header-content">
                            <div className="sof-header-icon-wrap">
                                <Flame size={24} />
                            </div>
                            <div>
                                <h2 id="sof-heading" className="sof-section-title">
                                    🔥 Special Limited Offers
                                </h2>
                                <p className="sof-section-sub">
                                    Exclusive deals crafted for Venthulir's early members
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="sof-grid">
                        {offers.map(offer => (
                            <OfferCard key={offer._id} offer={offer} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
