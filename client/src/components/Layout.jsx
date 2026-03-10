import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppNavigation } from '../context/NavigationContext';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import NotificationSystem from './NotificationSystem';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const { currentView } = useAppNavigation();

    const isHomePage = currentView === 'home' && location.pathname !== '/admin';
    const isStandaloneApp = location.pathname.startsWith('/admin') || currentView === 'profile' || currentView === 'auth';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (isStandaloneApp) {
        return (
            <div className="standalone-layout" style={{ minHeight: '100vh', background: '#f7f7f7' }}>
                {children}
                <ToastContainer position="bottom-right" theme="dark" />
                <NotificationSystem />
            </div>
        );
    }

    return (
        <div className={`App-root ${isHomePage ? 'home-layout' : 'standard-layout'}`}>
            {isHomePage && <Navbar />}

            <main className="main-content-stage">
                {children}
            </main>

            <ToastContainer position="bottom-right" theme="dark" />
            <NotificationSystem />
        </div>
    );
};


export default Layout;