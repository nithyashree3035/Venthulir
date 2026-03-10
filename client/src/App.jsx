import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import CustomerApp from './pages/CustomerApp';
import { NavigationProvider } from './context/NavigationContext';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <NavigationProvider>
                <Layout>
                  <Routes>
                    {/* Customer app only — no admin route here */}
                    <Route path="/*" element={<CustomerApp />} />
                  </Routes>
                </Layout>
              </NavigationProvider>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;