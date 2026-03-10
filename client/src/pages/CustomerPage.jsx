import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderTracking from '../components/OrderTracking';
import InvoiceModal from '../components/InvoiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, FileText, Settings, LogOut, Package, ShieldQuestion, Send, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useAppNavigation } from '../context/NavigationContext';
import './CustomerPage.css';

const CustomerPage = () => {
    const { user, logout } = useAuth();
    const { appNavigate } = useAppNavigation();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [grievances, setGrievances] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeSection, setActiveSection] = useState('Dashboard');

    const [profileAddress, setProfileAddress] = useState({
        address: user?.deliveryAddress?.address || '',
        city: user?.deliveryAddress?.city || '',
        state: user?.deliveryAddress?.state || '',
        zipCode: user?.deliveryAddress?.zipCode || '',
    });
    const [profileDetails, setProfileDetails] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const { updateUser } = useAuth();

    useEffect(() => {
        if (user?.email) {
            fetchGrievances();
            fetchOrders();
        }
        if (user?.deliveryAddress) {
            setProfileAddress({
                address: user.deliveryAddress.address || '',
                city: user.deliveryAddress.city || '',
                state: user.deliveryAddress.state || '',
                zipCode: user.deliveryAddress.zipCode || ''
            });
        }
        if (user) {
            setProfileDetails({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const fetchGrievances = async () => {
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const messages = await res.json();
                setGrievances(messages); // Automatically filtered on the connected backend route
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/orders/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Order was successfully cancelled.');
                fetchOrders();
            } else {
                const errData = await res.json();
                alert(errData.error || 'Could not cancel order.');
            }
        } catch (err) {
            console.error('Failed to cancel order', err);
            alert('A network error occurred.');
        }
    };

    const handleViewInvoice = (order) => {
        setSelectedOrder(order);
        setIsInvoiceOpen(true);
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        setIsSending(true);
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: user?.name || 'Guest',
                    customerEmail: user?.email || 'guest@example.com',
                    message: messageText
                })
            });
            if (res.ok) {
                alert('Your message has been sent to Venthulir Support.');
                setMessageText('');
                setIsMessageModalOpen(false);
                fetchGrievances();
            } else {
                alert('Failed to send message.');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending message.');
        } finally {
            setIsSending(false);
        }
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        setIsUpdatingAddress(true);
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/auth/address`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileAddress)
            });
            if (res.ok) {
                const data = await res.json();
                updateUser({ ...user, deliveryAddress: data.deliveryAddress });
                alert('Your delivery address has been successfully updated.');
            } else {
                alert('Failed to update address.');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating address.');
        } finally {
            setIsUpdatingAddress(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const token = localStorage.getItem('venthulir_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileDetails)
            });
            if (res.ok) {
                const data = await res.json();
                updateUser(data.user);
                alert('Your profile has been successfully updated.');
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating profile.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="cp-wrapper">
            <div className="cp-container">

                {/* Dashboard Grid View */}
                {activeSection === 'Dashboard' && (
                    <>
                        <div className="cp-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button
                                onClick={() => appNavigate('home')}
                                style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                                <ArrowLeft size={28} />
                            </button>
                            <h1 className="cp-title" style={{ margin: 0 }}>Your Account</h1>
                        </div>
                        <div className="cp-grid">
                            <div className="cp-card-box" onClick={() => setActiveSection('Your Orders')}>
                                <div className="cp-card-icon"><Package size={24} /></div>
                                <div className="cp-card-content">
                                    <h3>Your Orders</h3>
                                    <p>Track, return, or buy things again</p>
                                </div>
                            </div>
                            <div className="cp-card-box" onClick={() => setActiveSection('Login & Security')}>
                                <div className="cp-card-icon"><Settings size={24} /></div>
                                <div className="cp-card-content">
                                    <h3>Login & security</h3>
                                    <p>Edit login, name, and mobile number</p>
                                </div>
                            </div>
                            <div className="cp-card-box" onClick={() => setActiveSection('Your Addresses')}>
                                <div className="cp-card-icon"><FileText size={24} /></div>
                                <div className="cp-card-content">
                                    <h3>Your Addresses</h3>
                                    <p>Edit delivery addresses for orders</p>
                                </div>
                            </div>
                            <div className="cp-card-box" onClick={() => setActiveSection('Customer Service')}>
                                <div className="cp-card-icon"><ShieldQuestion size={24} /></div>
                                <div className="cp-card-content">
                                    <h3>Customer Service</h3>
                                    <p>Browse help topics, track complaints</p>
                                </div>
                            </div>
                            {(user?.isAdmin || user?.email === 'shreenithya111@gmail.com') && (
                                <div className="cp-card-box" onClick={() => (window.location.href = '/admin')}>
                                    <div className="cp-card-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><LayoutDashboard size={24} /></div>
                                    <div className="cp-card-content">
                                        <h3 style={{ color: '#4f46e5' }}>Admin Panel</h3>
                                        <p>Manage products, orders, and users</p>
                                    </div>
                                </div>
                            )}

                            <div className="cp-card-box" onClick={logout}>
                                <div className="cp-card-icon" style={{ backgroundColor: '#fff0f0', color: '#B12704' }}><LogOut size={24} /></div>
                                <div className="cp-card-content">
                                    <h3 style={{ color: '#B12704' }}>Sign Out</h3>
                                    <p>Securely log out of your account</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Main Content Areas */}
                {activeSection !== 'Dashboard' && (
                    <div className="cp-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '15px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
                        <button
                            onClick={() => setActiveSection('Dashboard')}
                            style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: 'bold' }}
                        >
                            <ArrowLeft size={20} style={{ marginRight: '8px' }} /> <span style={{ color: '#007185' }}>Your Account</span> <ChevronRight size={16} style={{ margin: '0 5px', color: '#888' }} /> <span style={{ color: '#111' }}>{activeSection}</span>
                        </button>
                    </div>
                )}

                {activeSection === 'Your Orders' && (
                    <div>
                        <div className="cp-header">
                            <h1 className="cp-title">Your Orders</h1>
                        </div>

                        <div className="cp-order-list">
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <Package size={48} style={{ color: '#ccc', margin: '0 auto 15px' }} />
                                    <h3 style={{ fontSize: '18px', color: '#111', margin: '0 0 10px 0' }}>Looks like you haven't placed an order yet.</h3>
                                    <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Start filling your basket with fresh organic goods.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <motion.div
                                        key={order._id || order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="cp-order-card"
                                    >
                                        <div className="cp-order-meta">
                                            <div className="cp-order-stats">
                                                <div>
                                                    <p className="cp-meta-label">Order Placed</p>
                                                    <p className="cp-meta-value">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="cp-meta-label">Total</p>
                                                    <p className="cp-meta-value">₹{order.totalAmount || order.total}</p>
                                                </div>
                                                <div>
                                                    <p className="cp-meta-label">Order #</p>
                                                    <p className="cp-meta-value">{order._id || order.id}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {(order.status === 'Pending' || order.status === 'Processing') && (
                                                    <button onClick={() => handleCancelOrder(order._id || order.id)} className="cp-invoice-btn" style={{ background: '#fff0f0', color: '#B12704', borderColor: '#f5c6c6' }}>
                                                        Cancel Order
                                                    </button>
                                                )}
                                                <button onClick={() => handleViewInvoice(order)} className="cp-invoice-btn">
                                                    View Invoice
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cp-order-body">
                                            <div className="cp-order-status-header">
                                                <div className="cp-status-title">
                                                    Status: {order.status}
                                                </div>
                                                <button onClick={() => setIsMessageModalOpen(true)} className="cp-assist-btn">Get Product Support</button>
                                            </div>

                                            <OrderTracking status={order.status} />

                                            <div className="cp-order-items">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="cp-item-row">
                                                        <div className="cp-item-icon"><ShoppingBag size={24} /></div>
                                                        <div className="cp-item-details">
                                                            <p className="cp-item-name">{item.name}</p>
                                                            <p className="cp-item-price">₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'Customer Service' && (
                    <div>
                        <div className="cp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1 className="cp-title">Customer Service</h1>
                            <button
                                onClick={() => setIsMessageModalOpen(true)}
                                className="cp-btn-primary"
                                style={{ marginTop: 0 }}
                            >
                                Contact Us
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {grievances.map((g) => (
                                <div key={g._id} className="cp-card" style={{ maxWidth: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#555', marginBottom: '5px' }}>Status: {g.status}</p>
                                            <h3 style={{ fontSize: '16px', color: '#111', margin: 0 }}>{new Date(g.createdAt).toLocaleDateString()}</h3>
                                        </div>
                                        <div style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', background: g.status === 'Open' ? '#fcf4d9' : '#e6f4ea', color: g.status === 'Open' ? '#B8860B' : '#137333' }}>
                                            {g.status}
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #eee' }}>
                                        <p style={{ fontSize: '14px', color: '#333', margin: 0 }}>"{g.message}"</p>
                                    </div>
                                    {g.reply && (
                                        <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Follow-up Response</p>
                                            <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>{g.reply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {grievances.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <ShieldQuestion size={48} style={{ color: '#ccc', margin: '0 auto 15px' }} />
                                    <h3 style={{ fontSize: '18px', color: '#111', margin: '0 0 10px 0' }}>No active cases.</h3>
                                    <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Your inquiries and complaints will be listed here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'Login & Security' && (
                    <div>
                        <div className="cp-header">
                            <h1 className="cp-title">Login & Security</h1>
                        </div>

                        <div className="cp-card">
                            <h3 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#111' }}>Edit Profile Information</h3>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="cp-form-row">
                                    <label className="cp-input-label">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="cp-input"
                                        value={profileDetails.name}
                                        onChange={e => setProfileDetails({ ...profileDetails, name: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="cp-form-row">
                                    <label className="cp-input-label">Email Address</label>
                                    <input
                                        type="text"
                                        readOnly
                                        disabled
                                        className="cp-input"
                                        value={user?.email || ''}
                                        style={{ background: '#f0f0f0', color: '#777', cursor: 'not-allowed' }}
                                    />
                                    <span style={{ fontSize: '11px', color: '#555' }}>Email address cannot be changed.</span>
                                </div>
                                <div className="cp-form-row">
                                    <label className="cp-input-label">Mobile Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="cp-input"
                                        value={profileDetails.phone}
                                        onChange={e => setProfileDetails({ ...profileDetails, phone: e.target.value })}
                                        placeholder="Secure contact number"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="cp-btn-primary"
                                >
                                    {isUpdatingProfile ? 'Saving...' : 'Save Profile Details'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === 'Your Addresses' && (
                    <div>
                        <div className="cp-header">
                            <h1 className="cp-title">Your Addresses</h1>
                        </div>

                        <div className="cp-card">
                            <h3 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#111' }}>Default Delivery Address</h3>
                            <form onSubmit={handleUpdateAddress}>
                                <div className="cp-form-row">
                                    <label className="cp-input-label">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="cp-input"
                                        value={profileAddress.address}
                                        onChange={e => setProfileAddress({ ...profileAddress, address: e.target.value })}
                                        placeholder="House/Flat No., Street, Area"
                                    />
                                </div>
                                <div className="cp-form-group">
                                    <div className="cp-form-row">
                                        <label className="cp-input-label">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="cp-input"
                                            value={profileAddress.city}
                                            onChange={e => setProfileAddress({ ...profileAddress, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="cp-form-row">
                                        <label className="cp-input-label">State</label>
                                        <input
                                            type="text"
                                            required
                                            className="cp-input"
                                            value={profileAddress.state}
                                            onChange={e => setProfileAddress({ ...profileAddress, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="cp-form-row">
                                    <label className="cp-input-label">ZIP Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="cp-input"
                                        value={profileAddress.zipCode}
                                        onChange={e => setProfileAddress({ ...profileAddress, zipCode: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdatingAddress}
                                    className="cp-btn-primary"
                                >
                                    {isUpdatingAddress ? 'Saving Changes...' : 'Save Default Address'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <InvoiceModal
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                orderData={selectedOrder}
            />

            {/* Assistance Modal */}
            <AnimatePresence>
                {isMessageModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                        >
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', marginBottom: '15px' }}>Contact Venthulir Support</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Your Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '3px', border: '1px solid #ddd', background: '#f5f5f5', color: '#555', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Message / Complaint</label>
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Describe your issue in detail..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '3px', border: '1px solid #888', minHeight: '120px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setIsMessageModalOpen(false)}
                                    style={{ padding: '8px 16px', borderRadius: '8px', color: '#0F1111', backgroundColor: '#fff', border: '1px solid #d5d9d9', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending || !messageText.trim()}
                                    style={{ padding: '8px 16px', borderRadius: '8px', background: '#FFD814', border: '1px solid #FCD200', color: '#0F1111', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', opacity: (isSending || !messageText.trim()) ? 0.6 : 1, cursor: 'pointer' }}
                                >
                                    {isSending ? 'Sending...' : <><Send size={16} /> Send Message</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default CustomerPage;
