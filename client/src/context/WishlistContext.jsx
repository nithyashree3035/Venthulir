import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = localStorage.getItem('venthulir_wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    const toggleWishlist = (product) => {
        let newWishlist;
        const exists = wishlist.find(item => item.id === product.id);

        if (exists) {
            newWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
            newWishlist = [...wishlist, product];
        }

        setWishlist(newWishlist);
        localStorage.setItem('venthulir_wishlist', JSON.stringify(newWishlist));

        if (window.addOrganicNotification) {
            const msg = exists
                ? `Removed ${product.name} from Wishlist`
                : `Added ${product.name} to Wishlist`;
            window.addOrganicNotification(msg, 'wishlist');
        }

        return !exists;
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
