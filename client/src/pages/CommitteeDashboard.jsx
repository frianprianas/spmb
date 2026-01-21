import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Users, Save, ArrowRight, ArrowLeft } from 'lucide-react';

const CommitteeDashboard = () => {
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'list'
    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form Data State
    const initialFormState = {
        // User Account Data
        name: '',
        email: '',
        wa: '',
        password: 'siswa', // Default password
        departmentId: '',
        paymentAmount: '',

        // Format I: Data Pribadi
        namaLengkap: '',
        jenisKelamin: '',
        noKK: '',
        nik: '',
        tempatLahir: '',
        tglLahir: '',
        noAkte: '',
        agama: '',
        alamatLengkap: '',
        rt: '', rw: '',
        provinsi: '', kabupaten: '', kecamatan: '', desa: '',
        jenisTinggal: '',
        asalSekolah: '',
        sekolahKota: '',
        tahunLulus: '',
        noIjazah: '',
        noSKHU: '',
        nisn: '',

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
    };

    const [formData, setFormData] = useState(initialFormState);

    // Cascading Address States
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // School Autocomplete State
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Independent states for codes to control selects
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedRegency, setSelectedRegency] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    useEffect(() => {
        fetchDepartments();
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

        // Fetch Schools Data
        fetch('/schools_data.json')
            .then(res => res.json())
            .then(data => setSchools(data))
            .catch(err => console.error("Error loading schools:", err));
    }, []);

    useEffect(() => {
        if (activeTab === 'list') {
            fetchStudents();
        }
    }, [activeTab]);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/departments');
            if (Array.isArray(res.data)) {
                setDepartments(res.data);
            } else {
                setDepartments([]);
            }
        } catch (err) {
            console.error("Failed to fetch depts", err);
            setDepartments([]);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/committee/students');
            if (Array.isArray(res.data)) {
                setStudents(res.data);
            } else {
                setStudents([]);
            }
        } catch (err) {
            console.error(err);
            setStudents([]);
        }
    };

    // Address Handlers
    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        setSelectedProvince(code);
        const name = provinces.find(p => p.code === code)?.name || '';
        setFormData({ ...formData, provinsi: name, kabupaten: '', kecamatan: '', desa: '' });

        // Reset children
        setSelectedRegency(''); setSelectedDistrict(''); setSelectedVillage('');
        setRegencies([]); setDistricts([]); setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`http://localhost:5000/api/wilayah/regencies/${code}`);
                if (res.data && Array.isArray(res.data.data)) {
                    setRegencies(res.data.data);
                }
            } catch (err) { console.error(err); }
        }
    };

    const handleRegencyChange = async (e) => {
        const code = e.target.value;
        setSelectedRegency(code);
        const name = regencies.find(r => r.code === code)?.name || '';
        setFormData({ ...formData, kabupaten: name, kecamatan: '', desa: '' });

        // Reset children
        setSelectedDistrict(''); setSelectedVillage('');
        setDistricts([]); setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`http://localhost:5000/api/wilayah/districts/${code}`);
                if (res.data && Array.isArray(res.data.data)) {
                    setDistricts(res.data.data);
                }
            } catch (err) { console.error(err); }
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        setSelectedDistrict(code);
        const name = districts.find(d => d.code === code)?.name || '';
        setFormData({ ...formData, kecamatan: name, desa: '' });

        // Reset children
        setSelectedVillage('');
        setVillages([]);

        if (code) {
            try {
                const res = await axios.get(`http://localhost:5000/api/wilayah/villages/${code}`);
                if (res.data && Array.isArray(res.data.data)) {
                    setVillages(res.data.data);
                }
            } catch (err) { console.error(err); }
        }
    };

    const handleVillageChange = (e) => {
        const code = e.target.value;
        setSelectedVillage(code);
        const name = villages.find(v => v.code === code)?.name || '';
        setFormData({ ...formData, desa: name });
    };

    // School Autocomplete Handlers
    const handleSchoolChange = (e) => {
        const userInput = e.target.value;
        setFormData({ ...formData, asalSekolah: userInput });

        if (userInput.length > 2) {
            const filtered = schools.filter(
                (school) =>
                    school.nama &&
                    school.nama.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredSchools(filtered.slice(0, 10)); // Limit to 10 suggestions
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSchool = (schoolName, city) => {
        setFormData({
            ...formData,
            asalSekolah: schoolName,
            sekolahKota: city || ''
        });
        setShowSuggestions(false);
    };

    const nextStep = (e) => {
        e.preventDefault();
        // Validation logic could be added here
        if (step === 1 && (!formData.departmentId || !formData.paymentAmount || !formData.namaLengkap)) {
            alert("Harap lengkapi Jurusan, Nominal Bayar, dan Nama Lengkap");
            return;
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
        if (!formData.departmentId) return alert('Pilih Jurusan!');

        setLoading(true);

        const finalizedData = { ...formData };
        Object.keys(finalizedData).forEach(key => {
            if (!finalizedData[key] || (typeof finalizedData[key] === 'string' && finalizedData[key].trim() === '')) {
                if (!['name', 'email', 'wa', 'password', 'departmentId', 'paymentAmount'].includes(key)) {
                    finalizedData[key] = '-';
                }
            }
        });

        if (!finalizedData.name) finalizedData.name = finalizedData.namaLengkap;

        if (!finalizedData.email) {
            const uniqueId = finalizedData.nisn || Date.now().toString();
            finalizedData.email = `${uniqueId}@bn666.com`;
        }

        if (!finalizedData.password) finalizedData.password = '123456';

        try {
            await axios.post('http://localhost:5000/api/committee/register-offline', finalizedData);
            alert('Pendaftaran Offline Berhasil!');
            setFormData(initialFormState);
            setStep(1);
            setSelectedProvince(''); setSelectedRegency(''); setSelectedDistrict(''); setSelectedVillage(''); // Reset Selects
            setActiveTab('list');
        } catch (err) {
            alert('Gagal mendaftar: ' + (err.response?.data?.message || err.message));
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
                            <div className="input-group">
                                <label>Jurusan Pilihan <span style={{ color: 'red' }}>*</span></label>
                                <select value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} required style={{ border: '2px solid var(--primary)' }}>
                                    <option value="">Pilih Jurusan</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Nominal Pembayaran (Cash) <span style={{ color: 'red' }}>*</span></label>
                                <input type="number" value={formData.paymentAmount} onChange={e => setFormData({ ...formData, paymentAmount: e.target.value })} required placeholder="Min 300000" style={{ border: '2px solid var(--primary)' }} />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Nama Lengkap (Sesuai Ijazah/Akte) <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.namaLengkap} onChange={e => setFormData({ ...formData, namaLengkap: e.target.value, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Jenis Kelamin</label>
                                <select value={formData.jenisKelamin} onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value })} required>
                                    <option value="">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>NISN</label>
                                <input type="text" value={formData.nisn} onChange={e => setFormData({ ...formData, nisn: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>No. KK</label>
                                <input type="text" value={formData.noKK} onChange={e => setFormData({ ...formData, noKK: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>NIK</label>
                                <input type="text" value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Tempat Lahir</label>
                                <input type="text" value={formData.tempatLahir} onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Tanggal Lahir</label>
                                <input type="date" value={formData.tglLahir} onChange={e => setFormData({ ...formData, tglLahir: e.target.value })} required />
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

                            {/* Address Section */}
                            <div style={{ gridColumn: 'span 2', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Alamat Domisili</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                        <input type="text" value={formData.alamatLengkap} onChange={e => setFormData({ ...formData, alamatLengkap: e.target.value })} required placeholder="Jl. Contoh No. 123, RT 01/RW 02" />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group" style={{ position: 'relative' }}>
                                <label>Asal Sekolah (SMP/MTs)</label>
                                <input
                                    type="text"
                                    value={formData.asalSekolah}
                                    onChange={handleSchoolChange}
                                    onFocus={() => formData.asalSekolah?.length > 2 && setShowSuggestions(true)}
                                    // Delay hiding to allow click event on suggestion
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    required
                                    disabled={schools.length === 0}
                                    placeholder={schools.length === 0 ? "Loading data sekolah..." : "Ketik nama sekolah..."}
                                    autoComplete="off"
                                />
                                {showSuggestions && filteredSchools.length > 0 && (
                                    <ul style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        background: 'white',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0.5rem',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}>
                                        {filteredSchools.map((school, index) => (
                                            <li
                                                key={index}
                                                onClick={() => selectSchool(school.nama, school.kab_kota)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee',
                                                    color: '#333'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                                onMouseLeave={(e) => e.target.style.background = 'white'}
                                            >
                                                <strong>{school.nama}</strong>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{school.kab_kota} ({school.status})</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="input-group">
                                <label>Tahun Lulus</label>
                                <input type="text" value={formData.tahunLulus} onChange={e => setFormData({ ...formData, tahunLulus: e.target.value })} />
                            </div>
                        </div>
                    </motion.div>
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
                                <label>No. WhatsApp (Siswa) <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" value={formData.wa} onChange={e => setFormData({ ...formData, wa: e.target.value })} required placeholder="08..." />
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
                                <label>Jarak Ke Sekolah (Km)</label>
                                <input type="number" value={formData.jarakSekolah} onChange={e => setFormData({ ...formData, jarakSekolah: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Transportasi</label>
                                <input type="text" value={formData.transportasi} onChange={e => setFormData({ ...formData, transportasi: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Anak Ke-</label>
                                <input type="number" value={formData.anakKe} onChange={e => setFormData({ ...formData, anakKe: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Jumlah Saudara (Kakak/Adik)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" placeholder="Kakak" value={formData.jmlKakak} onChange={e => setFormData({ ...formData, jmlKakak: e.target.value })} />
                                    <input type="number" placeholder="Adik" value={formData.jmlAdik} onChange={e => setFormData({ ...formData, jmlAdik: e.target.value })} />
                                </div>
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
                            <div className="input-group"><label>Tempat, Tanggal Lahir</label><input type="text" value={formData.tglLahirAyah} onChange={e => setFormData({ ...formData, tglLahirAyah: e.target.value })} placeholder="Bandung, 01-01-1970" /></div>
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
                            <div className="input-group"><label>Tempat, Tanggal Lahir</label><input type="text" value={formData.tglLahirIbu} onChange={e => setFormData({ ...formData, tglLahirIbu: e.target.value })} placeholder="Bandung, 01-01-1975" /></div>
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
                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#ecfdf5', borderRadius: '0.5rem', border: '1px solid #10b981', color: '#047857' }}>
                            <strong>Konfirmasi:</strong> Pastikan semua data yang diinput sudah benar. Akun siswa akan otomatis dibuat dan bukti pembayaran cash akan tercatat.
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    }

    return (
        <div className="container" style={{ maxWidth: '1200px', marginTop: '30px' }}>
            <h1 className="section-title">Dashboard Panitia SPMB</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Pendaftaran Siswa Baru (Jalur Offline / Datang Langsung).</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('new')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'new' ? 'var(--primary)' : 'var(--glass)',
                        color: activeTab === 'new' ? 'white' : 'var(--text-muted)',
                        border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <UserPlus size={18} /> Pendaftaran Baru
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'list' ? 'var(--primary)' : 'var(--glass)',
                        color: activeTab === 'list' ? 'white' : 'var(--text-muted)',
                        border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Users size={18} /> Data Pendaftar Offline
                </button>
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'new' ? (
                    <div className="glass" style={{ padding: '2rem' }}>

                        {/* Stepper Progress */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: step >= s ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                                    border: step === s ? '3px solid var(--primary)' : '1px solid var(--border)',
                                    color: step >= s ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', zIndex: 1, position: 'relative', cursor: 'default'
                                }}>
                                    {s}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {renderStepContent()}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
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
                                        <Save size={20} /> {loading ? 'Menyimpan...' : 'DAFTARKAN SISWA'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="glass" style={{ padding: '2rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '2000px', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>No</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Nama Lengkap</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>JK</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>NISN</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>NIK</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>No KK</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>TTL</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Agama</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Alamat</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Asal Sekolah</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Jurusan</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>WA Siswa</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Nama Ayah</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>WA Ayah</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>Nama Ibu</th>
                                    <th style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>WA Ibu</th>
                                    <th style={{ padding: '1rem' }}>Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--border)', background: index % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{index + 1}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee', fontWeight: 'bold' }}>{s.User?.name}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.jenisKelamin}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.nisn}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.nik}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.noKK}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.tempatLahir}, {s.fullData?.tglLahir}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.agama}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee', maxWidth: '300px', whiteSpace: 'normal' }}>
                                            {s.fullData?.alamatLengkap}, {s.fullData?.desa}, {s.fullData?.kecamatan}, {s.fullData?.kabupaten}, {s.fullData?.provinsi}
                                        </td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.asalSekolah}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.Department?.name}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.User?.wa || s.fullData?.wa}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.namaAyah}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.waAyah}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.namaIbu}</td>
                                        <td style={{ padding: '0.8rem', borderRight: '1px solid #eee' }}>{s.fullData?.waIbu}</td>
                                        <td style={{ padding: '0.8rem', fontWeight: 'bold', color: '#10b981' }}>
                                            Rp {parseInt(s.paymentAmount || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CommitteeDashboard;
