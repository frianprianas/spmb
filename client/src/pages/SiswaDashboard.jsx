import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, CreditCard, User, FileText, Info, Save, ClipboardList, Download, Printer, ArrowRight, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SiswaDashboard = () => {
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRegistration = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/student/me');
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
        </div>
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
            await axios.post('http://localhost:5000/api/student/upload-docs', formData);
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
            await axios.post('http://localhost:5000/api/student/upload-payment', formData);
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
            <div style={{ background: 'var(--glass)', padding: '1.5rem', borderRadius: '1rem', margin: '1.5rem 0' }}>
                <p>Silakan transfer biaya pendaftaran ke rekening berikut:</p>
                <h3 style={{ margin: '1rem 0', color: 'var(--primary)' }}>Bank Mandiri: 1310001611666<br /><span style={{ fontSize: '0.9rem' }}>(A/N Yayasan Pendidikan Dasar dan Menengah Bakti Nusantara)</span></h3>
                <p style={{ fontSize: '0.9rem' }}>Nominal Minimal: <b>Rp 300.000</b> (Formulir)</p>
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
        axios.get('http://localhost:5000/api/wilayah/provinces')
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
                const res = await axios.get(`http://localhost:5000/api/wilayah/regencies/${code}`);
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
                const res = await axios.get(`http://localhost:5000/api/wilayah/districts/${code}`);
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
                const res = await axios.get(`http://localhost:5000/api/wilayah/villages/${code}`);
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
            await axios.post('http://localhost:5000/api/student/complete-data', finalizedData);
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
    const pdfRef = useRef();
    const [downloading, setDownloading] = useState(false);

    const downloadPDF = async () => {
        setDownloading(true);
        const element = pdfRef.current;

        // Switch to light theme temp for PDF
        element.style.color = '#000';
        element.style.background = '#fff';
        const badges = element.querySelectorAll('.badge');
        badges.forEach(b => { b.style.color = '#000'; b.style.border = '1px solid #000'; });

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Formulir_SPMB_BN666_${registration.User?.name}.pdf`);
        } catch (err) {
            console.error('PDF Error:', err);
        } finally {
            // Restore theme
            element.style.color = '';
            element.style.background = '';
            setDownloading(false);
        }
    };

    const d = registration.fullData || {};

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
                        <Download size={18} /> {downloading ? 'Generating PDF...' : 'Download PDF Formulir'}
                    </button>
                    <button onClick={() => window.print()} className="btn" style={{ border: '1px solid var(--border)' }}>
                        <Printer size={18} /> Cetak Langsung
                    </button>
                </div>
            </div>

            {/* PDF TEMPLATE (Hidden from normal view but used for snapshot) */}
            <div ref={pdfRef} style={{
                padding: '40px',
                textAlign: 'left',
                width: '210mm',
                margin: '0 auto',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                position: 'relative',
                fontSize: '12px'
            }}>
                <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>YAYASAN PENDIDIKAN BAKTI NUSANTARA 666</h2>
                    <h1 style={{ margin: '5px 0', fontSize: '22px' }}>SMK BAKTI NUSANTARA 666</h1>
                    <p style={{ margin: 0, fontSize: '10px' }}>Jl. Raya Percobaan No. 65 KM 17 Cileunyi, Bandung. Telp: (022) 63730220</p>
                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>FORMULIR PENDAFTARAN PESERTA DIDIK BARU 2026/2027</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px' }}>FORMAT I: DATA PRIBADI SISWA</h3>
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

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px' }}>FORMAT II: KETERANGAN SISWA</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <Row label="Nama Panggilan" value={d.namaPanggilan} />
                            <Row label="Anak Ke" value={d.anakKe} />
                            <Row label="Tinggi / Berat" value={`${d.tinggi} cm / ${d.berat} kg`} />
                            <Row label="Hobby" value={d.hobby} />
                            <Row label="Cita-cita" value={d.citaCita || '-'} />
                            <Row label="Status Ortu" value={d.statusOrtu} />
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px' }}>DATA AYAH</h3>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <Row label="Nama" value={d.namaAyah} />
                                <Row label="Pekerjaan" value={d.pekerjaanAyah} />
                                <Row label="WA" value={d.waAyah} />
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3 style={{ background: '#eee', padding: '5px', fontSize: '13px' }}>DATA IBU</h3>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <Row label="Nama" value={d.namaIbu} />
                                <Row label="Pekerjaan" value={d.pekerjaanIbu} />
                                <Row label="WA" value={d.waIbu} />
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center', width: '200px' }}>
                        <p>Panitia P2DB</p>
                        <br /><br /><br />
                        <p>( ................................ )</p>
                    </div>
                    <div style={{ textAlign: 'center', width: '200px' }}>
                        <p>Calon Siswa</p>
                        <br /><br /><br />
                        <p>( <b>{registration.User?.name}</b> )</p>
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

export default SiswaDashboard;
