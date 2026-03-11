import React, { useState } from 'react';
import {
    LayoutDashboard, Package, Users, ShoppingCart,
    ShieldQuestion, LogOut, Menu, X, Activity
} from 'lucide-react';
import logo from '../assets/organic.png';
import './AdminLayout.css';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const adminName = JSON.parse(localStorage.getItem('venthulir_user') || '{}')?.name || 'Administrator';

    const menuItems = [
        { id: 'Dashboard', icon: LayoutDashboard, label: 'Overview' },
        { id: 'Add Product', icon: Package, label: 'Add Harvest' },
        { id: 'All Products', icon: Package, label: 'All Products' },
        { id: 'Inventory', icon: Activity, label: 'Inventory' },
        { id: 'Users', icon: Users, label: 'Customers' },
        { id: 'Orders', icon: ShoppingCart, label: 'Orders' },
        { id: 'Coupons', icon: Activity, label: 'Coupons' },
        { id: 'Queries', icon: ShieldQuestion, label: 'Support' },
        { id: 'Activity', icon: Activity, label: 'Activity Logs' }
    ];

    return (
        <div className="admin-layout-container">
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="Logo" style={{ height: '30px' }} />
                    <span className="admin-brand">Venthulir Admin</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={onLogout}
                        title="Logout"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '6px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                    <div className="admin-user-bubble">{adminName?.[0]}</div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={logo} alt="Logo" style={{ height: '35px' }} />
                        <span className="sidebar-title">ROYAL PANEL</span>
                    </div>
                    <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout}>


                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="admin-main-content">
                <div className="admin-content-header">
                    <h2>{activeTab}</h2>
                    <div className="admin-user-info">
                        <span>{adminName || 'Administrator'}</span>
                        <div className="user-dot"></div>
                    </div>
                </div>
                <div className="admin-inner-stage">
                    {children}
                </div>
            </main>

            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
};

export default AdminLayout;
