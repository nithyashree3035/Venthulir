import React from 'react';
import Home from './Home';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import CustomerPage from './CustomerPage';
import WishlistPage from './WishlistPage';
import EntryAuthPage from './EntryAuthPage';
import ShopGrid from '../components/ShopGrid';
import JournalPage from './JournalPage';
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
            {content}
        </React.Fragment>
    );
};

export default CustomerApp;
