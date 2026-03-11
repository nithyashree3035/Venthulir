import React from 'react';
import { CheckCircle2, Circle, Truck, Package, ShoppingBag, MapPin } from 'lucide-react';

const OrderTracking = ({ status = 'Shipped', order = null }) => {
    const getDeliveryDate = () => {
        if (!order) return 'TBD';
        if (order.status === 'Delivered' && order.statusUpdatedAt) {
            return new Date(order.statusUpdatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        if (order.createdAt) {
            const target = new Date(order.createdAt);
            target.setDate(target.getDate() + 3); // 3 days for Salem delivery
            return target.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        return 'TBD';
    };

    const getHub = () => {
        if (order?.status === 'Delivered') return 'Delivered to Customer';
        if (order?.status === 'Cancelled') return 'Order Cancelled';
        return 'Salem Venthulir Reserve';
    };
    const steps = [
        { name: 'Ordered', icon: <ShoppingBag size={18} />, desc: 'Registry created and confirmed.' },
        { name: 'Shipped', icon: <Package size={18} />, desc: 'Harvest packaged at royal reserves.' },
        { name: 'On the Way', icon: <Truck size={18} />, desc: 'Venthulir transit in progress.' },
        { name: 'Delivered', icon: <CheckCircle2 size={18} />, desc: 'Authentic organic arrival.' }
    ];

    const currentStepIndex = steps.findIndex(s => s.name === status);

    return (
        <div className="bg-white p-4 md:p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative w-full">
            <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 relative z-10 w-full">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.name} className="flex-1 flex flex-row md:flex-col items-center md:items-center text-left md:text-center relative group w-full gap-4 md:gap-0">
                            {/* Connector Line (Desktop) */}
                            {index !== steps.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 top-6 w-full h-[2px] bg-gray-100 z-0">
                                    <div
                                        className="h-full bg-[#d4af37] transition-all duration-1000"
                                        style={{ width: index < currentStepIndex ? '100%' : '0%' }}
                                    />
                                </div>
                            )}

                            {/* Connector Line (Mobile) */}
                            {index !== steps.length - 1 && (
                                <div className="md:hidden absolute left-6 top-12 w-[2px] h-full bg-gray-100 z-0">
                                    <div
                                        className="w-full bg-[#d4af37] transition-all duration-1000"
                                        style={{ height: index < currentStepIndex ? '100%' : '0%' }}
                                    />
                                </div>
                            )}

                            {/* Icon Circle */}
                            <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center z-10 transition-all duration-500 shadow-lg border-2 
                                ${isCompleted || isCurrent ? 'bg-[#1b4d3e] border-[#d4af37] text-[#d4af37]' : 'bg-white border-gray-200 text-gray-300'}`}
                            >
                                {isCompleted ? <CheckCircle2 size={24} /> : step.icon}
                            </div>

                            {/* Content */}
                            <div className="md:mt-6 flex-1 py-1">
                                <h4 className={`text-[13px] md:text-sm font-black uppercase tracking-widest mb-1 
                                    ${isCurrent ? 'text-[#1b4d3e]' : (isCompleted ? 'text-[#d4af37]' : 'text-gray-400')}`}
                                >
                                    {step.name}
                                </h4>
                                <p className="text-[11px] md:text-xs text-gray-500 font-medium max-w-full md:max-w-[120px] leading-relaxed">
                                    {isCurrent ? <span className="text-[#1b4d3e] font-bold">Active:</span> : ''} {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#d4af37]" />
                    <span>Current Hub: {getHub()}</span>
                </div>
                <span>{order?.status === 'Delivered' ? 'Delivered On:' : 'Est. Delivery:'} {getDeliveryDate()}</span>
            </div>
        </div>
    );
};

export default OrderTracking;
