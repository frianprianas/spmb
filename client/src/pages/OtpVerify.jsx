import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import axios from 'axios';
import loginBg from '../assets/login_bg.jpg';

const OtpVerify = () => {
    const [otp, setOtp] = useState('');
    const { user, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOtp(user.email, otp);
            alert('Verifikasi berhasil!');
            navigate('/siswa');
        } catch (err) {
            alert('Gagal verifikasi: ' + (err.response?.data?.message || err.message));
        }
    };

    if (!user) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem', color: 'white' }}>Silakan login kembali.</div>;

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
                    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.4), var(--bg))'
                }} />

                <div style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '80%' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Keamanan &<br />Verifikasi
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                        Langkah terakhir untuk mengamankan akun pendaftaran Anda.
                        Pastikan data yang Anda masukkan sudah benar.
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
                padding: '2rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '450px' }}
                >
                    <div className="glass" style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Verifikasi OTP</h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Masukkan 6 digit kode yang dikirim ke nomor WhatsApp Anda: <br />
                                <span style={{ color: 'white', fontWeight: '600' }}>{user.wa || user.email}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label style={{ textAlign: 'center', width: '100%', display: 'block' }}>Kode OTP</label>
                                <input
                                    type="text"
                                    placeholder="0 0 0 0 0 0"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '2rem',
                                        letterSpacing: '0.8rem',
                                        padding: '1rem',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                                Verifikasi Akun
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Belum menerima kode?
                                <span
                                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', marginLeft: '0.5rem' }}
                                    onClick={async () => {
                                        if (confirm('Kirim ulang kode OTP?')) {
                                            try {
                                                await axios.post('http://localhost:5000/api/auth/resend-otp', { email: user.email });
                                                alert('Kode OTP baru telah dikirim ke WhatsApp Anda.');
                                            } catch (err) {
                                                alert('Gagal kirim ulang: ' + (err.response?.data?.message || err.message));
                                            }
                                        }
                                    }}
                                >
                                    Kirim Ulang
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OtpVerify;
