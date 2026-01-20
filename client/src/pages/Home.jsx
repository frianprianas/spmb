import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, CreditCard, FileText, MapPin, Phone, Mail, X } from 'lucide-react';
import schoolImg from '../assets/school.jpg';
import flyerPemasaran from '../assets/flyer_pemasaran.jpg';
import flyerAkl from '../assets/flyer_akl.jpg';
import flyerPplg from '../assets/flyer_pplg.jpg';
import flyerDkvAnm from '../assets/flyer_dkv_anm.jpg';

const Home = () => {
    const [selectedId, setSelectedId] = useState(null);

    const flyers = [
        { id: 1, img: flyerPplg, title: 'Pengembangan Perangkat Lunak & Gim' },
        { id: 2, img: flyerDkvAnm, title: 'DKV & Animasi' },
        { id: 3, img: flyerAkl, title: 'Akuntansi Keuangan Lembaga' },
        { id: 4, img: flyerPemasaran, title: 'Pemasaran' },
    ];

    return (
        <div className="container">
            {/* Hero Section */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                padding: '80px 0',
                minHeight: '80vh'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <span className="badge badge-verified" style={{ padding: '0.5rem 1rem' }}>Pendaftaran 2026/2027 Dibuka</span>
                    </div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
                        Membangun Masa Depan di <span style={{ color: 'var(--primary)' }}>SMK Bakti Nusantara 666</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Sistem Penerimaan Murid Baru yang terintegrasi, transparan, dan sepenuhnya digital. Mulai langkah kesuksesanmu bersama sekolah vokasi terbaik.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                            Daftar Sekarang <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn" style={{ border: '1px solid var(--border)', padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                            Masuk Dashboard
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1 }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                        width: '100%',
                        height: '100%',
                        background: 'var(--primary)',
                        borderRadius: '2rem',
                        opacity: 0.1,
                        zIndex: -1
                    }}></div>
                    <img
                        src={schoolImg}
                        alt="SMK Bakti Nusantara 666"
                        style={{
                            width: '100%',
                            borderRadius: '2rem',
                            boxShadow: 'var(--shadow)',
                            objectFit: 'cover',
                            height: '500px'
                        }}
                    />
                    <div className="glass" style={{
                        position: 'absolute',
                        bottom: '30px',
                        right: '-30px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        maxWidth: '250px'
                    }}>
                        <div style={{ background: '#10b981', padding: '0.8rem', borderRadius: '50%' }}>
                            <CheckCircle color="white" />
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Terakreditasi A</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Sekolah Pusat Keunggulan</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Flyers Section */}
            <section style={{ padding: '4rem 0', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Kompetensi Keahlian</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Pilih jurusan impianmu dan raih masa depan gemilang.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                    padding: '0 1rem'
                }}>
                    {flyers.map((item) => (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`}
                            onClick={() => setSelectedId(item.id)}
                            whileHover={{ y: -10, scale: 1.02 }}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow)',
                                border: '1px solid var(--border)',
                                position: 'relative',
                                background: 'white'
                            }}
                        >
                            <motion.img
                                src={item.img}
                                alt={item.title}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                            <div style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--foreground)' }}>
                                {item.title}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.85)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                                padding: '1rem'
                            }}
                        >
                            <motion.div
                                layoutId={`card-${selectedId}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    maxWidth: '600px',
                                    width: '100%',
                                    position: 'relative',
                                    borderRadius: '1rem',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={flyers.find(f => f.id === selectedId).img}
                                    alt="Detail"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                                <button
                                    onClick={() => setSelectedId(null)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(255,255,255,0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <X size={24} color="black" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Timeline Section */}
            <section style={{ padding: '100px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 className="section-title">Alur Pendaftaran Digital</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Ikuti langkah-langkah mudah di bawah ini untuk menjadi bagian dari kami.</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <TimelineStep
                        number={1}
                        icon={<ShieldCheck size={24} color="var(--primary)" />}
                        title="Registrasi Akun & OTP"
                        desc="Buat akun pendaftaran Anda dan lakukan verifikasi nomor WhatsApp untuk keamanan data."
                    />
                    <TimelineStep
                        number={2}
                        icon={<FileText size={24} color="#a855f7" />}
                        title="Unggah Dokumen Digital"
                        desc="Siapkan foto KK dan Akte Kelahiran asli. Unggah langsung melalui dashboard siswa Anda."
                    />
                    <TimelineStep
                        number={3}
                        icon={<CreditCard size={24} color="#f43f5e" />}
                        title="Pembayaran Registrasi"
                        desc="Lakukan pembayaran biaya pendaftaran dan unggah bukti transfer. Tim keuangan akan memverifikasi secara cepat."
                    />
                    <TimelineStep
                        number={4}
                        icon={<CheckCircle size={24} color="#10b981" />}
                        title="Lengkapi Biodata & Selesai"
                        desc="Isi formulir pendaftaran lengkap sesuai dokumen asli dan unduh kartu bukti pendaftaran Anda."
                        isLast={true}
                    />
                </div>
            </section>

            {/* Pricing/Cost Section */}
            <section style={{ padding: '0 0 80px 0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', color: '#1e293b', borderRadius: '2rem', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                    <div style={{ padding: '3rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Investasi Pendidikan</h2>
                        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Rincian Biaya Penerimaan Murid Baru Tahun Pelajaran 2026/2027</p>
                    </div>
                    <div style={{ padding: '3rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Formulir Pendaftaran</span>
                                <span style={{ fontWeight: 600 }}>Rp 300.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Dana Sumbangan Pendidikan (DSP)</span>
                                <span style={{ fontWeight: 600 }}>Rp 3.775.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Paket Seragam Sekolah</span>
                                <span style={{ fontWeight: 600 }}>Rp 800.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>IPP / SPP Bulan Pertama</span>
                                <span style={{ fontWeight: 600 }}>Rp 350.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '2px dashed #e5e7eb' }}>
                                <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Kegiatan MPLS / MOPD</span>
                                <span style={{ fontWeight: 600 }}>Rp 275.000</span>
                            </div>
                        </div>

                        <div style={{
                            background: '#f8fafc',
                            padding: '2rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Biaya Masuk</h3>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                                Rp 5.500.000
                            </div>
                        </div>

                        <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            <strong>Ketentuan Pembayaran:</strong>
                            <br />
                            Total biaya SPMB harus sudah lunas paling lambat tanggal <strong>10 Juli 2026</strong> atau satu minggu sebelum tanggal mulai masuk sekolah murid baru (tanggal mulai masuk sekolah akan diinformasikan kembali).
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="glass" style={{ padding: '4rem', marginBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
                <div>
                    <MapPin size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>Alamat</h3>
                    <p style={{ opacity: 0.7 }}>Jl. Raya Percobaan No. 65 KM 17 Cileunyi, Bandung.</p>
                </div>
                <div>
                    <Phone size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>Kontak</h3>
                    <p style={{ opacity: 0.7 }}>(022) 63730220 / 0821-2163-5987</p>
                </div>
                <div>
                    <Mail size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>Email</h3>
                    <p style={{ opacity: 0.7 }}>info@smkbn666.sch.id</p>
                </div>
            </section>
        </div>
    );
};

const TimelineStep = ({ number, icon, title, desc, isLast }) => (
    <div style={{ display: 'flex', gap: '3rem', position: 'relative', marginBottom: isLast ? 0 : '4rem' }}>
        {/* Line */}
        {!isLast && (
            <div style={{
                position: 'absolute',
                top: '70px',
                left: '34px',
                width: '2px',
                height: 'calc(100% + 2rem)',
                background: 'linear-gradient(to bottom, var(--primary), var(--secondary), transparent)',
                opacity: 0.3,
                zIndex: 0
            }} />
        )}

        {/* Bubble */}
        <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            style={{
                width: '70px',
                height: '70px',
                borderRadius: '24px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                flexShrink: 0,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
        >
            {icon}
        </motion.div>

        {/* Content */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 10 }}
            className="glass"
            style={{ padding: '2rem', flex: 1, textAlign: 'left' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{
                    background: 'var(--primary)',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                }}>
                    {number}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title}</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>{desc}</p>
        </motion.div>
    </div>
);

export default Home;
