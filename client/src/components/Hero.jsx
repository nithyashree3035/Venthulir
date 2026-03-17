import React, { useState } from 'react';
import MotionLayer from './MotionLayer';
import './Hero.css';

const Hero = () => {
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
        <section className="at-hero-v4">
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
            <MotionLayer />
            {/* Wording removed as requested */}
            <div className="home-content-overlay"></div>
        </section>
    );
};

export default Hero;