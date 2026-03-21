import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, clearCart } = useCart();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return toast.info("Your cart is empty!");

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                pending: '👑 Initializing Venthulir Secure Checkout...',
                success: '🚀 Redirecting to Razorpay Secure Payment...',
                error: '❌ Checkout portal synchronization failed.'
            }
        ).then(() => {
            alert("👑 Venthulir Royal Checkout System:\n\nIn a live production environment, this would now open the Razorpay Gateway for ₹" + subtotal + ".\n\nRequired Verification Flow:\n1. Server-side order_id created\n2. Signature verification on success\n3. PDF Invoice generation");
            clearCart();
            onClose();
        });
    };

    if (!isOpen) return null;

    return (
        <React.Fragment>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] fade-in"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Side Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[2001] shadow-2xl flex flex-col slide-in-right"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: '#fff',
                    zIndex: 2001,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping Cart Drawer"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#1b4d3e] text-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag />
                        <h2 className="text-xl font-black italic font-serif">Venthulir Registry</h2>
                    </div>
                    <button type="button" aria-label="Close cart menu" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                            <ShoppingBag size={64} className="text-[#1b4d3e]" />
                            <p className="text-lg font-bold">Your registry is empty.</p>
                            <button type="button" onClick={onClose} className="text-[#d4af37] font-bold underline">Begin Harvest Selection</button>
                        </div>
                    ) : (
                        cart.map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img 
                                        src={(item.images && item.images[0]) || item.imageUrl || item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-contain bg-white"
                                        loading="lazy"
                                        width="80"
                                        height="80"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="font-bold text-[#1b4d3e] line-clamp-1">{item.name}</h4>
                                            {item.selectedVariant && (
                                                <span className="text-[10px] bg-[#f0f9f4] text-[#1b4d3e] px-2 py-0.5 rounded font-black uppercase tracking-widest">{item.selectedVariant}</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${item.name} from cart`}
                                            onClick={() => removeFromCart(item._id || item.id, item.selectedVariant)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        ><Trash2 size={16} /></button>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.category}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm font-bold text-gray-600">₹{item.price} × {item.quantity}</p>
                                        <p className="text-lg font-black text-[#1b4d3e]">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Venthulir Subtotal</span>
                        <span className="text-3xl font-black text-[#1b4d3e]">₹{subtotal}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 italic">Shipping and royal duties calculated at secure checkout. 100% Organic certified delivery.</p>
                    <button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full py-5 bg-[#1b4d3e] text-[#d4af37] font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-[#0a2e1f] transition-all shadow-xl active:scale-[0.98]"
                    >
                        SECURE ROYAL CHECKOUT <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            <style>{`
                .fade-in { animation: fadeIn 0.3s forwards; }
                .slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </React.Fragment>
    );
};

export default CartDrawer;
