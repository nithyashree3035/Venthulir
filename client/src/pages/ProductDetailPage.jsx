import React, { useEffect, useState } from 'react';
// Removed useParams
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCcw, Leaf, CheckCircle2, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { products } from '../utils/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { useAppNavigation } from '../context/NavigationContext';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/organic.png';
import './ProductDetailPage.css';

const ProductDetailPage = ({ id }) => {
    const { appNavigate } = useAppNavigation();
    const { isAuthenticated } = useAuth();
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, wishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            try {
                // Fetch explicit product
                const foundProduct = await api.get(`/products/${id}`);

                if (foundProduct) {
                    setProduct(foundProduct);
                    setActiveImage(foundProduct.imageUrl || (foundProduct.images && foundProduct.images[0]) || foundProduct.image);
                    if (foundProduct.variants && foundProduct.variants.length > 0) {
                        setSelectedVariant(foundProduct.variants[0]);
                    }

                    // Fetch exact related ones
                    try {
                        const relatedData = await api.get(`/products?category=${encodeURIComponent(foundProduct.category)}&limit=5`);
                        const productList = Array.isArray(relatedData.products) ? relatedData.products : (Array.isArray(relatedData) ? relatedData : []);

                        let related = productList
                            .filter(p => String(p._id || p.id) !== String(foundProduct._id || foundProduct.id))
                            .slice(0, 4);

                        if (related.length === 0) {
                            const fallbackData = await api.get(`/products?limit=5`);
                            const fallbackList = Array.isArray(fallbackData.products) ? fallbackData.products : (Array.isArray(fallbackData) ? fallbackData : []);
                            related = fallbackList
                                .filter(p => String(p._id || p.id) !== String(foundProduct._id || foundProduct.id))
                                .slice(0, 4);
                        }

                        // Remove complete duplicates from display
                        const uniqueRelatedIds = new Set();
                        related = related.filter(p => {
                            const idStr = String(p._id || p.id);
                            if (uniqueRelatedIds.has(idStr)) return false;
                            uniqueRelatedIds.add(idStr);
                            return true;
                        });

                        setRelatedProducts(related);
                    } catch (relatedErr) {
                        console.error('Related error:', relatedErr);
                        setRelatedProducts([]);
                    }

                    // Fetch exactly applicable coupons for this specific product or generic cart-wide coupons
                    try {
                        const couponData = await api.get('/coupons/public');
                        const productCoupons = couponData.filter(c =>
                            c.status === 'Active' &&
                            (!c.productId || String(c.productId) === String(foundProduct._id || foundProduct.id))
                        );
                        setAvailableCoupons(productCoupons);
                    } catch (couponErr) {
                        console.error('Coupon fetch error:', couponErr);
                    }
                } else {
                    appNavigate('home');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                appNavigate('home'); // Redirect if the product is broken, preventing whitescreen
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id, appNavigate]);

    if (loading) return (
        <div style={{ padding: '80px 40px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #f0ede0', borderTopColor: '#0b3d2e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ color: '#0b3d2e', fontWeight: '700', fontSize: '16px', margin: 0 }}>Loading product...</p>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>This may take a moment on first load.</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (!product) return null;

    const productId = product._id || product.id;
    const isFav = wishlist.some(item => (item._id || item.id) === productId);

    const allImages = product.images && product.images.length > 0
        ? product.images
        : (product.imageUrl || product.image ? [product.imageUrl || product.image] : []);

    const handlePrev = (e) => {
        e.stopPropagation();
        const idx = allImages.indexOf(activeImage);
        const prevIdx = idx === 0 ? allImages.length - 1 : idx - 1;
        setActiveImage(allImages[prevIdx]);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        const idx = allImages.indexOf(activeImage);
        const nextIdx = idx === allImages.length - 1 ? 0 : idx + 1;
        setActiveImage(allImages[nextIdx]);
    };

    return (
        <div className="product-detail-view">
            <Helmet>
                <title>{product.name} | Venthulir Organic Harvest</title>
                <meta name="description" content={`Discover the royal quality of ${product.name}. ${product.description.substring(0, 150)}...`} />
                <link rel="canonical" href={`https://venthulir.com/product/${productId}`} />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Product",
                      "name": "${product.name}",
                      "image": "${product.imageUrl || (product.images && product.images[0]) || ''}",
                      "description": "${product.description.replace(/"/g, '\\"')}",
                      "brand": {
                        "@type": "Brand",
                        "name": "Venthulir"
                      },
                      "offers": {
                        "@type": "Offer",
                        "url": "https://venthulir.com/product/${productId}",
                        "priceCurrency": "INR",
                        "price": "${selectedVariant ? selectedVariant.price : product.price}",
                        "availability": "https://schema.org/InStock"
                      },
                      "category": "${product.category}"
                    }
                    `}
                </script>
            </Helmet>

            {/* Minimal Header */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => appNavigate('home')} aria-label="Back to home">
                    <ArrowLeft size={20} />
                </button>
                <div className="detail-logo" onClick={() => appNavigate('home')} style={{ cursor: 'pointer' }}>
                    <img src={logo} alt="Venthulir Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </div>
                <div className="header-actions">
                    <button className="h-action" onClick={() => appNavigate('cart')} aria-label="View cart">
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            <div className="detail-container">
                <div className="grid-layout">
                    {/* Visual Section: Main Image + Sub Images Below */}
                    <div className="image-showcase" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Main Image Viewport */}
                        <div className="main-image-viewport">
                            {activeImage ? (
                                <img src={activeImage} alt={product.name} width="500" height="500" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', transition: '0.3s' }} fetchPriority="high" />
                            ) : (
                                <div style={{ color: '#aaa', fontSize: '24px', fontWeight: 'bold' }}>VENTHULIR</div>
                            )}
                            {product.badge && <span className="p-badge" style={{ position: 'absolute', top: '20px', left: '20px', background: '#0b3d2e', color: '#d4af37', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>{product.badge}</span>}

                            {/* Slideshow Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        aria-label="Previous image"
                                        style={{ position: 'absolute', left: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    >
                                        <ChevronLeft size={24} color="#0b3d2e" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        aria-label="Next image"
                                        style={{ position: 'absolute', right: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    >
                                        <ChevronRight size={24} color="#0b3d2e" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Centered Below */}
                        {allImages.length > 1 && (
                            <div className="thumbnail-list" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '15px',
                                flexWrap: 'wrap',
                                padding: '10px 0'
                            }}>
                                {allImages.map((img, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setActiveImage(img)}
                                        onClick={() => setActiveImage(img)}
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            cursor: 'pointer',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            border: activeImage === img ? '2px solid #0b3d2e' : '1px solid #ddd',
                                            padding: '3px',
                                            transition: '0.2s all',
                                            background: '#fff',
                                            transform: activeImage === img ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: activeImage === img ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <img src={img} alt={`thumb-${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="product-info-column">
                        <span className="p-category">{product.category}</span>
                        <h1 className="p-title">{product.name}</h1>

                        <div className="rating-row">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#d4af37" stroke="#d4af37" />)}
                            </div>
                        </div>

                        <div className="p-price-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '15px' }}>
                            <div style={{ background: '#cc0c39', color: '#fff', padding: '6px 10px', fontSize: '13px', fontWeight: 'bold', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                                Limited Time Deal
                            </div>
                            {(() => {
                                const currentPrice = (selectedVariant ? selectedVariant.price : product.price) || 0;
                                let mrp = product.originalPrice;
                                let disc = product.discountPercent;
                                const basePrice = product.price || currentPrice;

                                if (disc) {
                                    mrp = Math.round(currentPrice / (1 - (disc / 100)));
                                } else if (mrp) {
                                    disc = Math.round(((mrp - basePrice) / mrp) * 100);
                                    if (disc <= 0) disc = 30;

                                    if (currentPrice === basePrice && product.originalPrice > currentPrice) {
                                        mrp = product.originalPrice;
                                    } else {
                                        mrp = Math.round(currentPrice / (1 - (disc / 100)));
                                    }
                                } else {
                                    disc = 30;
                                    mrp = Math.round(currentPrice / 0.7);
                                }

                                return (
                                    <>
                                        <div className="p-price-display-wrapper">
                                            <span className="p-discount">
                                                -{disc}%
                                            </span>
                                            <div className="p-price-amount-wrap">
                                                <span className="p-currency">₹</span>
                                                <span className="p-price">
                                                    {currentPrice}
                                                </span>
                                            </div>
                                            {quantity > 1 && <span className="p-qty-indicator">× {quantity}</span>}
                                        </div>
                                        <div style={{ fontSize: '16px', color: '#565959' }}>
                                            M.R.P.: <span className="mrp-highlight">₹{mrp}</span>
                                        </div>
                                    </>
                                );
                            })()}


                            {quantity > 1 && (
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0b3d2e', background: '#f0f9f4', padding: '6px 16px', borderRadius: '8px', marginTop: '5px', border: '1px solid #e0f2e9' }}>
                                    Total: ₹{(selectedVariant ? selectedVariant.price : product.price) * quantity}
                                </div>
                            )}
                        </div>

                        {/* Variant Selection UI */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="variant-selection" style={{ marginBottom: '25px', background: '#fdfcf7', padding: '20px', borderRadius: '12px', border: '1px solid #f0ede0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '800', color: '#0b3d2e', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Sizes:</label>
                                    <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 'bold' }}>Genuine Quality</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {product.variants.map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedVariant(v)}
                                            style={{
                                                padding: '10px 24px',
                                                borderRadius: '8px',
                                                border: selectedVariant?.label === v.label ? '2px solid #0b3d2e' : '1px solid #ddd',
                                                background: selectedVariant?.label === v.label ? '#0b3d2e' : '#fff',
                                                color: selectedVariant?.label === v.label ? '#d4af37' : '#0b3d2e',
                                                fontWeight: '800',
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                transition: '0.3s all',
                                                boxShadow: selectedVariant?.label === v.label ? '0 4px 12px rgba(11, 61, 46, 0.2)' : 'none'
                                            }}
                                        >
                                            {v.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Combo breakdown — shown when selected variant has contents */}
                                {selectedVariant?.contents && (
                                    <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #e5e7eb' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px' }}>
                                            📦 What's inside this pack:
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {selectedVariant.contents.split('+').map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #f0ede0', borderRadius: '8px', padding: '6px 12px' }}>
                                                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0b3d2e', color: '#d4af37', fontSize: '10px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0b3d2e' }}>{item.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {availableCoupons.length > 0 && (
                            <div style={{ marginBottom: '20px', padding: '15px', background: '#fdfcf7', border: '1px dashed #d4af37', borderRadius: '8px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0b3d2e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '18px' }}>🏷️</span> Available Offers
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {availableCoupons.map(c => (
                                        <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #f0ede0' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#cc0c39' }}>{c.discountPercentage}% OFF</span>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Use code at checkout</span>
                                            </div>
                                            <div style={{ background: '#f0f9f4', border: '1px dashed #0b3d2e', color: '#0b3d2e', padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>
                                                {c.couponCode}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#28a745', fontSize: '13px', fontWeight: 'bold' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28a745' }}></div>
                            Sold by Venthulir Official • In Stock
                        </div>

                        <p className="p-description">{product.description}</p>

                        {/* TRUST BADGES SECTION */}
                        <div className="trust-badges-grid">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShieldCheck size={20} color="#0b3d2e" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Secure Payment</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Truck size={20} color="#0b3d2e" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Fast Shipping</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RefreshCcw size={20} color="#0b3d2e" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Easy Return</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Leaf size={20} color="#0b3d2e" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Natural Ingredients</span>
                            </div>
                        </div>

                        {/* PRODUCT RICH DETAILS (SEO) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            <details style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                                <summary style={{ fontWeight: 'bold', color: '#0b3d2e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> {product.comboContents?.length > 0 ? 'Combo Pack Contents & Weights' : 'Ingredients & Net Weight'}</span>
                                </summary>
                                <div style={{ padding: '15px 0 0', fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                                    {product.comboContents?.length > 0 ? (
                                        /* ── Combo breakdown table ── */
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                                                📦 This is a Combo Pack — {product.comboContents.length} items included
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {product.comboContents.map((c, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfcf7', padding: '10px 16px', borderRadius: '8px', border: '1px solid #f0ede0' }}>
                                                        <span style={{ fontWeight: 700, color: '#0b3d2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0b3d2e', color: '#d4af37', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                                                            {c.item}
                                                        </span>
                                                        <span style={{ fontWeight: 800, color: '#cc0c39', background: 'rgba(204,12,57,0.07)', padding: '3px 12px', borderRadius: '20px', fontSize: '13px', border: '1px solid rgba(204,12,57,0.15)' }}>{c.weight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── Standard ingredient text ── */
                                        <>
                                            <p style={{ whiteSpace: 'pre-line' }}><strong>Ingredients:</strong><br/>
                                                {(() => {
                                                    const name = product.name.toLowerCase();
                                                    if (name.includes('chilli')) return '100% Dried Red Chillies';
                                                    if (name.includes('garam masala')) return 'Coriander Seeds\nCumin Seeds\nBlack Pepper\nCloves\nCinnamon\nCardamom\nBay Leaf\nNutmeg';
                                                    if (name.includes('coriander')) return '100% Coriander Seeds';
                                                    if (name.includes('turmeric')) return '100% Dried Turmeric';
                                                    if (name.includes('sambar')) return 'Coriander Seeds\nDried Red Chillies\nCumin Seeds\nBlack Pepper\nFenugreek Seeds\nTurmeric\nCurry Leaves\nAsafoetida';
                                                    return 'Made from 100% natural and traditional sources. No preservatives, artificial colors, or chemicals added.';
                                                })()}
                                            </p>
                                            <p><strong>Net Weight:</strong> {selectedVariant ? selectedVariant.label : 'Standard Pack'}</p>
                                        </>
                                    )}
                                </div>
                            </details>

                            <details style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                                <summary style={{ fontWeight: 'bold', color: '#0b3d2e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Leaf size={16}/> Benefits</span>
                                </summary>
                                <div style={{ padding: '15px 0 0', fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                        <li>Retains natural essential oils and nutrients</li>
                                        <li>Boosts everyday immunity and well-being</li>
                                        <li>100% pure authentic taste</li>
                                    </ul>
                                </div>
                            </details>

                            <details style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                                <summary style={{ fontWeight: 'bold', color: '#0b3d2e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> How to Use & Storage</span>
                                </summary>
                                <div style={{ padding: '15px 0 0', fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                                    <p><strong>How to Use:</strong> Use as directed for cooking, wellness, or skincare.</p>
                                    <p><strong>Who can use:</strong> Suitable for all ages (unless specified for allergies).</p>
                                    <p><strong>Storage:</strong> Store in a cool, dry place. Keep away from direct sunlight.</p>
                                </div>
                            </details>

                            <details style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                                <summary style={{ fontWeight: 'bold', color: '#0b3d2e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={16}/> FAQ</span>
                                </summary>
                                <div style={{ padding: '15px 0 0', fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                                    <p><strong>Is this product organic?</strong> Yes, our products are made from naturally sourced ingredients.</p>
                                    <p><strong>What is the shelf life?</strong> Typically 6-12 months from the date of packing. Please refer to the label.</p>
                                </div>
                            </details>
                        </div>

                        <div className="product-actions-row">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <div>{quantity}</div>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <div className="buy-actions">
                                <button
                                    className={`cart-button ${isInCart(productId, selectedVariant?.label) ? 'active' : ''}`}
                                    onClick={() => {
                                        const prodToAdd = { ...product, price: selectedVariant ? selectedVariant.price : product.price, selectedVariant: selectedVariant?.label };
                                        addToCart(prodToAdd, quantity);
                                    }}
                                >
                                    {isInCart(productId, selectedVariant?.label) ? 'ADD MORE' : 'ADD TO CART'}
                                </button>
                                <button
                                    className="buy-now-button"
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            appNavigate('checkout', { productId: product._id || product.id, variant: selectedVariant?.label, quantity });
                                        } else {
                                            appNavigate('auth', {
                                                redirectView: 'checkout',
                                                redirectParams: { productId: product._id || product.id, variant: selectedVariant?.label, quantity }
                                            });
                                        }
                                    }}
                                >
                                    BUY IT NOW
                                </button>
                            </div>
                        </div>

                        <div className="utility-actions">
                            <button onClick={() => toggleWishlist(product)} className={isFav ? 'active' : ''}>
                                <Heart size={18} fill={isFav ? "#0b3d2e" : "none"} /> {isFav ? 'Saved' : 'Wishlist'}
                            </button>
                            <button><Share2 size={18} /> Share</button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="related-section">
                        <div className="section-head">
                            <h2>You may also like</h2>
                            <div className="underline"></div>
                        </div>
                        <div className="related-grid" style={{ width: '100%' }}>
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id || p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
