import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ShopGrid from '../components/ShopGrid';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '../constants';
import { ShieldCheck, Truck, RefreshCcw, Leaf, ChevronRight, BookOpen } from 'lucide-react';
import { useAppNavigation } from '../context/NavigationContext';
import './Home.css';

const Home = () => {
    const { navigate } = useAppNavigation();
    
    // Silently warm up the Render backend to prevent cold-start delays on first product click
    useEffect(() => {
        fetch(`${API_BASE}/products?limit=1`, { method: 'GET' }).catch(() => {});
    }, []);

    return (
        <div className="home-unified-root">
            <Helmet>
                <title>Venthulir | Buy Wood-Pressed Oils, Honey & Organic Spices — Salem Tamil Nadu</title>
                <meta name="description" content="Shop 100% natural wood-pressed oils, raw forest honey, and pure handpicked spices at Venthulir. Salem's most trusted organic store. No chemicals, delivered across India." />
                <meta name="keywords" content="buy wood pressed oil Salem, organic honey Salem, cold pressed sesame oil Tamil Nadu, pure coconut oil Salem, traditional spices online, chemical-free oils India, venthulir organic harvest" />
                <link rel="canonical" href="https://venthulir.com/" />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "Venthulir Organic Harvest",
                      "url": "https://venthulir.com/",
                      "logo": "https://venthulir.com/logo.png",
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-8778476414",
                        "contactType": "Customer Service",
                        "areaServed": "IN",
                        "availableLanguage": "en"
                      },
                      "sameAs": [
                        "https://www.facebook.com/venthulir",
                        "https://www.instagram.com/venthulir"
                      ]
                    }
                    `}
                </script>
            </Helmet>

            <Hero />

            {/* THE STORY OF VENTHULIR */}
            <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #f9fbe7 0%, #fff 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>
                            <Leaf size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                            OUR ORIGIN STORY
                        </div>
                        <h2 style={{ fontSize: '38px', color: '#0b3d2e', fontWeight: '900', fontFamily: '"Playfair Display", serif', lineHeight: '1.2' }}>
                            A Journey from Childhood Dream to <br /> Organic Revolution 🌱
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div className="story-card interactable-card">
                            <h3 style={{ fontSize: '20px', color: '#0b3d2e', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#d4af37' }}>01.</span> The Realization
                            </h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                                The story begins with a young boy watching people consume chemically processed foods daily. Noticing how these unhealthy choices deteriorated their fitness and lifestyle planted a strong purpose in his heart — a mission to reconnect humanity with the purity of nature.
                            </p>
                        </div>

                        <div className="story-card interactable-card">
                            <h3 style={{ fontSize: '20px', color: '#0b3d2e', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#d4af37' }}>02.</span> The Foundation
                            </h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                                Driven by the belief that <strong>"Pure Food Creates a Pure Life,"</strong> he founded Venthulir. Unlike brands that rely on external sourcing, Venthulir stands independent by directly owning and cultivating fertile, chemical-free organic farms across Tamil Nadu.
                            </p>
                        </div>

                        <div className="story-card interactable-card">
                            <h3 style={{ fontSize: '20px', color: '#0b3d2e', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#d4af37' }}>03.</span> The Movement
                            </h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', textAlign: 'justify' }}>
                                Today, Venthulir is more than a brand; it’s a conscious movement. Every product is organically crafted to ensure people stay fit and energetic. We proudly stand as a symbol of trust and sustainability, inspiring families to embrace a healthier tomorrow.
                            </p>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* MEET THE FOUNDER SECTION */}
            <section style={{ padding: '80px 20px', background: '#0b3d2e', color: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '36px', color: '#d4af37', fontWeight: '900', marginBottom: '50px', fontFamily: '"Playfair Display", serif', textAlign: 'center' }}>
                        Meet The Founder
                    </h2>
                    
                    <div className="founder-grid">
                        <div className="founder-left-col">
                            <img 
                                src="/sankarganesh.png" 
                                alt="Sankarganesh R" 
                                className="founder-photo-img" 
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.style.display = 'none'; 
                                    document.getElementById('founder-fallback').style.display = 'flex'; 
                                }} 
                            />
                            <div id="founder-fallback" className="founder-avatar" style={{ display: 'none' }}>SR</div>
                            
                            <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '5px' }}>Sankarganesh R</h3>
                            <h4 style={{ fontSize: '16px', color: '#d4af37', fontWeight: 'bold', marginBottom: '15px' }}>CEO & Founder</h4>
                            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '30px' }}>B.E (Mechanical), M.Tech (Energy Technology)</p>
                            
                            <ul className="founder-roles-list">
                                <li><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></div> Designer</li>
                                <li><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></div> Trainer</li>
                                <li><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></div> Team Coordinator</li>
                                <li><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></div> Team Leader</li>
                                <li><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></div> Project Head</li>
                                <li style={{ fontSize: '15px', color: '#d4af37', fontWeight: 'bold', marginTop: '10px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }}></div> CEO & Founder</li>
                            </ul>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>About <span style={{ color: '#d4af37' }}>Sankarganesh R</span></h3>
                            <p style={{ fontSize: '15px', color: '#ddd', lineHeight: '1.7', marginBottom: '15px', textAlign: 'justify' }}>
                                An accomplished mechanical engineer and entrepreneur, Sankarganesh R leads <span style={{ color: '#d4af37', fontWeight: 'bold' }}>Venthulir Organic Harvest</span> with a deep vision to bring authentic organic wellness and purity back to everyday life.
                            </p>
                            <p style={{ fontSize: '15px', color: '#ddd', lineHeight: '1.7', marginBottom: '35px', textAlign: 'justify' }}>
                                Holding a B.E in Mechanical Engineering and an M.Tech in Energy Technology, he brings a unique blend of engineering rigor and entrepreneurial drive to every process. This powerful background has enabled him to design state-of-the-art extraction methods that perfectly preserve traditional, chemical-free agricultural wisdom.
                            </p>
                            
                            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Key Environmental & Brand Milestones</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Transformed 10+ years of engineering rigor into precision cold-press extraction',
                                    'Established self-owned, 100% chemical-free organic farms in Tamil Nadu',
                                    'Pioneer in merging sustainable tech with traditional agricultural wisdom',
                                    'Developed precision processing for zero-adulteration wood-pressed oils',
                                    'Empowering local farmers through direct sourcing and fair-trade practices'
                                ].map((achievement, idx) => (
                                    <li key={idx} style={{ fontSize: '15px', color: '#eee', marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{ marginTop: '2px', color: '#d4af37' }}>
                                            <ShieldCheck size={18} />
                                        </div>
                                        {achievement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY VENTHULIR - TRUST AND BENEFITS SECTION */}
            <section style={{ padding: '80px 20px', background: '#fdfcf7', textAlign: 'center' }}>
                <h2 style={{ fontSize: '36px', color: '#0b3d2e', fontWeight: '900', marginBottom: '40px', fontFamily: '"Playfair Display", serif' }}>Why Venthulir?</h2>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                    <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#555', maxWidth: '800px' }}>
                        Started with a mission to bring traditional herbal wellness back to modern homes. 
                        We ensure small-batch preparation and source directly from local farmers so that every product is 100% pure, natural, and rigorously quality tested.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', width: '100%', marginTop: '30px' }}>
                        <div className="trust-badge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '50%', color: '#2e7d32' }}><Leaf size={40} /></div>
                            <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold' }}>Natural Ingredients</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>100% pure & chemical-free</p>
                        </div>
                        <div className="trust-badge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '50%', color: '#2e7d32' }}><ShieldCheck size={40} /></div>
                            <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold' }}>Secure Payment</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>Safe & encrypted checkouts</p>
                        </div>
                        <div className="trust-badge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '50%', color: '#2e7d32' }}><Truck size={40} /></div>
                            <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold' }}>Fast Shipping</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>Reliable delivery across India</p>
                        </div>
                        <div className="trust-badge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '50%', color: '#2e7d32' }}><RefreshCcw size={40} /></div>
                            <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold' }}>Easy Return</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>Hassle-free return policy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN PRODUCTS SECTION */}
            <ShopGrid title="Our Best Sellers" isHomePage={true} id="products" />

            {/* TESTIMONIALS */}
            <section style={{ padding: '60px 20px', background: '#0b3d2e', color: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '40px', fontFamily: '"Playfair Display", serif', color: '#d4af37' }}>What Our Customers Say</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ fontSize: '20px', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '20px' }}>
                        "The purity and aroma of Venthulir spices are unmatched. It feels like returning to the food our grandparents used to make. Absolutely loving it!"
                    </p>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>— Kavitha R., Salem</div>
                </div>
            </section>

            {/* OFFER BANNER */}
            <section style={{ padding: '50px 20px', background: '#cc0c39', color: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 15px', textTransform: 'uppercase' }}>🔥 Limited Time Offer</h2>
                <p style={{ fontSize: '22px', margin: '0 0 25px' }}>Get <span style={{ fontWeight: 'bold', color: '#ffea00' }}>10% OFF</span> on your First Order + 🎁 <span style={{ fontWeight: 'bold', color: '#ffea00' }}>Free Shipping</span> Above ₹499!</p>
                <button 
                    onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                    style={{ background: '#ffcd00', color: '#111', padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                >
                    Claim Offer Now
                </button>
            </section>

            {/* BLOG PREVIEW */}
            <section style={{ padding: '80px 20px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '36px', color: '#0b3d2e', fontWeight: '900', marginBottom: '40px', textAlign: 'center', fontFamily: '"Playfair Display", serif' }}>Wellness Journal</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {[
                            { title: 'Benefits of Turmeric Powder', snippet: 'Discover why this golden spice is essential for your daily immunity and overall well-being...', icon: <BookOpen size={48} color="#0b3d2e" /> },
                            { title: 'Herbal Remedies for Immunity', snippet: 'Traditional concoctions you can make at home to stay strong and healthy during weather changes...', icon: <Leaf size={48} color="#0b3d2e" /> },
                            { title: 'Natural vs Chemical Spices', snippet: 'A deep dive into why pure organic spices matter for your diet and long-term vitality...', icon: <ShieldCheck size={48} color="#0b3d2e" /> },
                            { title: 'How to Choose Pure Masala', snippet: 'Tips and tricks to identify unadulterated spice blends in the market without being fooled...', icon: <RefreshCcw size={48} color="#0b3d2e" /> }
                        ].map((post, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => navigate('journal', { post })}
                                style={{ background: '#fdfcf7', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }} 
                                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 15px 30px rgba(0,0,0,0.1)'; }} 
                                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                            >
                                <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {post.icon}
                                </div>
                                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.3' }}>{post.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', flexGrow: 1 }}>{post.snippet}</p>
                                    <div style={{ marginTop: '20px', color: '#4a7c59', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        Read Journal <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;