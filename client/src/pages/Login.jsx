import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import loginBg from '../assets/login_bg.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'keuangan') navigate('/finance');
            else if (user.role === 'panitia') navigate('/committee');
            else navigate('/siswa');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Left Side - Image */}
            <div style={{
                flex: '1.5',
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '4rem'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(2, 132, 199, 0.8), rgba(15, 23, 42, 0.4))'
                }} />

                <div style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '80%' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Selamat Datang<br />Calon Murid
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                        Mari bergabung dengan sekolah SAJUTA (Santun Jujur Taat). Silahkan masuk untuk melengkapi data
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
                padding: '2rem',
                minWidth: '400px'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '450px' }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        color: 'white'
                    }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Login</h2>
                            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Masuk ke akun pendaftaran Anda</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label style={{ color: 'white' }}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="nama@email.com"
                                    style={{ padding: '1rem', background: 'white', color: '#1e293b', border: 'none' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ color: 'white' }}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{ padding: '1rem', background: 'white', color: '#1e293b', border: 'none' }}
                                />
                            </div>
                            <button type="submit" className="btn" style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '1rem',
                                marginTop: '1rem',
                                fontSize: '1.1rem',
                                background: 'white',
                                color: '#0284c7',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                Masuk
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
                            Belum punya akun? <span style={{ color: 'white', cursor: 'pointer', fontWeight: '600', marginLeft: '0.5rem', textDecoration: 'underline' }} onClick={() => navigate('/register')}>Daftar sekarang</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
