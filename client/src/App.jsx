import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerify from './pages/OtpVerify';
import SiswaDashboard from './pages/SiswaDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';

const ProtectedRoute = ({ children, roles, needsVerification = true }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (user.role === 'siswa' && needsVerification && !user.isVerified) {
        return <Navigate to="/verify-otp" />;
    }

    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/verify-otp"
                        element={
                            <ProtectedRoute needsVerification={false}>
                                <OtpVerify />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/siswa"
                        element={
                            <ProtectedRoute roles={['siswa']}>
                                <SiswaDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/finance"
                        element={
                            <ProtectedRoute roles={['keuangan', 'admin']}>
                                <FinanceDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/committee"
                        element={
                            <ProtectedRoute roles={['panitia', 'admin']}>
                                <CommitteeDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
