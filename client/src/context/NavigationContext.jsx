import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useAppNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('home');
    const [viewParams, setViewParams] = useState({});

    const appNavigate = (view, params = {}, pushState = true) => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setCurrentView(view);
        setViewParams(params);
        if (pushState) {
            window.history.pushState({ view, params }, '', '');
        }
    };

    React.useEffect(() => {
        // Initial state
        if (!window.history.state) {
            window.history.replaceState({ view: 'home', params: {} }, '', '');
        }

        const handlePopState = (event) => {
            if (event.state && event.state.view) {
                appNavigate(event.state.view, event.state.params, false);
            } else {
                appNavigate('home', {}, false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <NavigationContext.Provider value={{ currentView, viewParams, appNavigate }}>
            {children}
        </NavigationContext.Provider>
    );
};
