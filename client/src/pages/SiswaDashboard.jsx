import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, CreditCard, User, FileText, Info, Save, ClipboardList, Download, Printer, ArrowRight, ArrowLeft, Lock, X, QrCode } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../context/AuthContext';

const SiswaDashboard = () => {
    const { changePassword } = useAuth();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showMessages, setShowMessages] = useState(false);

    const fetchRegistration = async () => {
        try {
            const res = await axios.get('/api/student/me');
            setRegistration(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistration();
    }, []);

    if (loading) return <div className="container">Loading dashboard...</div>;

    let currentStage = 2;
    if (!registration.kkUrl || !registration.akteUrl) {
        currentStage = 2;
    } else if (registration.paymentStatus !== 'verified') {
        currentStage = 3;
    } else if (!registration.isCompleted) {
        currentStage = 4;
    } else {
        currentStage = 5;
    }

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <h1 className="section-title">Dashboard Siswa</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                {/* Sidebar Steps */}
                <div className="glass no-print" style={{ padding: '2rem', alignSelf: 'start', position: 'sticky', top: '100px' }}>
                    <StepItem done={true} number={1} text="Registrasi & Bio" />
                    <StepItem active={currentStage === 2} done={currentStage > 2} number={2} text="Upload Dokumen" />
                    <StepItem active={currentStage === 3} done={currentStage > 3} number={3} text="Pembayaran" />
                    <StepItem active={currentStage === 4} done={currentStage > 4} number={4} text="Formulir Lengkap" />
                    <StepItem active={currentStage === 5} done={currentStage > 5} number={5} text="Selesai" />

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <button
                            onClick={() => setShowMessages(true)}
                            className="btn"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                background: 'transparent',
                                color: 'var(--text-foreground)',
                                padding: '0.5rem',
                                border: '1px solid var(--border)',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <User size={16} style={{ marginRight: '0.5rem' }} /> Pesan / Notifikasi
                        </button>

                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="btn"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                background: 'transparent',
                                color: 'var(--text-foreground)',
                                padding: '0.5rem',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <Lock size={16} style={{ marginRight: '0.5rem' }} /> Ganti Password
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="glass" style={{ padding: '3rem' }}>
                    <AnimatePresence mode="wait">
                        {currentStage === 2 && (
                            <UploadDocuments key="s2" onDone={fetchRegistration} />
                        )}

                        {currentStage === 3 && (
                            <PaymentSection key="s3" registration={registration} onDone={fetchRegistration} />
                        )}

                        {currentStage === 4 && (
                            <ComprehensiveForm key="s4" registration={registration} onDone={fetchRegistration} />
                        )}

                        {currentStage === 5 && (
                            <FinalStatusSection key="s5" registration={registration} />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Messages Modal */}
            {
                showMessages && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '1rem',
                                maxWidth: '600px', width: '100%', position: 'relative',
                                maxHeight: '80vh', overflowY: 'auto'
                            }}
                        >
                            <button
                                onClick={() => setShowMessages(false)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Pesan & Notifikasi</h2>

                            <MessagesModalContent />
                        </motion.div>
                    </div>
                )
            }

            {/* Change Password Modal */}
            {
                showChangePassword && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '1rem',
                                maxWidth: '400px', width: '100%', position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowChangePassword(false)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Ganti Password</h2>

                            <ChangePasswordForm
                                onClose={() => setShowChangePassword(false)}
                                changePassword={changePassword}
                            />
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

const ChangePasswordForm = ({ onClose, changePassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Konfirmasi password baru tidak cocok!');
            return;
        }
        if (newPassword.length < 6) {
            alert('Password baru minimal 6 karakter');
            return;
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            alert('Password berhasil diubah!');
            onClose();
        } catch (err) {
            alert('Gagal mengubah password: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Password Lama</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label>Password Baru</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimal 6 karakter"
                />
            </div>
            <div className="input-group">
                <label>Konfirmasi Password Baru</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Memproses...' : 'Simpan Password Baru'}
            </button>
        </form>
    );
};

const StepItem = ({ number, text, active, done }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: active || done ? 1 : 0.5 }}>
        <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: done ? '#10b981' : (active ? 'var(--primary)' : 'var(--glass)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
        }}>
            {done ? <Check size={16} color="white" /> : number}
        </div>
        <span style={{ fontWeight: active ? 'bold' : 'normal', fontSize: '0.9rem' }}>{text}</span>
    </div>
);

