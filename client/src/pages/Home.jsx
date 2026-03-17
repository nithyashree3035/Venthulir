import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ShopGrid from '../components/ShopGrid';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '../constants';
import { ShieldCheck, Truck, RefreshCcw, Leaf } from 'lucide-react';
import './Home.css';

const Home = () => {
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
            <section style={{ padding: '80px 20px', background: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '32px', color: '#0b3d2e', fontWeight: '900', marginBottom: '30px', fontFamily: '"Playfair Display", serif', textAlign: 'center' }}>
                        Venthulir – A Journey from Childhood Dream to Organic Revolution 🌱
                    </h2>
                    <div className="story-text-container" style={{ fontSize: '16px', lineHeight: '2', color: '#444' }}>
                        <p>
                            The story of Venthulir begins with a young boy who grew up watching people around him consume inorganic and chemically processed food products every day. He noticed how these unhealthy choices slowly affected their fitness, lifestyle, and overall well-being. This early realization planted a strong purpose in his heart — a mission to create a healthier world by bringing people back to nature.
                        </p>
                        <p>
                            Driven by this vision, he founded Venthulir, a brand built on the powerful belief that "Pure Food Creates a Pure Life." Unlike many brands that depend on external sourcing, Venthulir stands unique by owning and cultivating its own organic farms and fertile fields. Every ingredient used in Venthulir products is carefully grown, harvested, and processed using completely natural and traditional farming practices — free from harmful chemicals, pesticides, and artificial enhancers.
                        </p>
                        <p>
                            Venthulir is not just a brand; it is a movement towards conscious living. From organic food products to wellness essentials, every product is crafted with deep care to ensure people stay healthy, fit, and energetic in their daily lives. By reconnecting consumers with authentic organic nutrition, Venthulir aims to transform lifestyles, support sustainable agriculture, and build a future where health and nature go hand in hand.
                        </p>
                        <p>
                            Today, Venthulir proudly stands as a symbol of trust, purity, and sustainability — continuing its journey to inspire families to choose organic, live naturally, and embrace a healthier tomorrow.
                        </p>
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
                                src="/products/sankarganesh.png" 
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
                            { title: 'Benefits of Turmeric Powder', snippet: 'Discover why this golden spice is essential for your daily immunity...', img: 'https://images.unsplash.com/photo-1615486161483-e028bceb03dc?w=400&h=300&fit=crop' },
                            { title: 'Herbal Remedies for Immunity', snippet: 'Traditional concoctions you can make at home to stay strong and healthy...', img: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=400&h=300&fit=crop' },
                            { title: 'Natural vs Chemical Spices', snippet: 'A deep dive into why pure organic spices matter for your diet...', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop' },
                            { title: 'How to Choose Pure Masala', snippet: 'Tips and tricks to identify unadulterated spice blends in the market...', img: 'https://images.unsplash.com/photo-1509358271058-acd26ccaf9ea?w=400&h=300&fit=crop' }
                        ].map((post, idx) => (
                            <div key={idx} style={{ background: '#fdfcf7', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                                <img src={post.img} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '18px', color: '#0b3d2e', fontWeight: 'bold', marginBottom: '10px' }}>{post.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>{post.snippet}</p>
                                    <div style={{ marginTop: '15px', color: '#4a7c59', fontWeight: 'bold', fontSize: '14px' }}>Read More &rarr;</div>
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