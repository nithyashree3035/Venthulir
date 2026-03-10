import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import './CinematicBackground.css';

const CinematicBackground = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        // Keep the falling leaves animation
        setLeaves(Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 10 + Math.random() * 10,
            scale: 0.5 + Math.random() * 0.7,
            rotation: Math.random() * 360
        })));
    }, []);

    return (
        <div className="at-nature-scene">
            <video
                className="nature-video"
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format"
            >
                {/* Primary: Direct Remote Link (Pexels) */}
                <source src="https://videos.pexels.com/video-files/3843516/3843516-hd_1920_1080_25fps.mp4" type="video/mp4" />
                {/* Secondary: Local Fallback */}
                <source src="/videos/nature.mp4" type="video/mp4" />
            </video>

            {/* Overlays */}
            <div className="video-overlay-tint"></div>
            <div className="video-overlay-gradient"></div>

            {/* Particles */}
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className="feature-leaf"
                    initial={{ x: `${leaf.x}vw`, y: '-10vh', opacity: 0, rotate: 0 }}
                    animate={{
                        y: '110vh',
                        x: [`${leaf.x}vw`, `${leaf.x + 10}vw`, `${leaf.x - 10}vw`],
                        rotate: 360,
                        opacity: [0, 0.9, 0.9, 0]
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: "linear"
                    }}
                >
                    <Leaf size={24} strokeWidth={1.5} />
                </motion.div>
            ))}
        </div>
    );
};

export default CinematicBackground;
