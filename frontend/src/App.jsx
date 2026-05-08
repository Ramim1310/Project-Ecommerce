import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import LoginOtp from './pages/LoginOtp';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default → login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

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