const UploadDocuments = ({ onDone }) => {
    const [kk, setKk] = useState(null);
    const [akte, setAkte] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!kk || !akte) return alert('Pilih kedua file!');
        setLoading(true);
        const formData = new FormData();
        formData.append('kk', kk);
        formData.append('akte', akte);
        try {
            await axios.post('/api/student/upload-docs', formData);
            onDone();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Tahap 2: Unggah Dokumen</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Unggah Kartu Keluarga dan Akte Kelahiran (Format: JPG, PNG, atau PDF).</p>
            <form onSubmit={handleUpload}>
                <div className="input-group">
                    <label>Kartu Keluarga (KK)</label>
                    <input type="file" onChange={(e) => setKk(e.target.files[0])} />
                </div>
                <div className="input-group">
                    <label>Akte Kelahiran</label>
                    <input type="file" onChange={(e) => setAkte(e.target.files[0])} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    <Upload size={18} /> {loading ? 'Mengunggah...' : 'Upload Dokumen'}
                </button>
            </form>
        </motion.div>
    );
};

const PaymentSection = ({ registration, onDone }) => {
    const [file, setFile] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const status = registration.paymentStatus;
    const proof = registration.paymentProofUrl;

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Pilih bukti pembayaran!');
        if (!amount || parseInt(amount) < 300000) return alert('Minimal transfer adalah Rp 300.000 untuk melanjutkan proses pendaftaran.');

        setLoading(true);
        const formData = new FormData();
        formData.append('payment', file);
        formData.append('paymentAmount', amount);

        try {
            await axios.post('/api/student/upload-payment', formData);
            onDone();
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2>Tahap 3: Pembayaran</h2>

            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{
                    padding: '3rem 1.5rem',
                    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/assets/header-investasi.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>INVESTASI PENDIDIKAN</h3>
                </div>
                <div style={{ padding: '0.8rem 1.2rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Formulir Pendaftaran</span>
                        <span style={{ fontWeight: 600 }}>Rp 300.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Dana Sumbangan Pendidikan (DSP)</span>
                        <span style={{ fontWeight: 600 }}>Rp 3.775.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Paket Seragam Sekolah</span>
                        <span style={{ fontWeight: 600 }}>Rp 800.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>IPP / SPP Bulan Pertama</span>
                        <span style={{ fontWeight: 600 }}>Rp 350.000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed #e5e7eb', marginBottom: '0.5rem' }}>
                        <span>Kegiatan MPLS / MOPD</span>
                        <span style={{ fontWeight: 600 }}>Rp 275.000</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Biaya</span>
                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>Rp 5.500.000</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={20} /> Transfer Bank
                    </h3>
                    <p style={{ marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Bank Mandiri</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '1px' }}>1310001611666</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>A/N Yayasan Pendidikan Dasar dan Menengah Bakti Nusantara</p>
                </div>

                <div style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <QrCode size={20} /> Scan QRIS
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #eee', width: 'fit-content' }}>
                            <img src="/qris.png" alt="QRIS" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>YWA BAKTI NUSANTARA</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>NMID: ID1024340461861</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Support: GoPay, OVO, DANA, ShopeePay, dll.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: '#dbeafe', color: '#1e40af', padding: '1rem', borderRadius: '0.5rem', margin: '1.5rem 0' }}>
                <Info size={20} style={{ float: 'left', marginRight: '0.5rem' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>Minimal Pembayaran: Rp 300.000</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Anda sudah bisa melanjutkan ke tahap pengisian formulir setelah membayar minimal biaya registrasi formulir.</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>Status Pembayaran: <span className={`badge badge-${status}`}>{status.toUpperCase()}</span></h3>

                {status === 'verified' ? (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                            <p style={{ color: '#10b981', fontWeight: 600 }}>Pembayaran Diverifikasi!</p>
                            <p style={{ marginBottom: '0.5rem' }}>Nominal: Rp {parseInt(registration.paymentAmount || 0).toLocaleString()}</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Silakan lanjut melengkapi Formulir Pendaftaran resmi sekolah untuk mendapatkan Nomor Formulir.</p>
                        </div>
                        <button onClick={() => onDone()} className="btn btn-primary">Lanjut Isi Formulir Pendaftaran</button>
                    </div>
                ) : status === 'pending' && proof ? (
                    <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--glass)', borderRadius: '1rem', textAlign: 'center' }}>
                        <Info size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Menunggu Verifikasi</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Bukti pembayaran Anda sebesar <b>Rp {parseInt(registration.paymentAmount || 0).toLocaleString()}</b> telah diterima dan sedang diproses.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Admin akan memverifikasi dalam waktu 1x24 jam.</p>
                    </div>
                ) : (
                    <form onSubmit={handleUpload} style={{ marginTop: '1.5rem' }}>
                        {status === 'rejected' && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Bukti sebelumnya ditolak. Silakan upload ulang.</p>}

                        <div className="input-group">
                            <label>Jumlah yang Ditransfer (Minimal Rp 300.000)</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ padding: '0.8rem', background: '#eee', color: '#333', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '0.5rem 0 0 0.5rem' }}>Rp</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Upload Bukti Pembayaran</label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            <CreditCard size={18} /> {loading ? 'Mengirim...' : 'Kirim Bukti & Nominal'}
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
};

const ComprehensiveForm = ({ registration, onDone }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Format I: Data Pribadi
        namaLengkap: registration.User?.name || '',
        jenisKelamin: '',
        noKK: '',
        nik: '',
        tempatLahir: '',
        tglLahir: '',
        noAkte: '',
        agama: '',
        alamatLengkap: registration.fullData?.alamat || '',
        rt: '', rw: '',
        provinsi: '', kabupaten: '', kecamatan: '', desa: '',
        jenisTinggal: '',
        asalSekolah: registration.fullData?.sekolahAsal || '',
        sekolahKota: '',
        tahunLulus: '',
        noIjazah: '',
        noSKHU: '',
        nisn: registration.User?.nisn || '',

        // Format II: Keterangan Siswa
        namaPanggilan: '',
        statusOrtu: '',
        jmlKakak: '', jmlAdik: '', anakKe: '',
        jarakSekolah: '',
        transportasi: '',
        tinggi: '', berat: '', lingkarKepala: '',
        hobby: '', citaCita: '',
        kip: 'Tidak Memiliki',
        kipNomor: '',

        // Format III: Ayah
        namaAyah: '', tglLahirAyah: '', agamaAyah: '', alamatAyah: '', waAyah: '', pendidikanAyah: '', pekerjaanAyah: '', penghasilanAyah: '',
        // Format IV: Ibu
        namaIbu: '', tglLahirIbu: '', agamaIbu: '', alamatIbu: '', waIbu: '', pendidikanIbu: '', pekerjaanIbu: '', penghasilanIbu: '',
        // Format V: Wali
        namaWali: '', hubunganWali: '', tglLahirWali: '', agamaWali: '', alamatWali: '', waWali: '', pendidikanWali: '', pekerjaanWali: '', penghasilanWali: '',
    });

    const [loading, setLoading] = useState(false);

    // Cascading Address States
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // Independent states for codes to control selects
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedRegency, setSelectedRegency] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    const [schoolList, setSchoolList] = useState([]);
    const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);

    useEffect(() => {
        // Load school data
        fetch('/schools_data.json')
            .then(res => res.json())
            .then(data => setSchoolList(data))
            .catch(err => console.error("Failed to load schools", err));
    }, []);

    useEffect(() => {
        // Fetch Provinces via Proxy
        axios.get('/api/wilayah/provinces')
            .then(res => {
                if (res.data && Array.isArray(res.data.data)) {
                    setProvinces(res.data.data);
                } else {
                    setProvinces([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch provinces:", err);
                setProvinces([]);
            });
    }, []);

    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        setSelectedProvince(code);
        const name = provinces.find(p => p.code === code)?.name || '';
        setFormData({ ...formData, provinsi: name, kabupaten: '', kecamatan: '', desa: '' });

        setSelectedRegency(''); setSelectedDistrict(''); setSelectedVillage('');
        setRegencies([]); setDistricts([]); setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`/api/wilayah/regencies/${code}`);
                setRegencies(res.data.data);
            } catch (e) { console.error(e); }
        }
    };

    const handleRegencyChange = async (e) => {
        const code = e.target.value;
        setSelectedRegency(code);
        const name = regencies.find(r => r.code === code)?.name || '';
        setFormData({ ...formData, kabupaten: name, kecamatan: '', desa: '' });

        setSelectedDistrict(''); setSelectedVillage('');
        setDistricts([]); setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`/api/wilayah/districts/${code}`);
                setDistricts(res.data.data);
            } catch (e) { console.error(e); }
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        setSelectedDistrict(code);
        const name = districts.find(d => d.code === code)?.name || '';
        setFormData({ ...formData, kecamatan: name, desa: '' });

        setSelectedVillage('');
        setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`/api/wilayah/villages/${code}`);
                setVillages(res.data.data);
            } catch (e) { console.error(e); }
        }
    };

    const handleVillageChange = (e) => {
        const code = e.target.value;
        setSelectedVillage(code);
        const name = villages.find(v => v.code === code)?.name || '';
        setFormData({ ...formData, desa: name });
    };

    const nextStep = (e) => {
        e.preventDefault();
        // Validation for step 1
        if (step === 1) {
            if (!formData.namaLengkap || !formData.jenisKelamin || !formData.noKK || !formData.nik || !formData.tempatLahir || !formData.tglLahir) {
                alert("Harap lengkapi semua data wajib bertanda bintang (*)!");
                return;
            }
        }
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = (e) => {
        e.preventDefault();
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const finalizedData = { ...formData };
        Object.keys(finalizedData).forEach(key => {
            if (!finalizedData[key] || (typeof finalizedData[key] === 'string' && finalizedData[key].trim() === '')) {
                finalizedData[key] = '-';
            }
        });

        try {
            await axios.post('/api/student/complete-data', finalizedData);
            alert('Formulir berhasil disimpan!');
            onDone();
        } catch (err) {
            alert('Gagal menyimpan formulir');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>FORMAT I: Data Pribadi Siswa</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Nama Lengkap (Sesuai Ijazah/Akte) <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.namaLengkap} onChange={e => setFormData({ ...formData, namaLengkap: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Jenis Kelamin <span style={{ color: 'red' }}>*</span></label>
                                <select value={formData.jenisKelamin} onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value })} required>
                                    <option value="">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Agama</label>
                                <select value={formData.agama} onChange={e => setFormData({ ...formData, agama: e.target.value })}>
                                    <option value="">Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Nomor Kartu Keluarga (KK) <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.noKK} onChange={e => setFormData({ ...formData, noKK: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>NIK (Siswa) <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Tempat Lahir <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.tempatLahir} onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Tanggal Lahir <span style={{ color: 'red' }}>*</span></label>
                                <input type="date" value={formData.tglLahir} onChange={e => setFormData({ ...formData, tglLahir: e.target.value })} required />
                            </div>

                            {/* CASCADING ADDRESS */}
                            <div style={{ gridColumn: 'span 2', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Alamat Domisili</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label>Provinsi</label>
                                        <select value={selectedProvince} onChange={handleProvinceChange} required>
                                            <option value="">Pilih Provinsi</option>
                                            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Kabupaten / Kota</label>
                                        <select value={selectedRegency} onChange={handleRegencyChange} required disabled={!regencies.length}>
                                            <option value="">Pilih Kabupaten</option>
                                            {regencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Kecamatan</label>
                                        <select value={selectedDistrict} onChange={handleDistrictChange} required disabled={!districts.length}>
                                            <option value="">Pilih Kecamatan</option>
                                            {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Desa / Kelurahan</label>
                                        <select value={selectedVillage} onChange={handleVillageChange} required disabled={!villages.length}>
                                            <option value="">Pilih Desa</option>
                                            {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Alamat Lengkap (Jl/Blok/No/RT/RW)</label>
                                        <input type="text" value={formData.alamatLengkap} onChange={e => setFormData({ ...formData, alamatLengkap: e.target.value })} required />
                                    </div>
                                </div>
                            </div>


                            {/* SCHOOL AUTOCOMPLETE */}
                            <div className="input-group">
                                <label>Asal Sekolah</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={formData.asalSekolah}
                                        onChange={e => {
                                            setFormData({ ...formData, asalSekolah: e.target.value });
                                            setShowSchoolSuggestions(true);
                                        }}
                                        onFocus={() => setShowSchoolSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                                        placeholder="Ketik nama sekolah. Contoh: SMPN 1 Bandung"
                                        autoComplete="off"
                                    />
                                    {showSchoolSuggestions && formData.asalSekolah.length > 1 && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0,
                                            background: 'var(--card-bg)', border: '1px solid var(--border)',
                                            borderRadius: '0.5rem', maxHeight: '200px', overflowY: 'auto',
                                            zIndex: 100, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {schoolList
                                                .filter(s => s.nama.toLowerCase().includes(formData.asalSekolah.toLowerCase()))
                                                .slice(0, 10)
                                                .map((s, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            setFormData({ ...formData, asalSekolah: s.nama, sekolahKota: s.kab_kota });
                                                            setShowSchoolSuggestions(false);
                                                        }}
                                                        style={{
                                                            padding: '0.75rem 1rem', cursor: 'pointer',
                                                            borderBottom: '1px solid var(--border)',
                                                            color: 'var(--text-foreground)'
                                                        }}
                                                        className="school-suggestion-item"
                                                    >
                                                        <div style={{ fontWeight: '500' }}>{s.nama}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.kab_kota}</div>
                                                    </div>
                                                ))}
                                            {schoolList.filter(s => s.nama.toLowerCase().includes(formData.asalSekolah.toLowerCase())).length === 0 && (
                                                <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    Sekolah tidak ditemukan? Lanjutkan mengetik manual.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>NISN</label>
                                <input type="text" value={formData.nisn} onChange={e => setFormData({ ...formData, nisn: e.target.value })} />
                            </div>
                        </div>
                    </motion.div >
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>FORMAT II: Keterangan Siswa</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label>Nama Panggilan</label>
                                <input type="text" value={formData.namaPanggilan} onChange={e => setFormData({ ...formData, namaPanggilan: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Status Orang Tua</label>
                                <select value={formData.statusOrtu} onChange={e => setFormData({ ...formData, statusOrtu: e.target.value })}>
                                    <option value="">Pilih</option>
                                    <option value="Lengkap">Lengkap</option>
                                    <option value="Yatim">Yatim</option>
                                    <option value="Piatu">Piatu</option>
                                    <option value="Yatim Piatu">Yatim Piatu</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Jumlah Saudara (Kakak/Adik)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" placeholder="Kakak" value={formData.jmlKakak} onChange={e => setFormData({ ...formData, jmlKakak: e.target.value })} />
                                    <input type="number" placeholder="Adik" value={formData.jmlAdik} onChange={e => setFormData({ ...formData, jmlAdik: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Anak Ke-</label>
                                <input type="number" value={formData.anakKe} onChange={e => setFormData({ ...formData, anakKe: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Hobby</label>
                                <input type="text" value={formData.hobby} onChange={e => setFormData({ ...formData, hobby: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Cita-Cita</label>
                                <input type="text" value={formData.citaCita} onChange={e => setFormData({ ...formData, citaCita: e.target.value })} />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>FORMAT III: Data Ayah Kandung</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group"><label>Nama Ayah</label><input type="text" value={formData.namaAyah} onChange={e => setFormData({ ...formData, namaAyah: e.target.value })} /></div>
                            <div className="input-group"><label>Tempat, Tanggal Lahir</label><input type="text" value={formData.tglLahirAyah} onChange={e => setFormData({ ...formData, tglLahirAyah: e.target.value })} /></div>
                            <div className="input-group">
                                <label>Agama</label>
                                <select value={formData.agamaAyah} onChange={e => setFormData({ ...formData, agamaAyah: e.target.value })}>
                                    <option value="">Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                            <div className="input-group"><label>Pekerjaan</label><input type="text" value={formData.pekerjaanAyah} onChange={e => setFormData({ ...formData, pekerjaanAyah: e.target.value })} /></div>
                            <div className="input-group"><label>Penghasilan / Bulan</label><input type="text" value={formData.penghasilanAyah} onChange={e => setFormData({ ...formData, penghasilanAyah: e.target.value })} /></div>
                            <div className="input-group"><label>No. WA Ayah</label><input type="text" value={formData.waAyah} onChange={e => setFormData({ ...formData, waAyah: e.target.value })} /></div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>FORMAT IV: Data Ibu Kandung</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group"><label>Nama Ibu</label><input type="text" value={formData.namaIbu} onChange={e => setFormData({ ...formData, namaIbu: e.target.value })} /></div>
                            <div className="input-group"><label>Tempat, Tanggal Lahir</label><input type="text" value={formData.tglLahirIbu} onChange={e => setFormData({ ...formData, tglLahirIbu: e.target.value })} /></div>
                            <div className="input-group">
                                <label>Agama</label>
                                <select value={formData.agamaIbu} onChange={e => setFormData({ ...formData, agamaIbu: e.target.value })}>
                                    <option value="">Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                            <div className="input-group"><label>Pekerjaan</label><input type="text" value={formData.pekerjaanIbu} onChange={e => setFormData({ ...formData, pekerjaanIbu: e.target.value })} /></div>
                            <div className="input-group"><label>Penghasilan / Bulan</label><input type="text" value={formData.penghasilanIbu} onChange={e => setFormData({ ...formData, penghasilanIbu: e.target.value })} /></div>
                            <div className="input-group"><label>No. WA Ibu</label><input type="text" value={formData.waIbu} onChange={e => setFormData({ ...formData, waIbu: e.target.value })} /></div>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>FORMAT V: Data Wali (Jika Ada)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group"><label>Nama Wali</label><input type="text" value={formData.namaWali} onChange={e => setFormData({ ...formData, namaWali: e.target.value })} /></div>
                            <div className="input-group">
                                <label>Agama</label>
                                <select value={formData.agamaWali} onChange={e => setFormData({ ...formData, agamaWali: e.target.value })}>
                                    <option value="">Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                            <div className="input-group"><label>Hubungan</label><input type="text" value={formData.hubunganWali} onChange={e => setFormData({ ...formData, hubunganWali: e.target.value })} /></div>
                            <div className="input-group"><label>Pekerjaan</label><input type="text" value={formData.pekerjaanWali} onChange={e => setFormData({ ...formData, pekerjaanWali: e.target.value })} /></div>
                            <div className="input-group"><label>No. WA Wali</label><input type="text" value={formData.waWali} onChange={e => setFormData({ ...formData, waWali: e.target.value })} /></div>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <ClipboardList size={32} color="var(--primary)" />
                <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Formulir Pendaftaran Siswa Baru</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Lengkapi data sesuai dengan berkas asli (KK & Akte). Isi dengan "-" jika tidak tahu.</p>
                </div>
            </div>

            {/* Stepper Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: step >= s ? 'var(--primary)' : 'var(--glass)',
                        border: step === s ? '2px solid white' : '1px solid var(--border)',
                        color: step >= s ? 'white' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', zIndex: 1, position: 'relative'
                    }}>
                        {s}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {renderStepContent()}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className="btn" style={{ background: 'rgba(255,255,255,0.5)', color: 'var(--text-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={18} /> Kembali
                        </button>
                    )}

                    {step < 5 ? (
                        <button type="button" onClick={nextStep} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Lanjut Format {step + 1} <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={20} /> {loading ? 'Menyimpan...' : 'SIMPAN FORMULIR'}
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}; <option value="">Pilih Kabupaten/Kota</option>


const FinalStatusSection = ({ registration }) => {
    const pdfPage1Ref = useRef();
    const pdfPage2Ref = useRef();
    const [downloading, setDownloading] = useState(false);

    const downloadPDF = async () => {
        setDownloading(true);
        const page1 = pdfPage1Ref.current;
        const page2 = pdfPage2Ref.current;

        // Temporary Styling fo PDF generation
        const prepareElement = (el) => {
            el.style.color = '#000';
            el.style.background = '#fff';
            const badges = el.querySelectorAll('.badge');
            badges.forEach(b => { b.style.color = '#000'; b.style.border = '1px solid #000'; });
        };

        const restoreElement = (el) => {
            el.style.color = '';
            el.style.background = '';
        };

        prepareElement(page1);
        prepareElement(page2);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Page 1
            const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true });
            const imgData1 = canvas1.toDataURL('image/png');
            pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight); // Fit to page

            // Page 2
            pdf.addPage();
            const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true });
            const imgData2 = canvas2.toDataURL('image/png');
            pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight);

            pdf.save(`Formulir_SPMB_BN666_${registration.User?.name}.pdf`);
        } catch (err) {
            console.error('PDF Error:', err);
        } finally {
            restoreElement(page1);
            restoreElement(page2);
            setDownloading(false);
        }
    };

    const d = registration.fullData || {};

    const A4Style = {
        padding: '40px',
        textAlign: 'left',
        width: '210mm',
        minHeight: '297mm', // Force A4 height
        margin: '0 auto',
        backgroundColor: 'white',
        color: 'black',
        position: 'relative',
        fontSize: '12px',
        boxSizing: 'border-box'
    };

    const Header = () => (
        <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>YAYASAN PENDIDIKAN BAKTI NUSANTARA 666</h2>
            <h1 style={{ margin: '5px 0', fontSize: '22px', fontWeight: 'bold' }}>SMK BAKTI NUSANTARA 666</h1>
            <p style={{ margin: 0, fontSize: '10px' }}>Jl. Raya Percobaan No. 65 KM 17 Cileunyi, Bandung. Telp: (022) 63730220</p>
            <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>FORMULIR PENDAFTARAN PESERTA DIDIK BARU 2026/2027</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div className="no-print">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <Check size={40} color="white" />
                </div>
                <h2>Pendaftaran Berhasil & Lengkap!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                    Terima kasih <b>{registration.User?.name}</b>, data Anda telah lengkap. Silakan unduh hasil pendaftaran di bawah ini.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' }}>
                    <button onClick={downloadPDF} disabled={downloading} className="btn btn-primary">
                        <Download size={18} /> {downloading ? 'Generating PDF...' : 'Download PDF Formulir (2 Halaman)'}
                    </button>
                    {/* Print usually only prints visible, so we might need to handle print differently or rely on PDF print */}
                </div>
            </div>

            {/* HIDDEN PREVIEW CONTAINER */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>

                {/* PAGE 1: Format 1 & 2 */}
                <div ref={pdfPage1Ref} style={A4Style}>
                    <Header />

                    {/* FORMAT I: DATA PRIBADI */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px', borderBottom: '1px solid #ccc', margin: '0 0 10px 0' }}>FORMAT I: DATA PRIBADI SISWA</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <Row label="Nama Lengkap" value={d.namaLengkap} />
                                <Row label="NISN" value={registration.User?.nisn} />
                                <Row label="Jenis Kelamin" value={d.jenisKelamin} />
                                <Row label="Tempat, Tgl Lahir" value={`${d.tempatLahir}, ${d.tglLahir}`} />
                                <Row label="NIK" value={d.nik} />
                                <Row label="No. KK" value={d.noKK} />
                                <Row label="Agama" value={d.agama} />
                                <Row label="Alamat" value={`${d.alamatLengkap} RT:${d.rt} RW:${d.rw}, ${d.desa}, ${d.kecamatan}, ${d.kabupaten}, ${d.provinsi}`} />
                                <Row label="Sekolah Asal" value={d.asalSekolah} />
                                <Row label="Jurusan Dipilih" value={registration.Department?.name} />
                            </tbody>
                        </table>
                    </div>

                    {/* FORMAT II: KETERANGAN SISWA */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px', borderBottom: '1px solid #ccc', margin: '0 0 10px 0' }}>FORMAT II: KETERANGAN SISWA</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <Row label="Nama Panggilan" value={d.namaPanggilan} />
                                <Row label="Anak Ke" value={d.anakKe} />
                                <Row label="Jumlah Saudara" value={`${d.jmlKakak || 0} Kakak, ${d.jmlAdik || 0} Adik`} />
                                <Row label="Tinggi / Berat" value={`${d.tinggi || '-'} cm / ${d.berat || '-'} kg`} />
                                <Row label="Hobby" value={d.hobby} />
                                <Row label="Cita-cita" value={d.citaCita || '-'} />
                                <Row label="Status Ortu" value={d.statusOrtu} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGE 2: Format 3, 4, 5 */}
                <div ref={pdfPage2Ref} style={A4Style}>
                    <Header />

                    {/* FORMAT III & IV: DATA ORANG TUA */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px', borderBottom: '1px solid #ccc', margin: '0 0 10px 0' }}>FORMAT III: DATA AYAH</h3>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <Row label="Nama" value={d.namaAyah} />
                                    <Row label="TTL" value={d.tglLahirAyah} />
                                    <Row label="Pekerjaan" value={d.pekerjaanAyah} />
                                    <Row label="Penghasilan" value={d.penghasilanAyah} />
                                    <Row label="No. WA" value={d.waAyah} />
                                </tbody>
                            </table>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px', borderBottom: '1px solid #ccc', margin: '0 0 10px 0' }}>FORMAT IV: DATA IBU</h3>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <Row label="Nama" value={d.namaIbu} />
                                    <Row label="TTL" value={d.tglLahirIbu} />
                                    <Row label="Pekerjaan" value={d.pekerjaanIbu} />
                                    <Row label="Penghasilan" value={d.penghasilanIbu} />
                                    <Row label="No. WA" value={d.waIbu} />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FORMAT V: DATA WALI */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px', borderBottom: '1px solid #ccc', margin: '0 0 10px 0' }}>FORMAT V: DATA WALI (Jika Ada)</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <Row label="Nama Wali" value={d.namaWali} />
                                <Row label="Hubungan" value={d.hubunganWali} />
                                <Row label="Pekerjaan" value={d.pekerjaanWali} />
                                <Row label="No. WA" value={d.waWali} />
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', padding: '0 50px' }}>
                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <p>Mengetahui,<br />Orang Tua / Wali Murid</p>
                            <br /><br /><br /><br />
                            <p>( ................................ )</p>
                        </div>
                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <p>Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />Calon Siswa</p>
                            <br /><br /><br /><br />
                            <p>( <b>{registration.User?.name}</b> )</p>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

const Row = ({ label, value }) => (
    <tr style={{ borderBottom: '1px solid #eee' }}>
        <td style={{ padding: '8px 0', width: '150px', color: '#666' }}>{label}</td>
        <td style={{ padding: '8px 0', fontWeight: 'bold' }}>: {value || '-'}</td>
    </tr>
);

const MessagesModalContent = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/student/messages');
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/student/messages/${id}/read`);
            fetchMessages();
        } catch (err) { }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) return <div className="loader"></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada pesan.</p>
            ) : (
                messages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            padding: '1rem',
                            background: msg.isRead ? 'var(--glass)' : '#f0f9ff',
                            borderLeft: `4px solid ${msg.isRead ? 'var(--border)' : 'var(--primary)'}`,
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            cursor: !msg.isRead ? 'pointer' : 'default'
                        }}
                        onClick={() => !msg.isRead && markAsRead(msg.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: msg.isRead ? 'var(--text-foreground)' : 'var(--primary)' }}>{msg.title}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default SiswaDashboard;





