import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import LoginOtp from './pages/LoginOtp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './pages/admin/manageProduct';
import ManageOrders from './pages/admin/manageOrders';
import Catalog from './pages/productCatalog';
import ProductDetails from './pages/productDetails';
import Navbar from "./components/common/Navbar";
import CartDrawer from "./features/cart/cartSlider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import './index.css';

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <BrowserRouter>
            <Navbar onSearch={setSearchTerm} />
            <CartDrawer />
            <Routes>
               
               <Route path="/" element={<Catalog searchTerm={searchTerm} />} />
               <Route path="/catalog" element={<Catalog searchTerm={searchTerm} />} />
               <Route path="/product/:id" element={<ProductDetails />} />

                {/* Auth routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/verify" element={<LoginOtp />} />

                {/* Protected — regular users */}
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />

                {/* Protected — admin only */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/manage-products" element={
                    <ProtectedRoute role="ADMIN"><ManageProducts /></ProtectedRoute>
                } />
                <Route path="/admin/manage-orders" element={
                    <ProtectedRoute role="ADMIN"><ManageOrders /></ProtectedRoute>
                } />

                {/* 404 fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
