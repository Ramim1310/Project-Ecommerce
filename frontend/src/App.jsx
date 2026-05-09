import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import LoginOtp from './pages/LoginOtp';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/productCatalog';
import ProductDetails from './pages/productDetails';
import Navbar from "./components/common/Navbar";
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
               
               <Route path="/" element={<Catalog />} />
               <Route path="/catalog" element={<Catalog />} />
               <Route path="/product/:id" element={<ProductDetails />} />

                {/* Auth routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/verify" element={<LoginOtp />} />

                {/* Protected */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 404 fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
