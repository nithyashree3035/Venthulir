import React, { useState } from 'react';
import { ChevronUp, Send, MapPin, Phone, Mail, CreditCard, ShieldCheck } from 'lucide-react';
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
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}><MapPin size={16} style={{ color: '#0a2e1f', marginTop: '2px', flexShrink: 0 }}/> <span>IInd Floor, OM Shiva Towers, 259-B, Advaitha Ashram Rd, Fairlands, Salem, Tamil Nadu 636004</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} style={{ color: '#0a2e1f' }}/> +91-8778476414</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} style={{ color: '#0a2e1f' }}/> theventhulir@gmail.com</div>
                        </div>

                        {/* Social Links with brand colors */}
                        <div style={{ display: 'flex', gap: '14px', marginTop: '20px', alignItems: 'center' }}>
                            <a href="https://www.instagram.com/theventhulir22?igsh=ODdyazhjc3NiNTh0" target="_blank" rel="noopener noreferrer" aria-label="Follow Venthulir on Instagram"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', boxShadow: '0 3px 10px rgba(220,39,67,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(220,39,67,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(220,39,67,0.35)'; }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/the-venthulir-2144333b4/" target="_blank" rel="noopener noreferrer" aria-label="Follow Venthulir on LinkedIn"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: '#0A66C2', boxShadow: '0 3px 10px rgba(10,102,194,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(10,102,194,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(10,102,194,0.35)'; }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
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
                                <label htmlFor="concern-select" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Nature of Concern</label>
                                <select
                                    id="concern-select"
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