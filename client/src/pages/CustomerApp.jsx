import React, { Suspense } from 'react';
import Home from './Home';
const ProductDetailPage = React.lazy(() => import('./ProductDetailPage'));
const CartPage = React.lazy(() => import('./CartPage'));
const CheckoutPage = React.lazy(() => import('./CheckoutPage'));
const CustomerPage = React.lazy(() => import('./CustomerPage'));
const WishlistPage = React.lazy(() => import('./WishlistPage'));
const EntryAuthPage = React.lazy(() => import('./EntryAuthPage'));
const ShopGrid = React.lazy(() => import('../components/ShopGrid'));
const JournalPage = React.lazy(() => import('./JournalPage'));
import { useAppNavigation } from '../context/NavigationContext';
import { Helmet } from 'react-helmet-async';

const CustomerApp = () => {
    const { currentView, viewParams } = useAppNavigation();

    let content = null;
    switch (currentView) {
        case 'home':
            content = <Home />;
            break;
        case 'product':
            content = <ProductDetailPage id={viewParams.id} />;
            break;
        case 'cart':
            content = <CartPage />;
            break;
        case 'auth':
            content = <EntryAuthPage redirectView={viewParams.redirectView} redirectParams={viewParams.redirectParams} />;
            break;
        case 'checkout':
            content = <CheckoutPage viewParams={viewParams} />;
            break;
        case 'profile':
            content = <CustomerPage />;
            break;
        case 'wishlist':
            content = <WishlistPage />;
            break;
        case 'all-products':
            content = (
                <div className="full-page-wrap" style={{ padding: '0 20px', background: '#ffffff', minHeight: '100vh', paddingTop: '10px' }}>
                    <ShopGrid isHomePage={false} title="Our Full Collection" />
                </div>
            );
            break;
        case 'journal':
            content = <JournalPage post={viewParams.post} />;
            break;
        case 'new-arrivals':
            content = (
                <div className="full-page-wrap" style={{ padding: '0 20px', background: '#ffffff', minHeight: '100vh', paddingTop: '10px' }}>
                    <ShopGrid isHomePage={false} title="New Arrivals" badge="New Arrival" />
                </div>
            );
            break;
        default:
            content = <Home />;
    }

    const noIndexViews = ['cart', 'auth', 'checkout', 'profile', 'wishlist'];
    const shouldNoIndex = noIndexViews.includes(currentView);

    return (
        <React.Fragment>
            {shouldNoIndex && (
                <Helmet>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
            )}
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
                {content}
            </Suspense>
        </React.Fragment>
    );
};

export default CustomerApp;
