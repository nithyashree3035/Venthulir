import React, { useState } from 'react';
import { Bell, Sparkles, Send } from 'lucide-react';
import './NewArrivalsPage.css';

const NewArrivalsPage = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            // Here you would typically connect to your backend API
        }
    };

    return (
        <div className="new-arrivals-root">
            <div className="arrivals-hero">
                <div className="hero-content">
                    <div className="new-tag">
                        <Sparkles size={16} /> <span>COMING SOON</span>
                    </div>
                    <h1>Fresh From The Soil</h1>
                    <p>Our farmers are currently harvesting the next batch of premium organic spices. Be the first to know when they land in our store.</p>
                </div>
            </div>

            <section className="notify-section">
                <div className="notify-card">
                    <div className="notify-icon">
                        <Bell size={32} className="royal-gold-icon" />
                    </div>

                    {!subscribed ? (
                        <form onSubmit={handleSubscribe} className="notify-form">
                            <h3>Get Notified</h3>
                            <p>Enter your email to receive a royal alert the moment we restock.</p>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Your royal email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="notify-submit-btn">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="success-msg">
                            <div className="check-circle">✓</div>
                            <h3>You're on the list!</h3>
                            <p>We'll send a notification to <strong>{email}</strong> soon.</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="seasonal-preview">
                <h3>Seasonal Sneak Peek</h3>
                <div className="preview-placeholder-grid">
                    {/* Visual placeholders for upcoming items */}
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                </div>
            </div>
        </div>
    );
};

export default NewArrivalsPage;