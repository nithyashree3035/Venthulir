import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Clock, Star, Tag, Flame, ChevronRight } from 'lucide-react';
import { API_BASE } from '../constants';
import './SpecialOffers.css';

// ── Countdown hook ────────────────────────────────────────────────
function useCountdown(endDate) {
    const calcTime = useCallback(() => {
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

    const [time, setTime] = useState(calcTime);

    useEffect(() => {
        const id = setInterval(() => setTime(calcTime()), 1000);
        return () => clearInterval(id);
    }, [calcTime]);

    return time;
}

// ── Individual Offer Card ─────────────────────────────────────────
function OfferCard({ offer, onAddToCart }) {
    const time = useCountdown(offer.endDate);
    const discountPct = Math.round(((offer.price - offer.offerPrice) / offer.price) * 100);
    const isStockOver = offer.stock <= 0;

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <article className="offer-card" aria-label={`Special offer: ${offer.name}`}>
            {/* Red Ribbon Banner */}
            <div className="offer-ribbon" role="banner">
                <span>🔥 LIMITED OFFER</span>
                <span className="ribbon-sep">•</span>
                <span>First 60 Members Only</span>
            </div>

            {/* Discount Badge */}
            <div className="offer-discount-badge" aria-label={`${discountPct}% off`}>
                -{discountPct}%
            </div>

            {/* Image */}
            <div className="offer-img-wrap">
                <img
                    src={offer.imageUrl || offer.images?.[0] || '/placeholder-offer.jpg'}
                    alt={offer.name}
                    loading="lazy"
                    className="offer-img"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300/0b3d2e/d4af37?text=Offer';
                    }}
                />
                {offer.badge && (
                    <span className="offer-img-badge">{offer.badge}</span>
                )}
            </div>

            {/* Content */}
            <div className="offer-body">
                {/* Category + Condition */}
                <div className="offer-meta-row">
                    <span className="offer-category">
                        <Tag size={11} /> {offer.category}
                    </span>
                    {offer.condition && (
                        <span className="offer-condition">{offer.condition}</span>
                    )}
                </div>

                <h3 className="offer-name">{offer.name}</h3>
                <p className="offer-desc">{offer.description}</p>

                {/* Star Rating */}
                {offer.rating > 0 && (
                    <div className="offer-rating" aria-label={`Rating: ${offer.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={14}
                                fill={s <= Math.round(offer.rating) ? '#d4af37' : 'none'}
                                color={s <= Math.round(offer.rating) ? '#d4af37' : '#ccc'}
                            />
                        ))}
                        <span className="offer-rating-val">({offer.rating.toFixed(1)})</span>
                    </div>
                )}

                {/* Pricing */}
                <div className="offer-price-block">
                    <span className="offer-price-new" aria-label={`Offer price: ₹${offer.offerPrice}`}>
                        ₹{offer.offerPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="offer-price-old" aria-label={`Original price: ₹${offer.price}`}>
                        ₹{offer.price.toLocaleString('en-IN')}
                    </span>
                    <span className="offer-save-chip">Save ₹{(offer.price - offer.offerPrice).toLocaleString('en-IN')}</span>
                </div>

                {/* Countdown */}
                {!time.expired && !isStockOver && (
                    <div className="offer-timer" aria-label="Time remaining">
                        <Clock size={13} />
                        <span>Ends in:</span>
                        <div className="timer-block"><span>{pad(time.d)}</span><small>d</small></div>
                        <div className="timer-sep">:</div>
                        <div className="timer-block"><span>{pad(time.h)}</span><small>h</small></div>
                        <div className="timer-sep">:</div>
                        <div className="timer-block"><span>{pad(time.m)}</span><small>m</small></div>
                        <div className="timer-sep">:</div>
                        <div className="timer-block"><span>{pad(time.s)}</span><small>s</small></div>
                    </div>
                )}

                {/* Stock indicator */}
                <div className="offer-stock" aria-label={`Stock: ${offer.stock} remaining`}>
                    <div
                        className="stock-bar"
                        role="progressbar"
                        aria-valuenow={Math.min(offer.stock, 60)}
                        aria-valuemin={0}
                        aria-valuemax={60}
                    >
                        <div
                            className="stock-fill"
                            style={{ width: `${Math.min((offer.stock / 60) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="stock-label">
                        {isStockOver ? 'Offer Closed' : `${offer.stock} left`}
                    </span>
                </div>

                {/* CTA */}
                <button
                    className={`offer-cart-btn ${isStockOver ? 'out' : ''}`}
                    onClick={() => !isStockOver && onAddToCart(offer)}
                    disabled={isStockOver}
                    aria-label={isStockOver ? 'Offer closed' : `Add ${offer.name} to cart`}
                >
                    {isStockOver ? (
                        'Offer Closed'
                    ) : (
                        <>
                            <ShoppingCart size={16} />
                            Add to Cart
                            <ChevronRight size={14} />
                        </>
                    )}
                </button>
            </div>
        </article>
    );
}

// ── Main SpecialOffers Section ────────────────────────────────────
export default function SpecialOffers({ onAddToCart }) {
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

    if (loading) {
        return (
            <section className="offers-section" aria-busy="true">
                <div className="offers-skeleton-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="offer-skeleton" />
                    ))}
                </div>
            </section>
        );
    }

    if (!offers.length) return null; // Render nothing when no active offers

    return (
        <section className="offers-section" id="special-offers" aria-labelledby="offers-heading">
            {/* Section Header */}
            <div className="offers-header">
                <div className="offers-header-icon">
                    <Flame size={28} />
                </div>
                <div>
                    <h2 id="offers-heading" className="offers-title">
                        Special Limited Offers
                    </h2>
                    <p className="offers-subtitle">
                        Exclusive deals for early members — grab before they're gone!
                    </p>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="offers-grid">
                {offers.map((offer) => (
                    <OfferCard
                        key={offer._id}
                        offer={offer}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </section>
    );
}
