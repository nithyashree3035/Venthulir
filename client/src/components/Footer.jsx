import React, { useState } from 'react';
import { ChevronUp, Send, MapPin, Phone, Mail, Instagram, Facebook, Twitter, CreditCard } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', orderId: '', email: '', concern: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const combinedMessage = `[Order: ${formData.orderId}] [Concern: ${formData.concern}] ${formData.message}`;
            const res = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerEmail: formData.email,
                    message: combinedMessage
                })
            });
            if (res.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', orderId: '', email: '', concern: '', message: '' });
                // Reset form after 3 seconds so they can send another message
                setTimeout(() => setIsSubmitted(false), 3000);
            } else {
                alert('Failed to log grievance. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Service currently unavailable.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="imperial-footer-beige">
            <button className="back-to-top" onClick={backToTop} title="Back to Top">
                <ChevronUp size={24} />
            </button>

            <div className="footer-main-wrapper">
                <div className="footer-grid-layout">

                    {/* LEFT: OUR ROOTS & CONTACT */}
                    <div className="footer-column" id="roots">
                        <h3 className="royal-green-title">OUR ROOTS</h3>
                        <p className="footer-p" style={{ marginBottom: '20px' }}>
                            Deeply embedded in the heritage of Salem's fertile lands, Venthulir is a preservation of ancestral wisdom. We bypass industrial processing to bring you wood-pressed oils and forest-fresh harvests.
                        </p>
                        <h3 className="royal-green-title" style={{ marginTop: '20px', marginBottom: '15px' }}>REACH US</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#1a1a1a', fontSize: '13px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}><MapPin size={16} style={{ color: '#0a2e1f', marginTop: '2px' }}/> 123 Heritage Street, Salem, Tamil Nadu - 636001</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} style={{ color: '#0a2e1f' }}/> +91-8778476414</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} style={{ color: '#0a2e1f' }}/> support@venthulir.com</div>
                        </div>
                    </div>

                    {/* MIDDLE: QUICK LINKS */}
                    <div className="footer-column" id="links">
                        <h3 className="royal-green-title">QUICK LINKS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Shop Best Sellers</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Our Story</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Health Benefits</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Track Order</a>
                        </div>
                        
                        <h3 className="royal-green-title" style={{ marginTop: '30px', marginBottom: '15px' }}>POLICIES</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Shipping & Returns</a>
                            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>Refund Policy</a>
                        </div>
                    </div>

                    {/* RIGHT: GRIEVANCE FORM */}
                    <div className="footer-column" id="complaints">
                        <h3 className="royal-green-title">GRIEVANCE REGISTRY</h3>
                        {isSubmitted ? (
                            <div className="success-banner">Your grievance has been logged in the Royal Registry.</div>
                        ) : (
                            <form className="traditional-form" onSubmit={handleSubmit}>
                                <div className="form-split">
                                    <input
                                        type="text" placeholder="Name" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="Order #" required
                                        value={formData.orderId} onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="email" placeholder="Email Address (for official reply)" required
                                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px' }}
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <select
                                    required
                                    value={formData.concern} onChange={e => setFormData({ ...formData, concern: e.target.value })}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <option value="">Nature of Concern</option>
                                    <option>Damaged Product</option>
                                    <option>Delivery Delay</option>
                                    <option>Quality Concern</option>
                                    <option>Other</option>
                                </select>
                                <textarea
                                    placeholder="Describe your concern here..." required
                                    value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                                <button type="submit" className="royal-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'LOGGING...' : 'SUBMIT TO REGISTRY'} <Send size={14} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* CENTERED: CIRCULAR VENTHULIR ONLY */}
                <div className="circular-motion-container">
                    <div className="rotating-brand">
                        <svg viewBox="0 0 100 100">
                            <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
                            <text fontSize="14" fontWeight="900" fill="#0a2e1f" letterSpacing="2">
                                <textPath xlinkHref="#circlePath">VENTHULIR • VENTHULIR • VENTHULIR • </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                <div className="footer-bottom-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="#" style={{ color: '#0a2e1f' }}><Facebook size={20} /></a>
                        <a href="#" style={{ color: '#0a2e1f' }}><Instagram size={20} /></a>
                        <a href="#" style={{ color: '#0a2e1f' }}><Twitter size={20} /></a>
                    </div>
                    <p style={{ margin: 0 }}>© 2026 VENTHULIR ORGANIC HARVEST. ROYALTY REFINED.</p>
                    <div style={{ display: 'flex', gap: '15px', color: '#0a2e1f' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><ShieldCheck size={16}/> 100% SECURE CHECKOUT</span>
                        <CreditCard size={20} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;