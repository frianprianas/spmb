import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, X, FileText, ExternalLink } from 'lucide-react';

const FinanceDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, verified, rejected
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchPayments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/finance/pending-payments');
            setPayments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await axios.post(`http://localhost:5000/api/finance/verify-payment/${id}`, { status });
            fetchPayments();
        } catch (err) {
            alert('Gagal verifikasi');
        }
    };

    const filteredPayments = filter === 'all'
        ? payments
        : payments.filter(p => p.paymentStatus === filter);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1200px', marginTop: '30px' }}>
            <h1 className="section-title">Dashboard Keuangan</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Verifikasi dan pantau pembayaran pendaftaran siswa.</p>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {['all', 'pending', 'verified', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            border: '1px solid var(--border)',
                            background: filter === f ? 'var(--primary)' : 'var(--glass)',
                            color: filter === f ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="glass" style={{ padding: '2rem' }}>
                {filteredPayments.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Tidak ada data pembayaran.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Siswa</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Nominal</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Bukti</th>
                                <th style={{ textAlign: 'right', padding: '1rem' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500' }}>{p.User?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.User?.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                        Rp {parseInt(p.paymentAmount || 0).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge badge-${p.paymentStatus}`}>
                                            {p.paymentStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => setSelectedImage(`http://localhost:5000/${p.paymentProofUrl.replace(/\\/g, '/')}`)}
                                            className="btn-link"
                                            style={{ color: 'var(--primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <ExternalLink size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Lihat
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {p.paymentStatus === 'pending' ? (
                                            <>
                                                <button onClick={() => handleVerify(p.id, 'verified')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#10b981', marginRight: '0.5rem', boxShadow: 'none' }}>
                                                    <Check size={14} /> Ops
                                                </button>
                                                <button onClick={() => handleVerify(p.id, 'rejected')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#ef4444', boxShadow: 'none' }}>
                                                    <X size={14} /> No
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Selesai</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        style={{
                            position: 'relative', width: '90%', maxWidth: '1000px', height: '90vh',
                            background: 'white', padding: '0.5rem', borderRadius: '0.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: '-2rem', right: '-2rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={32} />
                        </button>
                        {selectedImage.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedImage} title="Bukti" style={{ width: '100%', height: '100%', border: 'none' }} />
                        ) : (
                            <img src={selectedImage} alt="Bukti" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDashboard;
