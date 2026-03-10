import React, { useState, useEffect } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { categories } from '../utils/products';
import { api } from '../services/api';
import './ShopGrid.css';

const ShopGrid = ({ isHomePage = false, id = "products", badge = "", title = "" }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dbProducts, setDbProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { appNavigate } = useAppNavigation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let endpoint = `/products?page=${page}&limit=${isHomePage ? 4 : 12}`;
                if (activeCategory !== 'All') endpoint += `&category=${activeCategory}`;
                if (searchTerm) endpoint += `&search=${searchTerm}`;
                if (badge) endpoint += `&badge=${encodeURIComponent(badge)}`;

                const data = await api.get(endpoint);
                setDbProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchProducts, isHomePage ? 0 : 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [activeCategory, searchTerm, page, isHomePage, badge]);

    // Reset pagination on filter change
    useEffect(() => {
        setPage(1);
    }, [activeCategory, searchTerm]);

    const displayProducts = dbProducts;

    return (
        <section id={id} className="unified-shop-section">
            <div className="at-container-max">
                {!isHomePage && (
                    <button onClick={() => appNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 'bold', color: '#0b2e1f', padding: '0 0 20px 0' }}>
                        <ArrowLeft size={18} /> BACK TO HOME
                    </button>
                )}
                {title && <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0b3d2e', marginBottom: '30px', fontFamily: 'serif' }}>{title}</h2>}
                <div className="shop-header-controls">
                    <div className="category-scroll-v3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`cat-pill-v3 ${activeCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="filter-line" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '5px 15px', borderRadius: '50px', border: '1.5px solid #eee' }}>
                        <SlidersHorizontal size={14} color="#0b2e1f" />
                        <input
                            type="text"
                            placeholder="Search your harvest..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '13px', fontWeight: 'bold', color: '#0b2e1f', width: '180px', background: 'transparent' }}
                        />
                    </div>
                </div>

                <div className="compact-grid-v3" style={{ opacity: loading ? 0.6 : 1, transition: '0.3s opacity' }}>
                    {displayProducts.map(product => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                    {displayProducts.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px', color: 'var(--text-muted)' }}>
                            No products available yet.
                        </div>
                    )}
                </div>

                {!isHomePage && totalPages > 1 && (
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #0b2e1f', background: page === 1 ? '#eee' : '#fff', cursor: page === 1 ? 'default' : 'pointer' }}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    background: page === i + 1 ? '#0b2e1f' : '#fff',
                                    color: page === i + 1 ? '#fff' : '#0b2e1f',
                                    border: '1px solid #0b2e1f', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #0b2e1f', background: page === totalPages ? '#eee' : '#fff', cursor: page === totalPages ? 'default' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {isHomePage && (
                    <div className="load-more-container" style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button
                            className="at-load-more-btn"
                            onClick={() => {
                                window.scrollTo(0, 0);
                                appNavigate('all-products');
                            }}
                        >
                            LOAD MORE
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};


export default ShopGrid;