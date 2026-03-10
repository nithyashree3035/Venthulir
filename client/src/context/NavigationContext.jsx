import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useAppNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('home');
    const [viewParams, setViewParams] = useState({});

    const appNavigate = (view, params = {}) => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setCurrentView(view);
        setViewParams(params);
    };

    return (
        <NavigationContext.Provider value={{ currentView, viewParams, appNavigate }}>
            {children}
        </NavigationContext.Provider>
    );
};
