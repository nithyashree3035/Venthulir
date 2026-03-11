import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, Users, ShoppingCart,
    Image as ImageIcon, Plus, ShieldQuestion, Send,
    LogOut, Trash2, Edit2, CheckCircle, Activity,
    AlertTriangle, BarChart2, RefreshCw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AdminLayout from '../layouts/AdminLayout';
import { api } from '../services/api';
import { API_BASE } from '../constants';

function AdminPage({ onLogout }) {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [stats, setStats] = useState({ productCount: 0, userCount: 0, orderCount: 0, messageCount: 0, lowStockCount: 0, outOfStockCount: 0 });
    const [coupons, setCoupons] = useState([]);
    const [inventory, setInventory] = useState({ totalProducts: 0, totalStock: 0, lowStockProducts: [], outOfStockProducts: [], allProducts: [] });
    const [restockInputs, setRestockInputs] = useState({});
    const [prodForm, setProdForm] = useState({ productCode: '', name: '', price: '', description: '', category: 'General', badge: '', shippingCharge: 0, initialStock: '', originalPrice: '', discountPercent: '' });
    const [couponForm, setCouponForm] = useState({ couponCode: '', productId: '', maxUses: 25, expiryDate: '', discountPercentage: 10, status: 'Active' });
    const [isEditingCoupon, setIsEditingCoupon] = useState(false);
    const [editingCouponId, setEditingCouponId] = useState(null);
    const [orderStartDate, setOrderStartDate] = useState('');
    const [orderEndDate, setOrderEndDate] = useState('');
    const [variants, setVariants] = useState([]);
    const [variantInput, setVariantInput] = useState({ label: '', price: '' });
    const [showCustomUnit, setShowCustomUnit] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [replyTexts, setReplyTexts] = useState({});
    const [isResolving, setIsResolving] = useState({});

    useEffect(() => {
        fetchData();

        // Real-time polling every 5s
        let interval;
        if (activeTab === 'Orders' || activeTab === 'Dashboard' || activeTab === 'Inventory') {
            interval = setInterval(() => {
                fetchData();
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTab]);

    const fetchData = async () => {
        // Each tab's fetch is isolated — failure in one won't break others
        try {
            if (activeTab === 'Dashboard') {
                const s = await api.get('/admin/stats');
                setStats(s);
            }

        } catch (err) { console.error('Stats fetch error:', err); }

        try {
            if (activeTab === 'Users') setUsers(await api.get('/admin/users'));
        } catch (err) { console.error('Users fetch error:', err); }

        try {
            if (activeTab === 'Orders') setOrders(await api.get('/admin/orders'));
        } catch (err) { console.error('Orders fetch error:', err); }

        try {
            if (activeTab === 'Queries') {
                const msgs = await api.get('/admin/messages');
                setMessages(Array.isArray(msgs) ? msgs : []);
            }
        } catch (err) { console.error('Messages fetch error:', err); }

        try {
            if (activeTab === 'All Products') {
                const prodList = await api.get('/admin/products');
                setProducts(prodList);
            }
        } catch (err) { console.error('Products fetch error:', err); }

        try {
            if (activeTab === 'Inventory') {
                const inv = await api.get('/admin/inventory');
                setInventory(inv);
            }
        } catch (err) { console.error('Inventory fetch error:', err); }

        try {
            if (activeTab === 'Activity') {
                const logs = await api.get('/admin/logs');
                setActivityLogs(logs);
            }
        } catch (err) { console.error('Activity fetch error:', err); }

        try {
            if (activeTab === 'Coupons') {
                const fetchedCoupons = await api.get('/coupons');
                setCoupons(Array.isArray(fetchedCoupons) ? fetchedCoupons : []);
                if (products.length === 0) {
                    const fetchedProducts = await api.get('/admin/products');
                    setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
                }
            }
        } catch (err) { console.error('Coupons fetch error:', err); }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert('Failed to update status: ' + (err.message || 'Unknown error'));
        }
    };

    const handleRestock = async (productId) => {
        const qty = parseInt(restockInputs[productId] || 0);
        if (!qty || qty <= 0) return alert('Enter a valid quantity.');
        try {
            await api.put(`/admin/inventory/${productId}/restock`, { quantity: qty });
            setRestockInputs(prev => ({ ...prev, [productId]: '' }));
            fetchData();
        } catch (err) {
            alert('Restock failed: ' + err.message);
        }
    };

    const handleAddVariant = () => {
        if (!variantInput.label.trim()) {
            alert("Please select or enter a measurement unit (e.g. 100g)");
            return;
        }

        const finalPrice = variantInput.price || prodForm.price;
        if (!finalPrice) {
            alert("Please provide a price for this variant or set a Base Price first.");
            return;
        }

        setVariants([...variants, {
            label: variantInput.label,
            price: parseFloat(finalPrice)
        }]);
        setVariantInput({ label: '', price: '' });
        setShowCustomUnit(false);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const remainingSlots = 5 - previewUrls.length;
            const filesToAdd = files.slice(0, remainingSlots);

            if (filesToAdd.length < files.length) {
                alert('Only 5 images total allowed per product.');
            }

            const newPreviews = filesToAdd.map(file => ({
                url: URL.createObjectURL(file),
                file: file
            }));

            setPreviewUrls([...previewUrls, ...newPreviews]);
            e.target.value = '';
        }
    };

    const removeImage = (index, e) => {
        if (e) e.stopPropagation();
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviews);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            // 1. Upload new files found in the previewUrls objects
            const filesToUpload = previewUrls.filter(p => p.file).map(p => p.file);

            let uploadedUrls = [];
            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach(file => formData.append('images', file));

                const uploadRes = await fetch(`${API_BASE}/admin/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('venthulir_admin_token') || localStorage.getItem('venthulir_token')}` },
                    body: formData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    // Ensure image URLs use the production API base if they come back with localhost
                    uploadedUrls = data.imageUrls.map(url => {
                        if (url.includes('localhost:7000')) {
                            const productionBase = API_BASE.replace('/api', '');
                            return url.replace('http://localhost:7000', productionBase);
                        }
                        return url;
                    });
                } else {
                    const errorMsg = await uploadRes.text();
                    console.error("Upload error response:", errorMsg);
                    throw new Error("Failed to upload image. Please try again.");
                }
            }

            let uploadIdx = 0;
            const finalImages = previewUrls.map(p => {
                if (p.file) {
                    return uploadedUrls[uploadIdx++] || '';
                }
                return p.url;
            }).filter(u => u !== '');

            const productData = {
                ...prodForm,
                price: variants.length > 0 ? variants[0].price : 0,
                images: finalImages,
                imageUrl: finalImages.length > 0 ? finalImages[0] : '',
                variants: variants,
                originalPrice: prodForm.originalPrice || undefined,
                discountPercent: prodForm.discountPercent || undefined
            };

            if (isEditing) {
                await api.put(`/admin/products/${editingId}`, productData);
            } else {
                await api.post(`/admin/products`, productData);
            }

            alert(isEditing ? 'Success: Product Updated' : 'Success: Product Added');
            resetForm();
            fetchData();
            setActiveTab('All Products');
        } catch (err) {
            console.error('Submit Error:', err);
            alert('Action failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setProdForm({ productCode: '', name: '', price: '', description: '', category: 'General', badge: '', shippingCharge: 0, initialStock: '', originalPrice: '', discountPercent: '' });
        setVariants([]);
        setPreviewUrls([]);
        setIsEditing(false);
        setEditingId(null);
        setShowCustomUnit(false);
    };

    const handleEditProduct = (p) => {
        setProdForm({
            productCode: p.productCode || '',
            name: p.name,
            price: p.price,
            description: p.description,
            category: p.category,
            badge: p.badge || '',
            shippingCharge: p.shippingCharge || 0,
            initialStock: p.initialStock || 0,
            originalPrice: p.originalPrice || '',
            discountPercent: p.discountPercent || ''
        });
        setVariants(p.variants || []);
        setPreviewUrls((p.images || []).map(url => ({ url, file: null })));
        setIsEditing(true);
        setEditingId(p._id);
        setActiveTab('Add Product');
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to delete user.');
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await api.delete(`/admin/orders/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to delete order.');
        }
    };

    const handleResolveMessage = async (id) => {
        const reply = replyTexts[id];
        if (!reply) return alert('Please enter a response for the customer.');

        setIsResolving({ ...isResolving, [id]: true });
        try {
            await api.put(`/admin/messages/${id}/resolve`, { reply });
            alert('Success: Response sent via Email');
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsResolving({ ...isResolving, [id]: false });
        }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            if (isEditingCoupon && editingCouponId) {
                await api.put(`/coupons/${editingCouponId}`, couponForm);
                alert('Success: Coupon Updated');
            } else {
                await api.post('/coupons', couponForm);
                alert('Success: Coupon Generated');
            }
            setCouponForm({ couponCode: '', productId: '', maxUses: 25, expiryDate: '', discountPercentage: 10, status: 'Active' });
            setIsEditingCoupon(false);
            setEditingCouponId(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleEditCoupon = (c) => {
        setCouponForm({
            couponCode: c.couponCode,
            productId: c.productId || '',
            maxUses: c.maxUses,
            expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
            discountPercentage: c.discountPercentage,
            status: c.status
        });
        setIsEditingCoupon(true);
        setEditingCouponId(c._id);
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getFilteredOrders = () => {
        return orders.filter(o => {
            const d = new Date(o.createdAt);
            if (orderStartDate && d < new Date(orderStartDate)) return false;
            if (orderEndDate && d > new Date(new Date(orderEndDate).setHours(23, 59, 59, 999))) return false;
            return true;
        });
    };

    const exportOrdersToCSV = () => {
        const filtered = getFilteredOrders();
        if (filtered.length === 0) return alert('No orders to export.');

        const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Phone", "Total Amount", "Status"];
        const rows = filtered.map(o => [
            o._id,
            new Date(o.createdAt).toLocaleString().replace(/,/g, ''),
            o.customerName,
            o.customerEmail,
            o.phone || "N/A",
            o.totalAmount,
            o.status
        ]);

        let csvContent = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `venthulir_orders_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <div>
                        <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setActiveTab('Orders')}>
                                <h3>Orders</h3>
                                <p style={statStyle}>{stats.orderCount}</p>
                            </div>
                            <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setActiveTab('All Products')}>
                                <h3>Products</h3>
                                <p style={statStyle}>{stats.productCount}</p>
                            </div>
                            <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setActiveTab('Users')}>
                                <h3>Customers</h3>
                                <p style={statStyle}>{stats.userCount}</p>
                            </div>
                            <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => setActiveTab('Queries')}>
                                <h3>Unresolved Queries</h3>
                                <p style={{ ...statStyle, color: stats.messageCount > 0 ? '#ef4444' : '#22c55e' }}>{stats.messageCount}</p>
                            </div>
                            <div style={{ ...cardStyle, cursor: 'pointer', borderLeft: '4px solid #f59e0b' }} onClick={() => setActiveTab('Inventory')}>
                                <h3>⚠ Low Stock</h3>
                                <p style={{ ...statStyle, color: stats.lowStockCount > 0 ? '#f59e0b' : '#22c55e' }}>{stats.lowStockCount}</p>
                            </div>
                            <div style={{ ...cardStyle, cursor: 'pointer', borderLeft: '4px solid #ef4444' }} onClick={() => setActiveTab('Inventory')}>
                                <h3>🚫 Out of Stock</h3>
                                <p style={{ ...statStyle, color: stats.outOfStockCount > 0 ? '#ef4444' : '#22c55e' }}>{stats.outOfStockCount}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Add Product':
                return (
                    <div className="admin-form-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ margin: 0 }}>{isEditing ? 'Edit Existing Harvest' : 'Register New Harvest'}</h3>
                                {isEditing && <button onClick={resetForm} style={{ ...buttonStyle, marginTop: 0, padding: '8px 15px', background: '#94a3b8' }}>Cancel</button>}
                            </div>
                            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="form-section">
                                    <label style={labelStyle}>Harvest Gallery (1st slot is primary)</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i}
                                                onClick={() => !previewUrls[i] && document.getElementById('fileInput').click()}
                                                style={{
                                                    width: '70px', height: '70px', borderRadius: '10px', border: previewUrls[i] ? '2px solid #0b3d2e' : '2px dashed #cbd5e1',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                                    background: '#fff', position: 'relative', cursor: 'pointer'
                                                }}
                                            >
                                                {previewUrls[i] ? (
                                                    <>
                                                        <img src={previewUrls[i].url} alt="slot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => removeImage(i, e)}
                                                            style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}
                                                        >✕</button>
                                                    </>
                                                ) : <Plus size={16} color="#cbd5e1" />}
                                            </div>
                                        ))}
                                    </div>
                                    <input id="fileInput" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                                    <div>
                                        <label style={labelStyle}>Product Code (Auto if empty)</label>
                                        <input type="text" style={inputStyle} placeholder="Auto-generated" value={prodForm.productCode} onChange={e => setProdForm({ ...prodForm, productCode: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Name</label>
                                        <input type="text" required style={inputStyle} value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <select style={inputStyle} value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })}>
                                            <option>General</option>
                                            <option>Spices</option>
                                            <option>Essential Oils</option>
                                            <option>Health & Skin Care</option>
                                            <option>Wellness Products</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Badge</label>
                                        <select style={inputStyle} value={prodForm.badge} onChange={e => setProdForm({ ...prodForm, badge: e.target.value })}>
                                            <option value="">None</option>
                                            <option>Best Seller</option>
                                            <option>New Arrival</option>
                                            <option>Pure</option>
                                            <option>Premium</option>
                                            <option>Organic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Initial Stock (Units) 🔒</label>
                                        <input
                                            type="number"
                                            min="0"
                                            style={inputStyle}
                                            placeholder="e.g. 100"
                                            value={prodForm.initialStock}
                                            onChange={e => setProdForm({ ...prodForm, initialStock: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Shipping Charge (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            style={inputStyle}
                                            placeholder="e.g. 100"
                                            value={prodForm.shippingCharge || 0}
                                            onChange={e => setProdForm({ ...prodForm, shippingCharge: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>MRP Illusion (₹)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="Strikethrough Price"
                                            value={prodForm.originalPrice}
                                            onChange={e => setProdForm({ ...prodForm, originalPrice: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Discount Illusion (%)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="e.g. 30"
                                            value={prodForm.discountPercent}
                                            onChange={e => setProdForm({ ...prodForm, discountPercent: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="variants-builder" style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
                                    <label style={labelStyle}>Measurements & Pricing</label>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <input type="text" placeholder="Size (50g)" style={inputStyle} value={variantInput.label} onChange={e => setVariantInput({ ...variantInput, label: e.target.value })} />
                                        <input type="number" placeholder="Price" style={inputStyle} value={variantInput.price} onChange={e => setVariantInput({ ...variantInput, price: e.target.value })} />
                                        <button type="button" onClick={handleAddVariant} style={{ ...buttonStyle, marginTop: 0, padding: '0 20px' }}>Add</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {variants.map((v, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <strong>{v.label} - ₹{v.price}</strong>
                                                <button type="button" onClick={() => removeVariant(i)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label style={labelStyle}>Public Description (Justified Layout)</label>
                                    <textarea
                                        required
                                        style={{ ...inputStyle, height: '140px', resize: 'vertical', textAlign: 'justify' }}
                                        value={prodForm.description}
                                        onChange={e => setProdForm({ ...prodForm, description: e.target.value })}
                                        placeholder="Enter the royal description..."
                                    ></textarea>
                                </div>
                                <button type="submit" disabled={isUploading} style={{ ...buttonStyle, width: '100%' }}>
                                    {isUploading ? 'Securing Data...' : (isEditing ? 'Update Records' : 'Publish Harvest')}
                                </button>
                            </form>
                        </div>
                        <div className="preview-sticky">
                            <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Live View</h4>
                            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                                <ProductCard product={{ ...prodForm, price: variants[0]?.price || 0, imageUrl: previewUrls[0]?.url, variants }} />
                            </div>
                        </div>
                    </div>
                );
            case 'Users':
                return (
                    <div style={cardStyle}>
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Customer</th>
                                    <th style={thStyle}>Contact</th>
                                    <th style={thStyle}>Delivery Address</th>
                                    <th style={thStyle}>Joined</th>
                                    <th style={thStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={trStyle}>
                                        <td style={tdStyle}><strong>{u.name}</strong></td>
                                        <td style={tdStyle}>{u.email}<br /><small>{u.phone}</small></td>
                                        <td style={tdStyle}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {u.deliveryAddress?.address ? `${u.deliveryAddress.address}, ${u.deliveryAddress.city}, ${u.deliveryAddress.state} ${u.deliveryAddress.zipCode}` : 'Not Provided'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => handleDeleteUser(u._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete Customer">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                );
            case 'Inventory':
                return (
                    <div>
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #0b3d2e', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Products</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0b3d2e' }}>{inventory.totalProducts}</div>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Units In Stock</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{inventory.totalStock}</div>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>⚠ Low Stock (&lt;10)</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{inventory.lowStockProducts?.length || 0}</div>
                            </div>
                            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>🚫 Out of Stock</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444' }}>{inventory.outOfStockProducts?.length || 0}</div>
                            </div>
                        </div>
                        {/* All Products Stock Table */}
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: 16 }}>Product Stock Levels</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Product</th>
                                        <th style={thStyle}>Code</th>
                                        <th style={thStyle}>Category</th>
                                        <th style={thStyle}>Initial Stock</th>
                                        <th style={thStyle}>Current Stock</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Restock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.allProducts?.map(p => {
                                        const isOut = p.currentStock === 0;
                                        const isLow = !isOut && p.currentStock < 10;
                                        return (
                                            <tr key={p._id} style={{ ...trStyle, background: isOut ? '#fff5f5' : isLow ? '#fffbeb' : '#fff' }}>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <img src={p.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                                                        <strong>{p.name}</strong>
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{ fontFamily: 'monospace', background: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700, border: '1px solid #86efac' }}>
                                                        {p.productCode || '—'}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>{p.category}</td>
                                                <td style={tdStyle}>{p.initialStock}</td>
                                                <td style={{ ...tdStyle, fontWeight: 800, color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#0b3d2e' }}>
                                                    {p.currentStock}
                                                </td>
                                                <td style={tdStyle}>
                                                    {isOut ? <span style={{ background: '#fee2e2', color: '#ef4444', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>OUT OF STOCK</span>
                                                        : isLow ? <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>LOW STOCK</span>
                                                            : <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>IN STOCK</span>}
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                        <input
                                                            type="number" min="1"
                                                            placeholder="Qty"
                                                            style={{ width: 60, padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
                                                            value={restockInputs[p._id] || ''}
                                                            onChange={e => setRestockInputs(prev => ({ ...prev, [p._id]: e.target.value }))}
                                                        />
                                                        <button
                                                            onClick={() => handleRestock(p._id)}
                                                            style={{ padding: '6px 10px', background: '#0b3d2e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                                                        >+ Add</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Orders':
                return (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Start Date</label>
                                    <input type="date" value={orderStartDate} onChange={(e) => setOrderStartDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>End Date</label>
                                    <input type="date" value={orderEndDate} onChange={(e) => setOrderEndDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div style={{ alignSelf: 'flex-end', paddingBottom: '2px' }}>
                                    <button onClick={() => { setOrderStartDate(''); setOrderEndDate(''); }} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>
                                        Clear Filter
                                    </button>
                                </div>
                            </div>
                            <button onClick={exportOrdersToCSV} style={{ padding: '10px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                Download Excel (CSV)
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Date</th>
                                    <th style={thStyle}>Customer Info</th>
                                    <th style={thStyle}>Delivery Details</th>
                                    <th style={thStyle}>Order Summary</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredOrders().map(o => (
                                    <tr key={o._id} style={trStyle}>
                                        <td style={tdStyle}>
                                            <strong>{new Date(o.createdAt).toLocaleDateString()}</strong><br />
                                            <small style={{ color: '#64748b' }}>{new Date(o.createdAt).toLocaleTimeString()}</small>
                                        </td>
                                        <td style={tdStyle}>
                                            <strong style={{ color: '#0b3d2e' }}>{o.customerName}</strong><br />
                                            <a href={`mailto:${o.customerEmail}`} style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>{o.customerEmail}</a><br />
                                            <small style={{ fontWeight: 'bold' }}>📞 {o.phone || 'N/A'}</small>
                                        </td>
                                        <td style={tdStyle}>
                                            {o.deliveryAddress ? (
                                                <div style={{ fontSize: '12px', color: '#475569', maxWidth: '200px' }}>
                                                    {o.deliveryAddress.address},<br />
                                                    {o.deliveryAddress.city}, {o.deliveryAddress.state} - {o.deliveryAddress.zipCode}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#ef4444', fontSize: '12px' }}>Not Provided</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                                                {o.items?.map((item, idx) => (
                                                    <div key={idx} style={{ marginBottom: '2px' }}>• {item.quantity}x {item.name} {item.variant ? `(${item.variant})` : ''}</div>
                                                ))}
                                            </div>
                                            <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px', fontSize: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                                                    <span>Subtotal:</span>
                                                    <span>₹{o.originalAmount ? o.originalAmount : o.totalAmount}</span>
                                                </div>
                                                {o.discountAmount > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', marginTop: '2px' }}>
                                                        <span>Discount ({o.couponUsed}):</span>
                                                        <span>- ₹{o.discountAmount}</span>
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0b3d2e', fontWeight: '900', marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                                                    <span>Total:</span>
                                                    <span>₹{o.totalAmount}</span>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 'bold', color: '#d4af37', background: '#fdfcf7', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', border: '1px solid #f0ede0' }}>
                                                {o.paymentMethod || 'Cash on Delivery'}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <select
                                                value={o.status}
                                                onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                                                style={{
                                                    padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0',
                                                    fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                                                    background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#dcfce7' : o.status === 'Returned' ? '#fef3c7' : '#f1f5f9',
                                                    color: o.status === 'Cancelled' ? '#ef4444' : o.status === 'Delivered' ? '#166534' : o.status === 'Returned' ? '#d97706' : '#475569'
                                                }}
                                            >
                                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={tdStyle}>
                                            <button onClick={() => handleDeleteOrder(o._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete Order">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                );
            case 'Coupons':
                return (
                    <div className="admin-form-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '20px' }}>Generate Coupon</h3>
                            <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Coupon Code</label>
                                    <input required type="text" style={inputStyle} value={couponForm.couponCode} onChange={e => setCouponForm({ ...couponForm, couponCode: e.target.value })} placeholder="e.g. SUMMER25" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Target Product (Optional)</label>
                                    <select style={inputStyle} value={couponForm.productId} onChange={e => setCouponForm({ ...couponForm, productId: e.target.value })}>
                                        <option value="">-- Apply to Generic Cart --</option>
                                        {products.map(p => <option key={p._id} value={p._id}>{p.name} {p.productCode ? `(${p.productCode})` : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Max Uses</label>
                                    <input required type="number" style={inputStyle} value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Discount %</label>
                                    <input required type="number" min="1" max="100" style={inputStyle} value={couponForm.discountPercentage} onChange={e => setCouponForm({ ...couponForm, discountPercentage: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Expiry Date</label>
                                    <input required type="date" style={inputStyle} value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} />
                                </div>
                                <button type="submit" style={buttonStyle}>{isEditingCoupon ? 'Update Coupon' : 'Save Coupon'}</button>
                                {isEditingCoupon && (
                                    <button type="button" onClick={() => { setIsEditingCoupon(false); setEditingCouponId(null); setCouponForm({ couponCode: '', productId: '', maxUses: 25, expiryDate: '', discountPercentage: 10, status: 'Active' }); }} style={{ ...buttonStyle, background: '#64748b', marginTop: '8px' }}>Cancel Edit</button>
                                )}
                            </form>
                        </div>
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '20px' }}>Active Coupons</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Code</th>
                                        <th style={thStyle}>Discount</th>
                                        <th style={thStyle}>Uses</th>
                                        <th style={thStyle}>Expires</th>
                                        <th style={thStyle}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                                No coupons generated yet. Start by creating one on the left.
                                            </td>
                                        </tr>
                                    )}
                                    {coupons.map(c => (
                                        <tr key={c._id} style={trStyle}>
                                            <td style={tdStyle}>
                                                <strong>{c.couponCode}</strong>
                                                {c.productId && (
                                                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                                                        Applied to: <strong>{c.productId.productCode || '—'}</strong>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={tdStyle}>{c.discountPercentage}%</td>
                                            <td style={tdStyle}>{c.usedCount} / {c.maxUses}</td>
                                            <td style={tdStyle}>{new Date(c.expiryDate).toLocaleDateString()}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => handleEditCoupon(c)} style={{ padding: '4px 8px', background: '#0b3d2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                                                    <button onClick={() => handleDeleteCoupon(c._id)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Queries':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {messages.length === 0 && (
                            <div style={{ ...cardStyle, textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                <ShieldQuestion size={48} style={{ margin: '0 auto 15px', display: 'block' }} />
                                <p>No customer messages or support queries found. All clear!</p>
                            </div>
                        )}
                        {messages.map(m => (
                            <div key={m._id} style={{ ...cardStyle, borderLeft: m.status === 'Open' ? '5px solid #d4af37' : '5px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{m.customerName}</h4>
                                        <small>{m.customerEmail} • {new Date(m.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: m.status === 'Open' ? '#d4af37' : '#94a3b8' }}>{m.status.toUpperCase()}</span>
                                </div>
                                <p style={{ fontStyle: 'italic', background: '#f8fafc', padding: '15px', borderRadius: '8px', color: '#475569' }}>"{m.message}"</p>
                                {m.status === 'Open' ? (
                                    <div style={{ marginTop: '20px' }}>
                                        <textarea
                                            placeholder="Write reply..."
                                            style={{ ...inputStyle, minHeight: '80px', marginBottom: '10px' }}
                                            value={replyTexts[m._id] || ''}
                                            onChange={e => setReplyTexts({ ...replyTexts, [m._id]: e.target.value })}
                                        />
                                        <button
                                            className="action-btn"
                                            disabled={isResolving[m._id]}
                                            onClick={() => handleResolveMessage(m._id)}
                                            style={{ ...buttonStyle, background: '#0b3d2e', color: '#d4af37' }}
                                        >
                                            {isResolving[m._id] ? 'Sending...' : 'Respond & Resolve'}
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '10px', fontSize: '14px', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                                        <strong>Reply:</strong> {m.reply}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 'Activity':
                return (
                    <div style={cardStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Time</th>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLogs.map((log, i) => (
                                    <tr key={i} style={trStyle}>
                                        <td style={tdStyle}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                                        <td style={tdStyle}>{log.userName}</td>
                                        <td style={tdStyle}><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{log.action}</code></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'All Products':
                return (
                    <div style={cardStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Product</th>
                                    <th style={thStyle}>Product Code</th>
                                    <th style={thStyle}>Price</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} style={trStyle}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <img src={p.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                                <strong>{p.name}</strong>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontFamily: 'monospace', background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', border: '1px solid #86efac' }}>
                                                {p.productCode || '—'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>₹{p.price}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEditProduct(p)} style={{ border: 'none', background: '#f1f5f9', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteProduct(p._id)} style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout}>
            {renderContent()}
        </AdminLayout>
    );
}

// Styling Objects
const cardStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #edf2f7',
};

const statStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0b3d2e',
    margin: '10px 0 0'
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none'
};

const buttonStyle = {
    background: '#0b3d2e',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: '0.2s',
    justifyContent: 'center'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #f1f5f9',
    color: '#64748b',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px'
};

const trStyle = {
    transition: 'background 0.2s'
};

export default AdminPage;
