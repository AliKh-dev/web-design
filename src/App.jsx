import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsSection from './components/ProductsSection';
import ProductsPage from './components/ProductsPage';
import SingleProductPage from './components/SingleProductPage';
import ShoppingCartPage from './components/ShoppingCartPage';
import AdminAddProductPage from './components/AdminAddProductPage';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Home page component
const HomePage = () => (
  <>
    <Hero />
    <ProductsSection />
    <AboutSection />
    <FeaturesSection />
    <ContactSection />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/admin/add-product" element={<AdminAddProductPage />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 