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
    const { appNavigate } = useAppNavigation();
    
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

            {/* THE STORY OF VENTHULIR WITH VIDEO BACKGROUND */}
            <section style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0
                    }}
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-a-field-of-tall-grass-4328-large.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(11, 61, 46, 0.8) 0%, rgba(26, 92, 67, 0.7) 100%)', zIndex: 1 }}></div>

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '5vw', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }} className="fade-in-up">
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', marginBottom: '30px', backdropFilter: 'blur(5px)' }}>
                        <Leaf size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                        OUR ORIGIN STORY
                    </div>
                    
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', fontFamily: '"Playfair Display", serif', lineHeight: '1.2', marginBottom: '30px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        A Journey from Childhood Dream <br /> to Organic Revolution 🌱
                    </h2>

                    <div style={{ fontSize: '18px', lineHeight: '1.8', fontWeight: '300', textShadow: '0 1px 5px rgba(0,0,0,0.2)', opacity: 0.95 }}>
                        <p style={{ marginBottom: '20px' }}>
                            The story begins with a young boy watching people consume chemically processed foods daily. Noticing how these unhealthy choices deteriorated their fitness and lifestyle planted a strong purpose in his heart — a mission to reconnect humanity with the purity of nature.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Driven by the belief that <strong style={{color: '#d4af37'}}>"Pure Food Creates a Pure Life,"</strong> he founded Venthulir. Unlike brands that rely on external sourcing, Venthulir stands independent by directly owning and cultivating fertile, chemical-free organic farms across Tamil Nadu.
                        </p>
                        <p>
                            Today, Venthulir is more than a brand; it’s a conscious movement. Every product is organically crafted to ensure people stay fit and energetic. We proudly stand as a symbol of trust and sustainability, inspiring families to embrace a healthier tomorrow.
                        </p>
                    </div>

                    <button 
                        onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                        style={{ marginTop: '40px', background: '#d4af37', color: '#111', padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 15px 25px rgba(0,0,0,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(0,0,0,0.2)'; }}
                    >
                        Experience Purity
                    </button>
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
                            
                            <h3 style={{ fontSize: '28px', color: '#fff', fontWeight: '800', marginBottom: '5px' }}>Sankarganesh R</h3>
                            <h4 style={{ fontSize: '16px', color: '#d4af37', fontWeight: 'bold', marginBottom: '15px' }}>CEO & Founder</h4>
                            <p style={{ fontSize: '14px', color: '#fff', marginBottom: '30px', fontWeight: 'bold' }}>B.E (Mechanical), M.Tech (Energy Technology)</p>
                            
                            <ul className="founder-roles-list">
                                <li style={{ color: '#fff', fontWeight: '500' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }}></div> Designer</li>
                                <li style={{ color: '#fff', fontWeight: '500' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }}></div> Trainer</li>
                                <li style={{ color: '#fff', fontWeight: '500' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }}></div> Team Coordinator</li>
                                <li style={{ color: '#fff', fontWeight: '500' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }}></div> Team Leader</li>
                                <li style={{ color: '#fff', fontWeight: '500' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4af37' }}></div> Project Head</li>
                                <li style={{ fontSize: '15px', color: '#d4af37', fontWeight: 'bold', marginTop: '10px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37' }}></div> CEO & Founder</li>
                            </ul>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: 'clamp(20px, 4vw, 24px)', color: '#fff', fontWeight: '800', marginBottom: '20px' }}>About <span style={{ color: '#d4af37' }}>Sankarganesh R</span></h3>
                            <p style={{ fontSize: '15px', color: '#fff', lineHeight: '1.7', marginBottom: '15px', textAlign: 'justify' }}>
                                An accomplished mechanical engineer and entrepreneur, Sankarganesh R leads <span style={{ color: '#d4af37', fontWeight: 'bold' }}>Venthulir Organic Harvest</span> with a deep vision to bring authentic organic wellness and purity back to everyday life.
                            </p>
                            <p style={{ fontSize: '15px', color: '#fff', lineHeight: '1.7', marginBottom: '35px', textAlign: 'justify' }}>
                                Holding a B.E in Mechanical Engineering and an M.Tech in Energy Technology, he brings a unique blend of engineering rigor and entrepreneurial drive to every process. This powerful background has enabled him to design state-of-the-art extraction methods that perfectly preserve traditional, chemical-free agricultural wisdom.
                            </p>
                            
                            <h4 style={{ fontSize: '18px', color: '#d4af37', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Key Environmental & Brand Milestones</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Transformed 10+ years of engineering rigor into precision cold-press extraction',
                                    'Established self-owned, 100% chemical-free organic farms in Tamil Nadu',
                                    'Pioneer in merging sustainable tech with traditional agricultural wisdom',
                                    'Developed precision processing for zero-adulteration wood-pressed oils',
                                    'Empowering local farmers through direct sourcing and fair-trade practices'
                                ].map((achievement, idx) => (
                                    <li key={idx} style={{ fontSize: '15px', color: '#fff', fontWeight: '500', marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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
            <section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(15px, 5vw, 20px)', background: '#0b3d2e', color: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', marginBottom: '40px', fontFamily: '"Playfair Display", serif', color: '#d4af37' }}>What Our Customers Say</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontStyle: 'italic', lineHeight: '1.8', marginBottom: '30px' }}>
                        "The purity and aroma of Venthulir spices are unmatched. It feels like returning to the food our grandparents used to make. Absolutely loving it!"
                    </p>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>— Kavitha R., Salem</div>
                </div>
            </section>

            {/* OFFER BANNER */}
            <section style={{ padding: 'clamp(20px, 4vw, 30px) 20px', background: '#cc0c39', color: '#fff' }} className="fade-in-up">
                <div className="offer-flex-banner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '28px' }}>🔥</span>
                        <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>Limited Time Offer</h2>
                    </div>
                    
                    <p style={{ fontSize: 'clamp(16px, 2.5vw, 18px)', margin: 0, fontWeight: '500', flexGrow: 1, textAlign: 'center' }}>
                        Get <span style={{ fontWeight: 'bold', color: '#ffea00' }}>10% OFF</span> on your First Order + 🎁 <span style={{ fontWeight: 'bold', color: '#ffea00' }}>Free Shipping</span> Above ₹499!
                    </p>
                    
                    <button 
                        onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                        style={{ background: '#ffcd00', color: '#111', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'; }}
                    >
                        Claim Offer Now
                    </button>
                </div>
            </section>

            {/* BLOG PREVIEW */}
            <section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(15px, 5vw, 20px)', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }} className="fade-in-up">
                        <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#0b3d2e', fontWeight: '900', fontFamily: '"Playfair Display", serif', marginBottom: '10px' }}>Wellness Journal</h2>
                        <div style={{ width: '60px', height: '4px', background: '#d4af37', margin: '0 auto', borderRadius: '2px' }}></div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                        {[
                            { 
                                title: 'Benefits of Turmeric Powder', 
                                snippet: 'Discover why this golden spice is essential for your daily immunity and overall well-being...', 
                                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
                                delay: 'delay-1'
                            },
                            { 
                                title: 'Herbal Remedies for Immunity', 
                                snippet: 'Traditional concoctions you can make at home to stay strong and healthy during weather changes...', 
                                image: 'https://images.unsplash.com/photo-1471943038886-6f9bdc485655?w=600&auto=format&fit=crop&q=80',
                                delay: 'delay-2'
                            },
                            { 
                                title: 'Natural vs Chemical Spices', 
                                snippet: 'A deep dive into why pure organic spices matter for your diet and long-term vitality...', 
                                image: 'https://images.unsplash.com/photo-1599789197514-47270cd526b4?w=600&auto=format&fit=crop&q=80',
                                delay: 'delay-3'
                            }
                        ].map((post, idx) => (
                            <div 
                                key={idx} 
                                className={`fade-in-up ${post.delay}`}
                                onClick={() => appNavigate('journal', { post })}
                                style={{ background: '#fdfcf7', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', display: 'flex', flexDirection: 'column', position: 'relative' }} 
                                onMouseEnter={e => { 
                                    e.currentTarget.style.transform='translateY(-12px)'; 
                                    e.currentTarget.style.boxShadow='0 25px 50px rgba(11, 61, 46, 0.15)'; 
                                    e.currentTarget.querySelector('.journal-img').style.transform='scale(1.1)';
                                }} 
                                onMouseLeave={e => { 
                                    e.currentTarget.style.transform='translateY(0)'; 
                                    e.currentTarget.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)'; 
                                    e.currentTarget.querySelector('.journal-img').style.transform='scale(1)';
                                }}
                            >
                                <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <div className="journal-img" style={{ width: '100%', height: '100%', backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.6s ease' }}></div>
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#0b3d2e', backdropFilter: 'blur(5px)' }}>Read</div>
                                </div>
                                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', zIndex: 2, background: '#fff' }}>
                                    <h3 style={{ fontSize: 'clamp(18px, 3vw, 22px)', color: '#0b3d2e', fontWeight: '900', fontFamily: '"Playfair Display", serif', marginBottom: '15px', lineHeight: '1.3' }}>{post.title}</h3>
                                    <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7', flexGrow: 1, marginBottom: '20px' }}>{post.snippet}</p>
                                    <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                        Explore Article <ChevronRight size={18} />
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