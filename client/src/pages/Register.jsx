import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import loginBg from '../assets/login_bg.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nisn: '',
        wa: '',
        alamat: '',
        sekolahAsal: '',
        departmentId: ''
    });
    const [departments, setDepartments] = useState([]);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/departments').then(res => setDepartments(res.data)).catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nisn' && value.length > 10) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.nisn.length !== 10) return alert('NISN harus 10 digit!');
        try {
            await register({
                ...formData,
                hp: formData.wa // Mapping to backend hp field used in Registration model
            });
            navigate('/verify-otp');
        } catch (err) {
            alert('Registration failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Left Side - Image (Fixed) */}
            <div style={{
                flex: '1.2',
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '45%',
                zIndex: 0,
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

                <div style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '90%' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Mulai Perjalanan<br />Pendidikan Anda
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                        Daftarkan diri Anda sekarang dan jadilah bagian dari civitas akademika kami.
                        Isi formulir dengan data yang valid.
                    </p>
                </div>
            </div>

            {/* Spacer for the fixed left side */}
            <div style={{ flex: '1.2', visibility: 'hidden', width: '45%' }}></div>

            {/* Right Side - Form (Scrollable) */}
            <div style={{
                flex: '1.5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
                padding: '3rem 2rem',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '700px' }}
                >
                    <div className="glass" style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Registrasi Siswa</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Silahkan lengkapi data diri Anda</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Nama Lengkap</label>
                                <input name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Nama Lengkap Sesuai Ijazah" style={{ padding: '0.8rem' }} />
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="nama@email.com" style={{ padding: '0.8rem' }} />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Password Akun" style={{ padding: '0.8rem' }} />
                            </div>

                            <div className="input-group">
                                <label>NISN (10 Digit)</label>
                                <input name="nisn" type="text" value={formData.nisn} onChange={handleChange} required placeholder="0012345678" style={{ padding: '0.8rem' }} />
                            </div>
                            <div className="input-group">
                                <label>No. WhatsApp</label>
                                <input name="wa" type="text" placeholder="08..." value={formData.wa} onChange={handleChange} required style={{ padding: '0.8rem' }} />
                            </div>

                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Alamat Lengkap</label>
                                <textarea name="alamat" rows="2" value={formData.alamat} onChange={handleChange} required placeholder="Jalan, RT/RW, Kecamatan, Kota/Kabupaten" style={{ padding: '0.8rem', resize: 'vertical' }} />
                            </div>

                            <div className="input-group">
                                <label>Sekolah Asal</label>
                                <input name="sekolahAsal" type="text" value={formData.sekolahAsal} onChange={handleChange} required placeholder="Nama SMP/Mts Asal" style={{ padding: '0.8rem' }} />
                            </div>
                            <div className="input-group">
                                <label>Pilihan Jurusan</label>
                                <select name="departmentId" value={formData.departmentId} onChange={handleChange} required style={{ padding: '0.8rem' }}>
                                    <option value="">Pilih Jurusan</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} (Sisa Kuota: {d.quota})</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', justifyContent: 'center', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                                Daftar & Kirim OTP
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Sudah punya akun? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/login')}>Login disini</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
