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
import VgaCategory from './pages/VgaCategory';
import CpuCategory from './pages/CpuCategory';
import GenericCategory from './pages/GenericCategory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
              <Route path="/category/vga" element={<VgaCategory />} />
              <Route path="/category/cpu" element={<CpuCategory />} />
              <Route path="/collection/:alias" element={<GenericCategory />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
