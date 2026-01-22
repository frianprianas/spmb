import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, CreditCard, FileText, MapPin, Phone, Mail, X, Instagram, Facebook, MessageCircle, Music, Wallet } from 'lucide-react';
import schoolImg from '../assets/school.jpg';
import hero2 from '../assets/hero_2.png';
import hero3 from '../assets/hero_3.png';
import flyerPemasaran from '../assets/flyer_pemasaran.jpg';
import flyerAkl from '../assets/flyer_akl.jpg';
import flyerPplg from '../assets/flyer_pplg.jpg';
import flyerDkvAnm from '../assets/flyer_dkv_anm.jpg';

const Home = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPricing, setShowPricing] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const heroImages = [schoolImg, hero2, hero3];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    const flyers = [
        { id: 1, img: flyerPplg, title: 'Pengembangan Perangkat Lunak & Gim' },
        { id: 2, img: flyerDkvAnm, title: 'DKV & Animasi' },
        { id: 3, img: flyerAkl, title: 'Akuntansi Keuangan Lembaga' },
        { id: 4, img: flyerPemasaran, title: 'Pemasaran' },
    ];

    return (
        <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Ornaments */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

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
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
                        SPMB <span style={{ color: 'var(--primary)' }}>SMK Bakti Nusantara 666</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Sistem Penerimaan Murid Baru yang terintegrasi, transparan, dan sepenuhnya digital. Mulai langkah kesuksesanmu bersama sekolah vokasi terbaik.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
                            Daftar Sekarang <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn" style={{ border: '1px solid var(--border)', padding: '0.8rem 1.5rem', fontSize: '1rem', background: 'white' }}>
                            Masuk
                        </Link>
                        <motion.button
                            onClick={() => setShowPricing(true)}
                            className="btn"
                            style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.8rem 1.5rem', fontSize: '1rem', background: 'rgba(2, 132, 199, 0.1)' }}
                            animate={{
                                rotate: [0, -3, 3, -3, 3, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <Wallet size={18} /> Rincian Biaya
                        </motion.button>
                    </div>
                </motion.div>

                <div style={{ position: 'relative', height: '500px', width: '100%' }}>
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

                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentImageIndex}
                            src={heroImages[currentImageIndex]}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            alt="SMK Bakti Nusantara 666"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '2rem',
                                boxShadow: 'var(--shadow)',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                    </AnimatePresence>

                    <div className="glass" style={{
                        position: 'absolute',
                        bottom: '30px',
                        right: '-30px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        maxWidth: '250px',
                        zIndex: 10
                    }}>
                        <div style={{ background: '#10b981', padding: '0.8rem', borderRadius: '50%' }}>
                            <CheckCircle color="white" />
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Terakreditasi A</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Sekolah Pusat Keunggulan</p>
                        </div>
                    </div>
                </div>
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

            {/* Pricing Modal */}
            <AnimatePresence>
                {showPricing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPricing(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '2rem',
                                maxWidth: '800px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowPricing(false)}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 20
                                }}
                            >
                                <X size={20} />
                            </button>

                            <div style={{
                                padding: '3rem 1.5rem',
                                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/assets/header-investasi.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>INVESTASI PENDIDIKAN</h2>
                                <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Rincian Biaya Penerimaan Murid Baru 2026/2027</p>
                            </div>

                            <div style={{ padding: '1.5rem', fontSize: '0.95rem' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontWeight: 500 }}>Formulir Pendaftaran</span>
                                        <span style={{ fontWeight: 600 }}>Rp 300.000</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontWeight: 500 }}>Dana Sumbangan Pendidikan (DSP)</span>
                                        <span style={{ fontWeight: 600 }}>Rp 3.775.000</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontWeight: 500 }}>Paket Seragam Sekolah</span>
                                        <span style={{ fontWeight: 600 }}>Rp 800.000</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontWeight: 500 }}>IPP / SPP Bulan Pertama</span>
                                        <span style={{ fontWeight: 600 }}>Rp 350.000</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '2px dashed #e5e7eb' }}>
                                        <span style={{ fontWeight: 500 }}>Kegiatan MPLS / MOPD</span>
                                        <span style={{ fontWeight: 600 }}>Rp 275.000</span>
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Biaya Masuk</h3>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                                        Rp 5.500.000
                                    </div>
                                </div>

                                <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    <strong>Ketentuan Pembayaran:</strong>
                                    <br />
                                    Total biaya SPMB harus sudah lunas paling lambat tanggal <strong>10 Juli 2026</strong>.
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Section */}
            <section className="glass" style={{ padding: '4rem', marginBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
                <div
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setShowMap(true)}
                    onMouseLeave={() => setShowMap(false)}
                >
                    <MapPin size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>Alamat</h3>
                    <p style={{ opacity: 0.7 }}>Jl. Raya Percobaan No. 65 KM 17 Cileunyi, Bandung.</p>

                    <AnimatePresence>
                        {showMap && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                                exit={{ opacity: 0, y: 10, scale: 0.9, x: '-50%' }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    marginBottom: '1.5rem',
                                    width: '320px',
                                    height: '240px',
                                    background: 'white',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    zIndex: 50,
                                    border: '2px solid white'
                                }}
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.675003324075!2d107.7399371477459!3d-6.940883093099282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c31e72e1c9c9%3A0xb3631215b244791a!2sSMK%20Bakti%20Nusantara%20666!5e0!3m2!1sid!2sid!4v1705844440000!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>

                                {/* Little triangle pointer */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%) rotate(45deg)',
                                    width: '16px',
                                    height: '16px',
                                    background: 'white',
                                    zIndex: -1
                                }}></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

            {/* Social Media Section - Added to Footer */}
            <section style={{ textAlign: 'center', paddingBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Ikuti Kami di Sosial Media</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <a href="https://www.instagram.com/smkbaktinusantara666/" target="_blank" rel="noreferrer" style={{ color: '#E1306C', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Instagram size={24} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>Instagram</span>
                    </a>
                    <a href="https://www.facebook.com/Smkbn666/" target="_blank" rel="noreferrer" style={{ color: '#1877F2', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Facebook size={24} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>Facebook</span>
                    </a>
                    <a href="https://www.tiktok.com/@smkbaktinusantara666" target="_blank" rel="noreferrer" style={{ color: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Music size={24} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>TikTok</span>
                    </a>
                    <a href="https://wa.me/6282121635987" target="_blank" rel="noreferrer" style={{ color: '#25D366', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageCircle size={24} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>WhatsApp</span>
                    </a>
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
