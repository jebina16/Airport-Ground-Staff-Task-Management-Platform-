import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Layout({ user, title, subtitle, children }) {

    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        api.get('/notifications/unread-count')
            .then((res) => setUnreadCount(res.data.count))
            .catch(() => {});
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>✈ AirportOps</div>

                <nav style={styles.nav}>
                    <Link style={styles.navLink} to="/dashboard">Dashboard</Link>

                    {user.role === 'ADMIN' && (
                        <Link style={styles.navLink} to="/staff">User Management</Link>
                    )}

                    {user.role === 'SUPERVISOR' && (
                        <Link style={styles.navLink} to="/tasks">Assign Tasks</Link>
                    )}

                    {user.role === 'STAFF' && (
                        <Link style={styles.navLink} to="/tasks">My Tasks</Link>
                    )}

                    <Link style={styles.navLink} to="/notifications">
                        Notifications
                        {unreadCount > 0 && (
                            <span style={styles.badge}>{unreadCount}</span>
                        )}
                    </Link>
                </nav>

                <button style={styles.logoutBtn} onClick={logout}>Logout</button>
            </aside>

            <main style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>{title}</h1>
                        <p style={styles.subtitle}>{subtitle}</p>
                    </div>
                    <div style={styles.roleTag}>{user.role}</div>
                </header>

                {children}
            </main>
        </div>
    );
}

const styles = {
    layout: { display: 'flex', minHeight: '100vh', background: '#f4f5f7', fontFamily: 'system-ui, sans-serif' },
    sidebar: { width: '230px', background: '#1a2332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' },
    logo: { fontWeight: 800, fontSize: '1.1rem', marginBottom: '2rem' },
    nav: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
    navLink: { color: '#cbd3e1', textDecoration: 'none', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem' },
    badge: { background: '#e53935', color: '#fff', borderRadius: '10px', padding: '0 6px', marginLeft: '6px', fontSize: '0.7rem' },
    logoutBtn: { background: 'transparent', border: '1px solid #3a4457', color: '#cbd3e1', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' },
    main: { flex: 1, padding: '2rem', maxWidth: '1100px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    title: { fontSize: '1.7rem', fontWeight: 800, color: '#1a2332', margin: 0 },
    subtitle: { color: '#6b7280', margin: '0.25rem 0 0 0' },
    roleTag: { background: '#eef2ff', color: '#3730a3', padding: '0.35rem 0.8rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.8rem' }
};

export default Layout;