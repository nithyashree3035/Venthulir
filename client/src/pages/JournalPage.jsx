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
        <div style={{ background: '#fdfcf7', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button 
                    onClick={() => appNavigate('home')} 
                    style={{ background: 'transparent', border: 'none', color: '#0b3d2e', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold' }}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
                
                <div style={{ width: '100%', height: '400px', background: 'linear-gradient(135deg, #0b3d2e 0%, #1a5c43 100%)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                     <h1 style={{ color: '#d4af37', fontSize: '60px', opacity: 0.8 }}>Venthulir</h1>
                </div>

                <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'inline-block', padding: '5px 15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>Wellness & Health</div>
                    <h1 style={{ fontSize: '36px', color: '#0b3d2e', fontFamily: '"Playfair Display", serif', marginBottom: '20px', lineHeight: '1.2' }}>{post.title}</h1>
                    
                    <div style={{ fontSize: '17px', color: '#555', lineHeight: '1.9' }}>
                        <p style={{ marginBottom: '25px', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{post.snippet}</p>
                        <p style={{ marginBottom: '20px' }}>At Venthulir, we believe that pure food leads to a pure life. In today's fast-paced world, returning to our roots and embracing organic, chemical-free alternatives is no longer a luxury—it's a necessity.</p>
                        <p style={{ marginBottom: '20px' }}>When you choose authentically processed items, like our wood-pressed oils or raw forest honey, you aren't just eating better; you're actively preserving the ancient agricultural wisdom that has sustained generations. The profound impact that simple, unadulterated ingredients can have on our daily fitness, mental clarity, and immune response is remarkable.</p>
                        <p style={{ marginBottom: '20px' }}>Our deep commitment to organic harvesting ensures that every product reaching your table is cultivated without synthetic pesticides or harsh chemical processing. This journey from our self-owned farms straight to your kitchen guarantees a complete preservation of vital nutrients.</p>
                        
                        <div style={{ padding: '30px', background: '#f9fbe7', borderLeft: '4px solid #827717', borderRadius: '0 10px 10px 0', marginTop: '40px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '20px', color: '#33691e', marginBottom: '10px' }}>The Venthulir Promise</h3>
                            <p style={{ margin: 0, fontStyle: 'italic', color: '#558b2f' }}>"To continuously empower local farmers, preserve nature's genuine goodness, and deliver uncompromising purity directly to your family."</p>
                        </div>

                        <button 
                            onClick={() => appNavigate('all-products')}
                            style={{ display: 'block', width: '100%', padding: '15px', background: '#0b3d2e', color: '#fff', textAlign: 'center', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px' }}
                        >
                            Explore Our Organic Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
