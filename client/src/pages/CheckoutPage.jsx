import React, { useState, useEffect } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { ShieldCheck, CreditCard, Truck, ShoppingBag, ChevronRight, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = ({ viewParams = {} }) => {
    const { appNavigate } = useAppNavigation();
    const { user, isAuthenticated, updateUser } = useAuth();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [variant, setVariant] = useState(null);

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [shippingData, setShippingData] = useState({
        fullName: user?.name || '',
        address: user?.deliveryAddress?.address || '',
        city: user?.deliveryAddress?.city || '',
        state: user?.deliveryAddress?.state || '',
        zipCode: user?.deliveryAddress?.zipCode || '',
        phone: user?.phone || ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [orderError, setOrderError] = useState('');
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            appNavigate('auth', { redirectView: 'checkout', redirectParams: viewParams });
            return;
        }

        const productId = viewParams.productId || viewParams.id;
        const qty = parseInt(viewParams.quantity) || 1;
        const variantLabel = viewParams.variant;

        if (productId) {
            fetchProduct(productId, qty, variantLabel);
            fetchAvailableCoupons();
        } else {
            // Handle cart checkout?
            // For now, let's focus on "Buy Now"
            appNavigate('home');
        }
    }, [isAuthenticated, viewParams]);

    const fetchAvailableCoupons = async () => {
        try {
            const res = await api.get('/coupons/public');
            // Assuming response is an array of active coupons
            if (Array.isArray(res)) {
                setAvailableCoupons(res);
            }
        } catch (err) {
            console.error('Failed to load available coupons', err);
        }
    };

    const fetchProduct = async (id, qty, variantLabel) => {
        try {
            let found;
            try {
                found = await api.get(`/products/${id}`);
            } catch (e) {
                console.warn("Direct fetch failed, falling back to list fetch", e);
            }

            if (!found || found.message) {
                const data = await api.get('/products');
                const productList = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
                found = productList.find(p => String(p._id) === String(id) || String(p.id) === String(id));
            }
            if (found) {
                setProduct(found);
                setQuantity(qty);
                if (variantLabel && found.variants) {
                    const v = found.variants.find(v => v.label === variantLabel);
                    setVariant(v);
                } else if (found.variants && found.variants.length > 0) {
                    setVariant(found.variants[0]);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/address', {
                address: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                zipCode: shippingData.zipCode
            });
            if (res.deliveryAddress) {
                updateUser({ ...user, deliveryAddress: res.deliveryAddress });
            }
        } catch (err) {
            console.error('Quietly failed to save address to profile', err);
        }
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setOrderError('');
        try {
            const orderData = {
                customerName: shippingData.fullName,
                customerEmail: user.email,
                phone: shippingData.phone,
                deliveryAddress: {
                    address: shippingData.address,
                    city: shippingData.city,
                    state: shippingData.state,
                    zipCode: shippingData.zipCode
                },
                items: [{ product: product._id || product.id, name: product.name, variant: variant?.label, quantity, price: variant ? variant.price : product.price }],
                originalAmount: subtotal + shipping,
                discountAmount: discountAmount,
                couponUsed: appliedCoupon ? appliedCoupon.code : null,
                totalAmount: total,
                couponCode: appliedCoupon ? appliedCoupon.code : null
            };
            await api.post('/coupons/checkout', orderData);
            setStep(3);
        } catch (err) {
            console.error('Order Failed:', err);
            // Show backend error (e.g. "Out of Stock") elegantly in UI
            const backendMsg = err?.response?.data?.error || err?.message || '';
            setOrderError(backendMsg || 'Order failed to process. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsVerifyingCoupon(true);
        setCouponError('');
        try {
            const res = await api.post('/coupons/validate', { code: couponInput, productId: product._id || product.id });
            if (res.valid) {
                setAppliedCoupon({ code: res.couponCode, discountPercentage: res.discountPercentage });
                setCouponInput('');
            }
        } catch (err) {
            setCouponError(err.response?.data?.error || err.message || 'Invalid coupon');
            setAppliedCoupon(null);
        } finally {
            setIsVerifyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    if (!product) return <div className="checkout-loading">Preparing your harvest...</div>;

    const subtotal = (variant ? variant.price : product.price) * quantity;
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
    const afterDiscountSubtotal = subtotal - discountAmount;
    const shipping = product.shippingCharge || 0;
    const total = afterDiscountSubtotal + shipping;

    if (step === 3) {
        return (
            <div className="order-success-container">
                <div className="success-content">
                    <div className="success-icon-wrap">
                        <ShieldCheck size={64} color="#0b3d2e" />
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you, {user?.name}. Your royal harvest is being prepared.</p>
                    <div className="order-summary-box">
                        <p>Order ID: #VT-{Math.floor(100000 + Math.random() * 900000)}</p>
                        <p>Estimated Delivery: 3-5 Business Days</p>
                    </div>
                    <button className="primary-checkout-btn" onClick={() => appNavigate('home')}>Back to Sanctuary</button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-root">
            <header className="checkout-header">
                <div className="checkout-header-inner">
                    <button className="back-link" onClick={() => appNavigate('home')}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="checkout-logo" onClick={() => appNavigate('home')}>
                        VENTHULIR
                    </div>
                </div>
            </header>

            <main className="checkout-main">
                <div className="checkout-grid">
                    <div className="checkout-form-container">
                        <div className="checkout-stepper">
                            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>Shipping</div>
                            <div className="step-divider"></div>
                            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>Payment</div>
                        </div>

                        {step === 1 ? (
                            <div className="shipping-section animate-fade-in">
                                <h2>Shipping Information</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Your address will be saved for future orders.</p>
                                <form className="checkout-form" onSubmit={handleShippingSubmit}>
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input required type="text" value={shippingData.fullName} onChange={e => setShippingData({ ...shippingData, fullName: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Street Address</label>
                                        <input required type="text" value={shippingData.address} onChange={e => setShippingData({ ...shippingData, address: e.target.value })} />
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>City</label>
                                            <input required type="text" value={shippingData.city} onChange={e => setShippingData({ ...shippingData, city: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label>State</label>
                                            <input required type="text" value={shippingData.state} onChange={e => setShippingData({ ...shippingData, state: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>ZIP Code</label>
                                            <input required type="text" value={shippingData.zipCode} onChange={e => setShippingData({ ...shippingData, zipCode: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label>Phone Number</label>
                                            <input required type="tel" value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <button type="submit" className="primary-checkout-btn">Continue to Payment <ChevronRight size={18} /></button>
                                </form>
                            </div>
                        ) : (
                            <div className="payment-section animate-fade-in">
                                <h2>Payment Method</h2>
                                <div className="payment-options">
                                    <div className="payment-card selected" style={{ cursor: 'default' }}>
                                        <Truck size={24} />
                                        <span>Cash on Delivery</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px' }}>
                                        Pay with cash upon delivery. No advance payment required.
                                    </p>
                                </div>

                                {orderError && (
                                    <div className="animate-fade-in" style={{ color: '#B12704', background: '#fcf4f4', padding: '16px 20px', borderRadius: '12px', border: '1px solid #f5c6c6', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '18px' }}>⚠️</span> {orderError}
                                    </div>
                                )}
                                <div className="order-actions">
                                    <button className="secondary-checkout-btn" onClick={() => setStep(1)}>Back to Shipping</button>
                                    <button
                                        className="primary-checkout-btn"
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        style={{ marginTop: 0 }}
                                    >
                                        {isProcessing ? 'Verifying...' : `Confirm Order`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-summary-container">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-item product-preview">
                                <img src={product.imageUrl || product.images?.[0]} alt={product.name} />
                                <div className="item-details">
                                    <h4>{product.name}</h4>
                                    <p>{variant?.label || 'Standard'}</p>
                                    <p>Qty: {quantity}</p>
                                </div>
                                <div className="item-price">₹{subtotal.toLocaleString()}</div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="summary-row" style={{ color: '#22c55e' }}>
                                    <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                                    <span>- ₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>

                            <div className="coupon-entry-section" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>
                                {appliedCoupon ? (
                                    <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <ShieldCheck size={16} /> {appliedCoupon.code} Applied
                                        </div>
                                        <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <select
                                                value={couponInput}
                                                onChange={e => setCouponInput(e.target.value)}
                                                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '14px', color: '#0f172a', appearance: 'none', cursor: 'pointer' }}
                                            >
                                                <option value="">{availableCoupons.filter(c => !c.productId || (typeof c.productId === 'object' ? String(c.productId._id) === String(product?._id || product?.id) : String(c.productId) === String(product?._id || product?.id))).length > 0 ? '-- Select a Coupon Code --' : 'No Coupons Available'}</option>
                                                {availableCoupons.filter(c => !c.productId || (typeof c.productId === 'object' ? String(c.productId._id) === String(product?._id || product?.id) : String(c.productId) === String(product?._id || product?.id))).map((c) => (
                                                    <option key={c._id || c.code} value={c.code}>
                                                        {c.code} ({c.discountPercentage}% OFF)
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isVerifyingCoupon || !couponInput.trim()}
                                                style={{ padding: '10px 20px', background: '#0b3d2e', color: '#d4af37', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: isVerifyingCoupon || !couponInput.trim() ? 0.7 : 1, transition: '0.2s' }}
                                            >
                                                {isVerifyingCoupon ? '...' : 'Apply code'}
                                            </button>
                                        </div>
                                        {couponError && <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{couponError}</span>}
                                    </div>
                                )}
                            </div>

                            <div className="guarantee-box">
                                <ShieldCheck size={18} />
                                <span>100% Satisfaction Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
