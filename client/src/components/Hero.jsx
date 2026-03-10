import React from 'react';
import MotionLayer from './MotionLayer';
import './Hero.css';

const Hero = () => {
    return (
        <section className="at-hero-v4">
            <MotionLayer />
            {/* Wording removed as requested */}
            <div className="home-content-overlay"></div>
        </section>
    );
};

export default Hero;