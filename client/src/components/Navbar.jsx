import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="nav">
            <Link to="/" className="btn" style={{ fontSize: '1.2rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="/assets/logo.png" alt="Logo SMK BN666" style={{ height: '45px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem', letterSpacing: '0.5px' }}>SMK BAKTI NUSANTARA 666</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sistem Penerimaan Murid Baru</span>
                </div>
            </Link>
            <div className="nav-links">
                <Link to="/"><HomeIcon size={18} /> Home</Link>
                {user ? (
                    <>
                        {user.role === 'siswa' && <Link to="/siswa"><LayoutDashboard size={18} /> Dashboard</Link>}
                        {user.role === 'keuangan' && <Link to="/finance"><LayoutDashboard size={18} /> Finance</Link>}
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin"><LayoutDashboard size={18} /> Admin</Link>
                                <Link to="/finance">Finance</Link>
                            </>
                        )}
                        <button onClick={logout} className="btn" style={{ background: 'none', color: 'var(--accent)' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ color: 'white' }}>Daftar Sekarang</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
