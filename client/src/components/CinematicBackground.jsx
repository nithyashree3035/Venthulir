import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import './CinematicBackground.css';

const CinematicBackground = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
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
                <source src="https://videos.pexels.com/video-files/3843516/3843516-hd_1920_1080_25fps.mp4" type="video/mp4" />
                <source src="/videos/nature.mp4" type="video/mp4" />
            </video>

            <div className="video-overlay-tint"></div>
            <div className="video-overlay-gradient"></div>

            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="feature-leaf"
                    style={{
                        position: 'absolute',
                        left: `${leaf.x}vw`,
                        top: '-10vh',
                        opacity: 0,
                        animation: `fallAndDrift ${leaf.duration}s linear infinite`,
                        animationDelay: `${leaf.delay}s`,
                        transform: `scale(${leaf.scale}) rotate(${leaf.rotation}deg)`
                    }}
                >
                    <Leaf size={24} strokeWidth={1.5} />
                </div>
            ))}
            <style>{`
                @keyframes fallAndDrift {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.9; }
                    90% { opacity: 0.9; }
                    100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default CinematicBackground;
