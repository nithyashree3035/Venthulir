import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Printer } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, orderData }) => {
    if (!orderData) return null;

    const orderId = String(orderData._id || orderData.id || '');
    const shortId = orderId.slice(-8).toUpperCase();
    const orderDate = orderData.createdAt
        ? new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A';

    const subtotal = orderData.originalAmount || orderData.totalAmount || 0;
    const discount = orderData.discountAmount || 0;
    const total = orderData.totalAmount || 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(10, 46, 31, 0.85)', backdropFilter: 'blur(6px)',
                        padding: '16px'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fdfdfd',
                            borderRadius: '4px',
                            width: '100%',
                            maxWidth: '680px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                            position: 'relative',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        {/* Gold top border */}
                        <div style={{ height: '6px', background: 'linear-gradient(90deg, #0b3d2e, #d4af37, #0b3d2e)' }} />

                        <div style={{ padding: 'max(16px, 4vw)' }}>

                            {/* HEADER */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <div style={{ width: '36px', height: '36px', background: '#0b3d2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: '900', fontSize: '18px', fontStyle: 'italic' }}>V</div>
                                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0b3d2e', letterSpacing: '2px' }}>VENTHULIR</h2>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Organic Harvest · Salem, Tamil Nadu</p>
                                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>theventhulir@gmail.com</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h1 style={{ margin: '0 0 6px', fontSize: '36px', fontWeight: '900', color: '#0b3d2e', fontStyle: 'italic' }}>Invoice</h1>
                                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Order # <span style={{ fontFamily: 'monospace', color: '#0b3d2e', fontSize: '14px' }}>{shortId}</span></p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Full ID: <span style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>{orderId}</span></p>
                                </div>
                            </div>

                            {/* META ROW */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '28px', padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div>
                                    <p style={{ margin: '0 0 8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: '900' }}>Billed To</p>
                                    <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 'bold', color: '#0b3d2e' }}>{orderData.customerName || 'Customer'}</p>
                                    {orderData.deliveryAddress?.address && (
                                        <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#555' }}>{orderData.deliveryAddress.address}</p>
                                    )}
                                    {orderData.deliveryAddress?.city && (
                                        <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#555' }}>
                                            {orderData.deliveryAddress.city}{orderData.deliveryAddress.state ? `, ${orderData.deliveryAddress.state}` : ''}
                                            {orderData.deliveryAddress.zipCode ? ` - ${orderData.deliveryAddress.zipCode}` : ''}
                                        </p>
                                    )}
                                    {orderData.phone && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#555' }}>📞 {orderData.phone}</p>}
                                    {orderData.customerEmail && <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#555' }}>✉ {orderData.customerEmail}</p>}
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: '900' }}>Order Info</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#555' }}>Date: <strong style={{ color: '#111' }}>{orderDate}</strong></p>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#555' }}>Payment: <strong style={{ color: '#111' }}>{orderData.paymentMethod || 'Cash on Delivery'}</strong></p>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#555' }}>
                                        Status:&nbsp;
                                        <span style={{
                                            display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                            background: orderData.status === 'Delivered' ? '#dcfce7' : orderData.status === 'Cancelled' ? '#fee2e2' : orderData.status === 'Shipped' ? '#dbeafe' : '#fef9c3',
                                            color: orderData.status === 'Delivered' ? '#166534' : orderData.status === 'Cancelled' ? '#991b1b' : orderData.status === 'Shipped' ? '#1e40af' : '#854d0e'
                                        }}>
                                            {orderData.status}
                                        </span>
                                    </p>
                                    {orderData.couponUsed && (
                                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>Coupon: {orderData.couponUsed}</p>
                                    )}
                                </div>
                            </div>

                            {/* ITEMS TABLE */}
                            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '420px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #0b3d2e', background: '#f5f1e8' }}>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', color: '#0b3d2e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#0b3d2e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Qty</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#0b3d2e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Unit Price</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#0b3d2e', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderData.items.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                <td style={{ padding: '12px', color: '#111', fontWeight: 'bold' }}>
                                                    {item.name}
                                                    {item.variant && item.variant !== 'Standard' && (
                                                        <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: 'normal' }}>Size: {item.variant}</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center', color: '#555' }}>{item.quantity || 1}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', color: '#555' }}>₹{(item.price || 0).toLocaleString()}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#0b3d2e' }}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TOTALS */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                                <div style={{ width: '100%', maxWidth: '280px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px', color: '#555' }}>
                                        <span>Subtotal:</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    {(orderData.shippingCharge || 0) > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px', color: '#555' }}>
                                            <span>Shipping:</span>
                                            <span>+ ₹{(orderData.shippingCharge || 0).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px', color: '#166534', fontWeight: 'bold' }}>
                                            <span>Discount {orderData.couponUsed ? `(${orderData.couponUsed})` : ''}:</span>
                                            <span>- ₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 8px', fontSize: '18px', fontWeight: '900', color: '#0b3d2e', borderTop: '2px solid #0b3d2e' }}>
                                        <span>GRAND TOTAL:</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888', textAlign: 'right' }}>Payment: {orderData.paymentMethod || 'Cash on Delivery'}</p>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px dashed #ddd', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d6b4a' }}>
                                    <ShieldCheck size={18} />
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Venthulir Order</span>
                                </div>
                                <button
                                    onClick={() => window.print()}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #0b3d2e', background: '#fff', color: '#0b3d2e', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    <Printer size={16} /> Print Invoice
                                </button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#888', lineHeight: 0 }}
                        >
                            <X size={22} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InvoiceModal;
