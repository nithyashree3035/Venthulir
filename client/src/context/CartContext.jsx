import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('venthulir_cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Ensure each item has quantity property
                const cleanedCart = parsedCart.map(item => ({
                    ...item,
                    quantity: item.quantity || 1
                }));
                setCart(cleanedCart);
            } catch (e) {
                localStorage.removeItem('venthulir_cart');
                setCart([]);
            }
        }
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('venthulir_cart', JSON.stringify(newCart));
    };

    // Add to cart or update quantity
    const addToCart = (product, qty = 1) => {
        const variantSuffix = product.selectedVariant ? `-${product.selectedVariant}` : '';
        const uniqueId = `${product._id || product.id}${variantSuffix}`;

        const existingItem = cart.find(item => {
            const itemVariantSuffix = item.selectedVariant ? `-${item.selectedVariant}` : '';
            const itemId = `${item._id || item.id}${itemVariantSuffix}`;
            return itemId === uniqueId;
        });

        let newCart;
        let notificationMsg;

        if (existingItem) {
            newCart = cart.map(item => {
                const itemVariantSuffix = item.selectedVariant ? `-${item.selectedVariant}` : '';
                const itemId = `${item._id || item.id}${itemVariantSuffix}`;
                return itemId === uniqueId ? { ...item, quantity: item.quantity + qty } : item;
            });
            notificationMsg = `Updated quantity for ${product.name}`;
        } else {
            newCart = [...cart, { ...product, quantity: qty }];
            notificationMsg = `Added ${qty} x ${product.name} to Cart`;
        }

        saveCart(newCart);
        if (window.addOrganicNotification) {
            window.addOrganicNotification(notificationMsg, 'cart');
        }
    };

    const toggleCart = (product) => {
        const variantSuffix = product.selectedVariant ? `-${product.selectedVariant}` : '';
        const uniqueId = `${product._id || product.id}${variantSuffix}`;

        const existingItem = cart.find(item => {
            const itemVariantSuffix = item.selectedVariant ? `-${item.selectedVariant}` : '';
            const itemId = `${item._id || item.id}${itemVariantSuffix}`;
            return itemId === uniqueId;
        });

        if (existingItem) {
            const newCart = cart.filter(item => {
                const itemVariantSuffix = item.selectedVariant ? `-${item.selectedVariant}` : '';
                const itemId = `${item._id || item.id}${itemVariantSuffix}`;
                return itemId !== uniqueId;
            });
            saveCart(newCart);
            if (window.addOrganicNotification) {
                window.addOrganicNotification(`Removed ${product.name} from Cart`, 'cart');
            }
        } else {
            addToCart(product, 1);
        }
    };

    // Increment quantity
    const incrementQuantity = (productId, variantLabel) => {
        const uniqueSearchId = `${productId}${variantLabel ? `-${variantLabel}` : ''}`;
        const newCart = cart.map(item => {
            const itemUniqueId = `${item._id || item.id}${item.selectedVariant ? `-${item.selectedVariant}` : ''}`;
            return itemUniqueId === uniqueSearchId
                ? { ...item, quantity: item.quantity + 1 }
                : item;
        });
        saveCart(newCart);
    };

    // Decrement quantity
    const decrementQuantity = (productId, variantLabel) => {
        const uniqueSearchId = `${productId}${variantLabel ? `-${variantLabel}` : ''}`;
        const existingItem = cart.find(item => {
            const itemUniqueId = `${item._id || item.id}${item.selectedVariant ? `-${item.selectedVariant}` : ''}`;
            return itemUniqueId === uniqueSearchId;
        });

        if (!existingItem) return;

        let newCart;
        if (existingItem.quantity === 1) {
            newCart = cart.filter(item => {
                const itemUniqueId = `${item._id || item.id}${item.selectedVariant ? `-${item.selectedVariant}` : ''}`;
                return itemUniqueId !== uniqueSearchId;
            });
        } else {
            newCart = cart.map(item => {
                const itemUniqueId = `${item._id || item.id}${item.selectedVariant ? `-${item.selectedVariant}` : ''}`;
                return itemUniqueId === uniqueSearchId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item;
            });
        }
        saveCart(newCart);
    };

    // Remove item completely
    const removeFromCart = (productId, variantLabel) => {
        const uniqueSearchId = `${productId}${variantLabel ? `-${variantLabel}` : ''}`;
        const item = cart.find(i => {
            const itemId = `${i._id || i.id}${i.selectedVariant ? `-${i.selectedVariant}` : ''}`;
            return itemId === uniqueSearchId;
        });

        const newCart = cart.filter(i => {
            const itemId = `${i._id || i.id}${i.selectedVariant ? `-${i.selectedVariant}` : ''}`;
            return itemId !== uniqueSearchId;
        });

        saveCart(newCart);

        if (window.addOrganicNotification && item) {
            window.addOrganicNotification(`Removed ${item.name} from Cart`, 'cart');
        }
    };

    // Clear entire cart
    const clearCart = () => {
        saveCart([]);
        if (window.addOrganicNotification) {
            window.addOrganicNotification('Cart cleared', 'cart');
        }
    };

    // Check if product (+ specific variant) is in cart
    const isInCart = (productId, variantLabel) => {
        const uniqueSearchId = `${productId}${variantLabel ? `-${variantLabel}` : ''}`;
        return cart.some(item => {
            const itemUniqueId = `${item._id || item.id}${item.selectedVariant ? `-${item.selectedVariant}` : ''}`;
            return itemUniqueId === uniqueSearchId;
        });
    };

    // Get total items count
    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Get total shipping cost by summing the highest shipping charge
    const getTotalShipping = () => {
        let maxShipping = 0;
        cart.forEach(item => {
            const charge = item.shippingCharge || 0;
            if (charge > maxShipping) maxShipping = charge;
        });
        return maxShipping;
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            toggleCart,
            incrementQuantity,
            decrementQuantity,
            removeFromCart,
            clearCart,
            isInCart,
            getTotalItems,
            getTotalPrice,
            getTotalShipping
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
