import React, { useState, useEffect } from 'react';
import { X, Check, Heart, ShoppingBag } from 'lucide-react';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        window.addOrganicNotification = (msg, type = 'success') => {
            const id = Date.now();
            setNotifications(prev => [...prev, { id, msg, type }]);
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 3000);
        };

        return () => {
            delete window.addOrganicNotification;
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'wishlist': return <Heart size={14} fill="#fff" stroke="none" />;
            case 'cart': return <ShoppingBag size={14} />;
            default: return <Check size={14} strokeWidth={3} />;
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div 
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'flex-end',
                pointerEvents: 'none'
            }}
            role="status"
            aria-live="polite"
        >
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className="notification-slide-in"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 40px 14px 16px',
                        minWidth: '280px',
                        background: 'linear-gradient(135deg, #0b3d2e 0%, #1a5e48 100%)',
                        borderRadius: '16px 4px 16px 16px',
                        border: '2px solid #d4af37',
                        boxShadow: '0 10px 30px rgba(11, 46, 31, 0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Icon */}
                        <div style={{
                            background: 'linear-gradient(135deg, #d4af37, #b8962f)',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            color: '#051a12'
                        }}>
                            {getIcon(notification.type)}
                        </div>

                        {/* Message */}
                        <div style={{ flex: 1 }}>
                            <p style={{
                                color: '#f5f1e8',
                                fontSize: '14px',
                                fontWeight: 600,
                                margin: 0
                            }}>
                                {notification.msg}
                            </p>
                            <p style={{
                                color: '#8fb8a2',
                                fontSize: '11px',
                                margin: '4px 0 0 0'
                            }}>
                                🌿 Venthulir
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => removeNotification(notification.id)}
                            aria-label="Close notification"
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#d4af37',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%',
                                display: 'flex'
                            }}
                        >
                            <X size={14} />
                        </button>

                        {/* Progress Bar (CSS Animation) */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #d4af37, #2d6b4a)',
                                borderRadius: '0 0 16px 16px',
                                width: '100%',
                                transformOrigin: 'left',
                                animation: 'progressShrink 3s linear forwards'
                            }}
                        />
                    </div>
                    <style>{`
                        @keyframes progressShrink {
                            from { transform: scaleX(1); }
                            to { transform: scaleX(0); }
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default NotificationSystem;
