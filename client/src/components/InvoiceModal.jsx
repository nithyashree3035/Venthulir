import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Printer } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, orderData }) => {
    if (!orderData) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0a2e1f]/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[800px] bg-[#fdfdfd] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden origin-top"
                    >
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                        {/* Header Border (Golden Scallop) */}
                        <div className="h-2 bg-[radial-gradient(circle,var(--gold-500)_1px,transparent_0)] bg-[length:10px_10px]" />

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-16 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-[#1b4d3e] rounded-full flex items-center justify-center text-[#d4af37] font-black italic">V</div>
                                        <h2 className="text-2xl font-black italic font-serif text-[#1b4d3e]">VENTHULIR</h2>
                                    </div>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">Venthulir Organic Certification #VO7726</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <h1 className="text-4xl font-bold text-[#1b4d3e] mb-2 font-serif italic">Invoice</h1>
                                    <p className="text-sm font-bold text-gray-400">Transaction ID: {orderData.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-16">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#d4af37] mb-4">Registry Details</h4>
                                    <p className="text-sm font-bold text-[#1b4d3e] mb-1">{orderData?.customerName || orderData?.deliveryAddress?.fullName || 'Customer'}</p>
                                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                                        {orderData?.deliveryAddress?.address || 'Address'} <br />
                                        {orderData?.deliveryAddress?.city || 'City'}, {orderData?.deliveryAddress?.state || 'State'} {orderData?.deliveryAddress?.zipCode || ''}
                                    </p>
                                    <p className="text-sm text-gray-500 font-light font-bold mt-2">Ph: {orderData?.phone || 'Not Provided'}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#d4af37] mb-4">Financial Record</h4>
                                    <p className="text-sm font-bold text-[#1b4d3e] mb-1">Harvest Date: {new Date(orderData?.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm font-bold text-[#1b4d3e]">Payment Status: {orderData?.paymentMethod || 'Cash on Delivery'}</p>
                                    <p className="text-sm text-gray-500 font-light mt-1">Order Status: {orderData?.status}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto border-t-2 border-b-2 border-dashed border-gray-200 py-4 mb-8 md:mb-16">
                                <table className="w-full min-w-[500px]">
                                    <thead>
                                        <tr className="text-left text-[11px] uppercase tracking-widest text-[#1b4d3e] border-b border-gray-100 font-black">
                                            <th className="pb-4 pt-2">Harvested Selection</th>
                                            <th className="pb-4 pt-2 text-center">Variant</th>
                                            <th className="pb-4 pt-2 text-center">Qty</th>
                                            <th className="pb-4 pt-2 text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orderData.items.map((item, idx) => (
                                            <tr key={idx} className="text-sm">
                                                <td className="py-5 font-bold text-[#1b4d3e]">{item.name}</td>
                                                <td className="py-5 text-center text-gray-500">{item.variant || 'Standard'}</td>
                                                <td className="py-5 text-center text-gray-500">x{item.quantity || 1}</td>
                                                <td className="py-5 text-right font-black text-[#1b4d3e]">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end pt-4 border-[#1b4d3e]">
                                <div className="w-full md:w-64 space-y-3">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal:</span>
                                        <span>₹{(orderData?.originalAmount || orderData?.totalAmount || orderData?.total || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#B12704]">
                                        <span>Discount:</span>
                                        <span>- ₹{(orderData?.discountAmount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-[#1b4d3e] pt-4 border-t border-gray-200">
                                        <span>GRAND TOTAL:</span>
                                        <span>₹{(orderData?.totalAmount || orderData?.total || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 md:mt-20 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-2 text-[#2d6b4a]">
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-center md:text-left">100% Certified Sovereign Authentic</span>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button onClick={() => window.print()} className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 border border-gray-200 text-[#1b4d3e] font-bold text-xs tracking-widest uppercase hover:bg-gray-50 transition-all">
                                        <Printer size={16} /> Print
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Seal Accent */}
                        <div className="absolute top-1/2 right-12 transform -translate-y-1/2 opacity-10 rotate-12">
                            <div className="w-32 h-32 border-4 border-[#d4af37] rounded-full flex flex-col items-center justify-center p-2">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-[#d4af37]">Venthulir Reserves</span>
                                <div className="w-full h-px bg-[#d4af37] my-1" />
                                <span className="text-2xl font-serif font-black text-[#d4af37]">V</span>
                            </div>
                        </div>

                        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-black transition-colors"><X /></button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InvoiceModal;
