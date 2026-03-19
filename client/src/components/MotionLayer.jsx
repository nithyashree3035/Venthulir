import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppNavigation } from '../context/NavigationContext';
import './MotionLayer.css';

const MotionLayer = () => {
    const { appNavigate } = useAppNavigation();

    // The line-up of 3 students (products)
    const products = [
        { id: 'sambar', src: '/products/sambar.png', name: 'Traditional Sambar', tag: 'Authentic South Indian Blend' },
        { id: 'chilli', src: '/products/chilli.png', name: 'Original Salem Chilli', tag: 'Handpicked & Sun-Dried' },
        { id: 'coriander', src: '/products/coriander.png', name: 'Fresh Coriander', tag: 'Aromatic & Pure' }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Cycles the front-most item every 3.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % products.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [products.length]);

    // Calculates the "Student Line-up" position for exactly 3 items
    const getCardStyles = (queuePos) => {
        // Simple media query fallback logic
        const isMobile = window.innerWidth <= 768;
        const outX = isMobile ? 60 : 250;
        const bgY = isMobile ? -50 : -60;

        switch (queuePos) {
            case 0:
                return { x: 0, y: isMobile ? -10 : 15, scale: 1.05, zIndex: 10, opacity: 1, rotate: 0 };
            case 1:
                return { x: 0, y: bgY, scale: 0.85, zIndex: 9, opacity: 0.5, rotate: 0 };
            case 2:
                return { x: outX, y: -20, scale: 0.9, zIndex: 11, opacity: 0, rotate: 25 };
            default:
                return { x: 0, y: 0, scale: 0, opacity: 0 };
        }
    };

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    return (
        <section className="premium-hero-container">
            {/* Ambient Background Glow */}
            <div className="premium-glow-sphere"></div>

            <div className="premium-hero-content">
                {/* Left Side: Dramatic Typography */}
                <div className="hero-text-column" style={{ animation: 'fadeUp 0.8s ease-out forwards' }}>
                    <div className="brand-eyebrow">
                        <span className="organic-dot"></span> 100% PURE & TRADITIONAL
                    </div>

                    <h1 className="hero-monumental-title" style={{ fontSize: '54px', lineHeight: '1.1' }}>
                        100% Natural Herbal<br />
                        <span className="text-highlight">Products</span> for Healthy<br />Everyday Living 🌿
                    </h1>

                    <p className="hero-sophisticated-desc">
                        Chemical-free powders & wellness products made with traditional ingredients.
                    </p>

                    <div className="hero-action-row">
                        <button
                            className="premium-primary-btn"
                            onClick={() => {
                                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ backgroundColor: '#2e7d32' }}
                        >
                            Shop Now
                        </button>
                        <button
                            className="premium-secondary-btn"
                            onClick={() => {
                                window.scrollTo(0, 0);
                                appNavigate('all-products')
                            }}
                            style={{ color: '#f57f17', borderBottom: '2px solid #f57f17', paddingBottom: '4px' }}
                        >
                            View Best Sellers
                        </button>
                    </div>
                </div>

                {/* Right Side: The Student Line Queue */}
                <div className="hero-visual-column">
                    <div className="epic-stack-stage">
                        {products.map((p, i) => {
                            // Math logic to figure out where each card sits in the 0-4 queue based on the current active item
                            const queuePos = (i - activeIndex + products.length) % products.length;
                            return (
                                <motion.div
                                    key={p.id}
                                    className={`epic-stack-card ${queuePos === 0 ? 'active-salute' : ''}`}
                                    initial={false}
                                    animate={getCardStyles(queuePos)}
                                    transition={{ duration: 0.9, ease: [0.25, 1, 0.4, 1] }}
                                    onClick={() => setActiveIndex(i)}
                                >
                                    <div className="product-image-wrapper">
                                        <img src={p.src} alt={p.name} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Soft Grain Overlay for Luxury Editorial feel */}
            <div className="luxury-noise-overlay"></div>
        </section>
    );
};

export default MotionLayer;