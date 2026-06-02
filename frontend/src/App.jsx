import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import BuildPC from './pages/BuildPC';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import VgaCategory from './pages/VgaCategory';
import CpuCategory from './pages/CpuCategory';
import MonitorCategory from './pages/MonitorCategory';
import GenericCategory from './pages/GenericCategory';
import BankAccount from './pages/BankAccount';
import WarrantyPolicy from './pages/WarrantyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsOfUse from './pages/TermsOfUse';
import PaymentMethods from './pages/PaymentMethods';
import Faq from './pages/Faq';
import PromotionInfo from './pages/PromotionInfo';
import PhoneLogin from './pages/PhoneLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './index.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/build-pc" element={<BuildPC />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/order-history/:id" element={<OrderDetail />} />
              <Route path="/category/vga" element={<VgaCategory />} />
              <Route path="/category/cpu" element={<CpuCategory />} />
              <Route path="/collection/man-hinh-may-tinh" element={<MonitorCategory />} />
              <Route path="/collection/:alias" element={<GenericCategory />} />
              <Route path="/bank-account" element={<BankAccount />} />
              <Route path="/warranty-policy" element={<WarrantyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/promotions" element={<PromotionInfo />} />
              <Route path="/phone-login" element={<PhoneLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Chatbot />
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
