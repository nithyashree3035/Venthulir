import React, { useState } from 'react';
import logo from '../assets/organic.png';

const AdminLoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || 'Invalid credentials.');
                setLoading(false);
                return;
            }

            // Strict: server must say this user is an admin
            if (!data.user?.isAdmin) {
                setError('Access Denied. This portal is for authorized personnel only.');
                setLoading(false);
                return;
            }

            // Valid admin — store session under admin-specific key (separate from customer)
            localStorage.setItem('venthulir_admin_token', data.token);
            localStorage.setItem('venthulir_admin_user', JSON.stringify(data.user));
            onLoginSuccess(data.user, data.token);

        } catch {
            setError('Server connection failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #071e12 0%, #0b3d2e 50%, #0a2e22 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            padding: '20px'
        }}>
            {/* Subtle background pattern */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(212,175,55,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.05) 0%, transparent 50%)'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '20px',
                padding: '50px 40px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>
                {/* Lock Icon at top */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <img src={logo} alt="Venthulir" style={{ height: '38px', objectFit: 'contain', display: 'block', margin: '0 auto 10px' }} />
                    <p style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                        Royal Admin Portal
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginTop: '8px' }}>
                        Restricted Access — Authorized Personnel Only
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                        color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Admin Email
                        </label>
                        <input
                            type="email"
                            required
                            autoComplete="username"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: '10px',
                                border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.05)',
                                color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                                transition: '0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: '10px',
                                border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(255,255,255,0.05)',
                                color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                                transition: '0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '15px',
                            background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #b8962e)',
                            color: '#0b3d2e', border: 'none', borderRadius: '10px',
                            fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.5px', marginTop: '6px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            transition: '0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(212,175,55,0.3)'
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #0b3d2e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Access Admin Panel
                            </>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '30px' }}>
                    © Venthulir Royal Reserves — Secure Portal
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
