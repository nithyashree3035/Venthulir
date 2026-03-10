import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ShopGrid from '../components/ShopGrid';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import './Home.css';

const Home = () => {
    const [leaves] = useState(() => {
        const leafCount = 35;
        return Array.from({ length: leafCount }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 20 + 's',
            duration: 20 + Math.random() * 25 + 's',
            size: 8 + Math.random() * 8 + 'px',
            drift: (Math.random() * 150 - 75) + 'px',
            rotation: Math.random() * 360,
        }));
    });

    return (
        <div className="home-unified-root">
            <Helmet>
                <title>Venthulir Organic Harvest | Premium Wood Pressed Oils & Spices</title>
                <meta name="description" content="Authentic wood-pressed oils, forest-fresh honey, and premium spices from the roots of Salem. Experience royal organic quality with Venthulir." />
                <link rel="canonical" href="https://venthulir.com/" />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "Venthulir Organic Harvest",
                      "url": "https://venthulir.com/",
                      "logo": "https://venthulir.com/logo.png",
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-8778476414",
                        "contactType": "Customer Service",
                        "areaServed": "IN",
                        "availableLanguage": "en"
                      },
                      "sameAs": [
                        "https://www.facebook.com/venthulir",
                        "https://www.instagram.com/venthulir"
                      ]
                    }
                    `}
                </script>
            </Helmet>

            <div className="leaf-overlay-container">
                {leaves.map(leaf => (
                    <svg
                        key={leaf.id}
                        className="v-royal-leaf"
                        viewBox="0 0 24 24"
                        style={{
                            left: leaf.left,
                            animationDelay: leaf.delay,
                            animationDuration: leaf.duration,
                            width: leaf.size,
                            height: leaf.size,
                            '--drift': leaf.drift,
                            '--start-rot': `${leaf.rotation}deg`
                        }}
                    >
                        <path
                            fill="currentColor"
                            d="M17,8C15,5.41 12,4 9,4C6,4 3,5.41 1,8C3,10.59 6,12 9,12C12,12 15,10.59 17,8Z"
                        />
                    </svg>
                ))}
            </div>

            <Hero />

            {/* MAIN PRODUCTS SECTION */}
            <ShopGrid title="Our Collection" isHomePage={true} id="products" />

            <Footer />
        </div>
    );
};

export default Home;