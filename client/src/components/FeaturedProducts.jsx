import React from 'react';
import ProductCard from './ProductCard';
import './ShopGrid.css';

const FeaturedProducts = () => {
    const featured = [
        { id: 101, name: "Venthulir Cold Pressed Sesame Oil", price: 580, category: "Premium Reserve", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop", badge: "Reserved", rating: 5.0 },
        { id: 102, name: "Majestic Raw White Honey", price: 650, category: "Limited Harvest", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop", badge: "Rare", rating: 4.9 },
        { id: 103, name: "Sovereign A2 Billona Ghee", price: 1200, category: "Ancient Recipe", image: "https://images.unsplash.com/photo-1596733430284-f7437f619829?q=80&w=800&auto=format&fit=crop", badge: "Artisanal", rating: 5.0 },
    ];

    return (
        <section className="py-24 bg-white border-b border-gray-50">
            <div className="at-container-max">
                <div className="text-center mb-20">
                    <span className="text-gold font-black text-xs uppercase tracking-[0.6em] mb-4 block">Registry Royale</span>
                    <h2 className="text-5xl font-black text-royal-green tracking-tight mb-8">The Royal Reserves</h2>
                    <div className="w-24 h-[3px] bg-royal-green mx-auto opacity-30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {featured.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex justify-center mt-24">
                    <button className="px-16 py-5 border-2 border-royal-green text-royal-green font-black text-xs tracking-[0.3em] uppercase hover:bg-royal-green hover:text-white transition-all rounded-sm">
                        Explore Full Library
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
