import React from 'react';
import { CheckCircle2, Circle, Truck, Package, ShoppingBag, MapPin } from 'lucide-react';

const OrderTracking = ({ status = 'Shipped' }) => {
    const steps = [
        { name: 'Ordered', icon: <ShoppingBag size={18} />, desc: 'Registry created and confirmed.' },
        { name: 'Shipped', icon: <Package size={18} />, desc: 'Harvest packaged at royal reserves.' },
        { name: 'On the Way', icon: <Truck size={18} />, desc: 'Venthulir transit in progress.' },
        { name: 'Delivered', icon: <CheckCircle2 size={18} />, desc: 'Authentic organic arrival.' }
    ];

    const currentStepIndex = steps.findIndex(s => s.name === status);

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
            {/* Background Vine Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="var(--royal-green-800)">
                    <path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.name} className="flex-1 flex flex-col items-center text-center relative group">
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 top-6 w-full h-[2px] bg-gray-100 z-0">
                                    <div
                                        className="h-full bg-[#d4af37] transition-all duration-1000"
                                        style={{ width: index < currentStepIndex ? '100%' : '0%' }}
                                    />
                                </div>
                            )}

                            {/* Icon Circle */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-lg border-2 
                                ${isCompleted || isCurrent ? 'bg-[#1b4d3e] border-[#d4af37] text-[#d4af37] scale-110' : 'bg-white border-gray-200 text-gray-300'}`}
                            >
                                {isCompleted ? <CheckCircle2 size={24} /> : step.icon}
                            </div>

                            {/* Content */}
                            <div className="mt-6">
                                <h4 className={`text-sm font-black uppercase tracking-widest mb-1 
                                    ${isCurrent ? 'text-[#1b4d3e]' : (isCompleted ? 'text-[#d4af37]' : 'text-gray-400')}`}
                                >
                                    {step.name}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium max-w-[120px] leading-relaxed">
                                    {isCurrent ? <span className="text-[#1b4d3e] font-bold">Active:</span> : ''} {step.desc}
                                </p>
                            </div>

                            {/* Pulse for Current Step */}
                            {isCurrent && (
                                <div className="absolute top-0 w-12 h-12 rounded-full bg-[#d4af37]/20 animate-ping z-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#d4af37]" />
                    <span>Current Hub: Bengaluru Venthulir Reserve</span>
                </div>
                <span>Est. Delivery: 24 Oct 2026</span>
            </div>
        </div>
    );
};

export default OrderTracking;
