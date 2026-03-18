import React, { useEffect } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { ArrowLeft } from 'lucide-react';

const JournalPage = ({ post }) => {
    const { appNavigate } = useAppNavigation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!post) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center', background: '#fdfcf7', minHeight: '80vh' }}>
                <h1 style={{ fontSize: '32px', color: '#0b3d2e' }}>Journal Article Not Found</h1>
                <button onClick={() => appNavigate('home')} style={{ marginTop: '20px', padding: '10px 20px', background: '#d4af37', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Return Home</button>
            </div>
        );
    }

    return (
        <div style={{ background: '#fdfcf7', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* CINEMATIC HERO SECTION */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
                    <source src="https://ak.picdn.net/shutterstock/videos/1027168898/preview/stock-video-wind-blowing-through-tall-green-grass-close-up-of-grass-swaying-in-the-breeze.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(11, 61, 46, 0.7) 0%, rgba(11, 61, 46, 0.9) 100%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', maxWidth: '800px' }} className="fade-in-up">
                    <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', backdropFilter: 'blur(5px)' }}>Wellness & Health</div>
                    <h1 style={{ fontSize: '48px', color: '#fff', fontFamily: '"Playfair Display", serif', lineHeight: '1.2', textShadow: '0 4px 15px rgba(0,0,0,0.3)', marginBottom: '20px' }}>{post.title}</h1>
                    <p style={{ fontSize: '18px', color: '#e0e0e0', fontWeight: '300', maxWidth: '600px', margin: '0 auto' }}>{post.snippet}</p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '-50px auto 0', position: 'relative', zIndex: 3, padding: '0 20px' }}>
                <button 
                    onClick={() => appNavigate('home')} 
                    style={{ background: '#fff', border: 'none', color: '#0b3d2e', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateX(-5px)'}
                    onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}
                >
                    <ArrowLeft size={18} /> Back to Home
                </button>

                <div className="story-card fade-in-up delay-2" style={{ padding: '50px', lineHeight: '1.9', fontSize: '17px', color: '#444', textAlign: 'justify' }}>
                    <p style={{ marginBottom: '25px', fontSize: '20px', color: '#0b3d2e', fontWeight: 'bold', lineHeight: '1.6' }}>
                        At Venthulir, we believe that pure food leads to a pure life. In today's fast-paced world, returning to our roots and embracing organic, chemical-free alternatives is no longer a luxury—it's a necessity.
                    </p>
                    <p style={{ marginBottom: '25px' }}>
                        When you choose authentically processed items, like our wood-pressed oils or raw forest honey, you aren't just eating better; you're actively preserving the ancient agricultural wisdom that has sustained generations. The profound impact that simple, unadulterated ingredients can have on our daily fitness, mental clarity, and immune response is remarkable.
                    </p>
                    <p style={{ marginBottom: '30px' }}>
                        Our deep commitment to organic harvesting ensures that every product reaching your table is cultivated without synthetic pesticides or harsh chemical processing. This journey from our self-owned farms straight to your kitchen guarantees a complete preservation of vital nutrients.
                    </p>
                    
                    <div style={{ padding: '35px', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderLeft: '5px solid #2e7d32', borderRadius: '0 15px 15px 0', margin: '40px 0', position: 'relative' }}>
                        <h3 style={{ fontSize: '22px', color: '#1b5e20', marginBottom: '15px' }}>The Venthulir Promise</h3>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#33691e', fontSize: '18px', fontWeight: '500' }}>"To continuously empower local farmers, preserve nature's genuine goodness, and deliver uncompromising purity directly to your family."</p>
                    </div>

                    <button 
                        onClick={() => appNavigate('all-products')}
                        style={{ display: 'block', width: '100%', padding: '18px', background: '#0b3d2e', color: '#fff', textAlign: 'center', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '30px', boxShadow: '0 10px 20px rgba(11, 61, 46, 0.2)', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 15px 25px rgba(11, 61, 46, 0.3)'; e.currentTarget.style.background='#1a5c43'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(11, 61, 46, 0.2)'; e.currentTarget.style.background='#0b3d2e'; }}
                    >
                        Explore Our Organic Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
