import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Users, School, Search, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token } = useAuth(); // Assuming auth context provides the token for authorized requests
    const [activeTab, setActiveTab] = useState('candidates'); // 'departments' or 'candidates'
    const [departments, setDepartments] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Departments state
    const [newDept, setNewDept] = useState({ name: '', quota: 0 });
    const [editingDept, setEditingDept] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Candidates Filter
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDepts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCandidates = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const res = await axios.get('http://localhost:5000/api/admin/candidates', config);
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchDepts(), fetchCandidates()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Department Handlers
    const handleAddDept = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.post('http://localhost:5000/api/admin/departments', newDept, config);
            setNewDept({ name: '', quota: 0 });
            fetchDepts();
        } catch (err) {
            alert('Gagal tambah jurusan');
        }
    };

    const handleDeleteDept = async (id) => {
        if (confirm('Hapus jurusan ini?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                await axios.delete(`http://localhost:5000/api/admin/departments/${id}`, config);
                fetchDepts();
            } catch (err) {
                alert('Gagal hapus');
            }
        }
    };

    const handleUpdateDept = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`http://localhost:5000/api/admin/departments/${id}`, editingDept, config);
            setEditingDept(null);
            fetchDepts();
        } catch (err) {
            alert('Gagal update');
        }
    };

    // Filtered Candidates
    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.Registration?.nisn && c.Registration.nisn.includes(searchTerm))
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1400px', marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>Dashboard Admin</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Kelola data jurusan dan pantau pendaftaran siswa baru.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('candidates')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'candidates' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'candidates' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Users size={18} /> Data Calon Siswa
                </button>
                <button
                    onClick={() => setActiveTab('finance')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'finance' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'finance' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FileText size={18} /> Data Keuangan (Verified)
                </button>
                <button
                    onClick={() => setActiveTab('departments')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'departments' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'departments' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <School size={18} /> Kelola Jurusan
                </button>
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'finance' ? (
                    <div className="glass" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Laporan Keuangan Terverifikasi</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Menampilkan daftar calon siswa yang telah melunasi pembayaran pendaftaran.</p>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#065f46', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>No</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nama Siswa</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Jurusan</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nominal Transfer</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Bukti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.filter(c => c.Registration?.paymentStatus === 'verified').length > 0 ?
                                        candidates.filter(c => c.Registration?.paymentStatus === 'verified').map((c, index) => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>{c.name}<br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</span></td>
                                                <td style={{ padding: '1rem' }}>{c.Registration?.Department?.name || '-'}</td>
                                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>Rp {parseInt(c.Registration?.paymentAmount || 0).toLocaleString()}</td>
                                                <td style={{ padding: '1rem' }}><span className="badge badge-verified">VERIFIED</span></td>
                                                <td style={{ padding: '1rem' }}>
                                                    {c.Registration?.paymentProofUrl && (
                                                        <button
                                                            onClick={() => {
                                                                const url = `http://localhost:5000/${c.Registration.paymentProofUrl.replace(/\\/g, '/')}`;
                                                                console.log('Opening Image:', url);
                                                                setSelectedImage(url);
                                                            }}
                                                            className="btn-link"
                                                            style={{
                                                                color: 'var(--primary)',
                                                                textDecoration: 'underline',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: 'inherit'
                                                            }}
                                                        >
                                                            Lihat Bukti
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    Belum ada data pembayaran yang terverifikasi.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'candidates' ? (
                    <>
                        {/* Department Stats */}
                        <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} color="var(--primary)" /> Statistik Peminat Jurusan
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {departments.map(dept => {
                                    const count = candidates.filter(c => c.Registration?.Department?.name === dept.name).length;
                                    const quota = dept.quota || 0;
                                    const percentage = quota > 0 ? Math.min((count / quota) * 100, 100) : 0;

                                    return (
                                        <div key={dept.id} style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                <span style={{ fontWeight: '500' }}>{dept.name}</span>
                                                <span style={{ color: percentage >= 100 ? '#ef4444' : 'var(--primary)', fontWeight: 'bold' }}>
                                                    {count} / {quota} Terisi
                                                </span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    style={{
                                                        height: '100%',
                                                        background: percentage >= 100 ? '#ef4444' : 'linear-gradient(90deg, var(--primary) 0%, #a855f7 100%)',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>Daftar Calon Siswa ({candidates.length})</h3>
                                <div className="input-group" style={{ width: '300px', marginBottom: 0 }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Cari nama, email, atau NISN..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ paddingLeft: '3rem' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>No</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nama Lengkap</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>NISN</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Asal Sekolah</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Jurusan Pilihan</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Jalur</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Kontak (WA)</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status Akun</th>
                                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status Daftar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCandidates.length > 0 ? filteredCandidates.map((c, index) => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>
                                                    {c.name}<br />
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{c.nisn || '-'}</td>
                                                <td style={{ padding: '1rem' }}>{c.Registration?.fullData?.sekolahAsal || '-'}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {c.Registration?.Department?.name ? (
                                                        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                                            {c.Registration.Department.name}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span className={`badge ${c.Registration?.registrationType === 'offline' ? 'badge-verified' : 'badge-pending'}`}
                                                        style={{ background: c.Registration?.registrationType === 'offline' ? '#dbeafe' : '#f3f4f6', color: c.Registration?.registrationType === 'offline' ? '#1e40af' : '#374151' }}>
                                                        {c.Registration?.registrationType?.toUpperCase() || 'ONLINE'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{c.wa}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {c.isVerified ?
                                                        <span className="badge badge-verified">Verified</span> :
                                                        <span className="badge badge-rejected">Unverified</span>
                                                    }
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {(() => {
                                                        const reg = c.Registration;
                                                        if (!reg) return <span className="badge badge-pending">Belum Ada Data</span>;

                                                        if (reg.isCompleted) {
                                                            return <span className="badge badge-verified" style={{ background: '#dcfce7', color: '#166534' }}>Sudah Mengisi Formulir Utama</span>;
                                                        }
                                                        if (reg.paymentStatus === 'verified') {
                                                            return <span className="badge badge-verified" style={{ background: '#dbeafe', color: '#1e40af' }}>Sudah Upload & Verifikasi</span>;
                                                        }
                                                        if (reg.paymentStatus === 'pending' && reg.paymentProofUrl) {
                                                            return <span className="badge badge-pending" style={{ background: '#fef9c3', color: '#854d0e' }}>Menunggu Verifikasi</span>;
                                                        }

                                                        return <span className="badge badge-pending" style={{ background: '#f3f4f6', color: '#374151' }}>Hanya Daftar</span>;
                                                    })()}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    Tidak ada data calon siswa ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                        {/* Add Form */}
                        <div className="glass" style={{ padding: '2rem', alignSelf: 'start' }}>
                            <h3>Tambah Jurusan Baru</h3>
                            <form onSubmit={handleAddDept} style={{ marginTop: '1.5rem' }}>
                                <div className="input-group">
                                    <label>Nama Jurusan</label>
                                    <input type="text" value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>Kuota</label>
                                    <input type="number" value={newDept.quota} onChange={e => setNewDept({ ...newDept, quota: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Plus size={18} /> Tambah Jurusan
                                </button>
                            </form>
                        </div>

                        {/* List Table */}
                        <div className="glass" style={{ padding: '2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem' }}>Jurusan</th>
                                        <th style={{ textAlign: 'left', padding: '1rem' }}>Kuota</th>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map(d => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            {editingDept?.id === d.id ? (
                                                <>
                                                    <td style={{ padding: '1rem' }}>
                                                        <input type="text" value={editingDept.name} onChange={e => setEditingDept({ ...editingDept, name: e.target.value })} style={{ padding: '0.25rem', width: '100%' }} />
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <input type="number" value={editingDept.quota} onChange={e => setEditingDept({ ...editingDept, quota: e.target.value })} style={{ padding: '0.25rem', width: '80px' }} />
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        <button onClick={() => handleUpdateDept(d.id)} className="btn btn-primary" style={{ padding: '0.5rem', background: '#10b981', marginRight: '0.5rem', boxShadow: 'none' }}>
                                                            <Save size={14} />
                                                        </button>
                                                        <button onClick={() => setEditingDept(null)} className="btn btn-primary" style={{ padding: '0.5rem', background: 'var(--text-muted)', boxShadow: 'none' }}>
                                                            <X size={14} />
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td style={{ padding: '1rem' }}>{d.name}</td>
                                                    <td style={{ padding: '1rem' }}>{d.quota}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        <button onClick={() => setEditingDept(d)} className="btn btn-primary" style={{ padding: '0.5rem', background: 'var(--primary)', marginRight: '0.5rem', boxShadow: 'none' }}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDeleteDept(d.id)} className="btn btn-primary" style={{ padding: '0.5rem', background: '#ef4444', boxShadow: 'none' }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
            {/* Simple Image/PDF Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '90%',
                            maxWidth: '1000px',
                            height: '90vh',
                            background: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'absolute',
                                top: '-2rem',
                                right: '-2rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={32} />
                        </button>

                        {selectedImage.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={selectedImage}
                                title="Bukti Transfer"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            />
                        ) : (
                            <img
                                src={selectedImage}
                                alt="Bukti Transfer"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    display: 'block',
                                    borderRadius: '4px'
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
