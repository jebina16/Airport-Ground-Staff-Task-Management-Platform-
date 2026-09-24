import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function AdminDashboard({ user }) {

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const [usersRes, tasksRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/tasks')
            ]);
            setUsers(usersRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const removeUser = async (id, name) => {
        if (!window.confirm(`Remove ${name}'s account? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            load();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to remove user');
        }
    };

    const supervisors = users.filter(u => u.role === 'SUPERVISOR');
    const staff = users.filter(u => u.role === 'STAFF');
    const pending = tasks.filter(t => t.status === 'PENDING').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const needsAck = tasks.filter(t => t.status === 'COMPLETED' && !t.acknowledged).length;

    return (
        <Layout user={user} title={`Welcome, ${user.fullName}`} subtitle="Full system overview and user management">

            <div style={styles.statGrid}>
                <div style={styles.statCard}><span>Supervisors</span><strong>{supervisors.length}</strong></div>
                <div style={styles.statCard}><span>Staff</span><strong>{staff.length}</strong></div>
                <div style={styles.statCard}><span>Pending Tasks</span><strong>{pending}</strong></div>
                <div style={styles.statCard}><span>Completed</span><strong>{completed}</strong></div>
                <div style={{ ...styles.statCard, ...(needsAck > 0 ? styles.statCardAlert : {}) }}>
                    <span>Needs Acknowledgement</span><strong>{needsAck}</strong>
                </div>
            </div>

            <a href="/staff" style={styles.primaryBtn}>+ Create New User</a>

            <div style={styles.card}>
                <h2 style={styles.cardTitle}>All Users</h2>

                {loading && <p>Loading...</p>}

                {!loading && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.userId} style={styles.tr}>
                                    <td style={styles.td}>{u.fullName}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>
                                        <span style={styles.roleBadge}>{u.role}</span>
                                    </td>
                                    <td style={styles.td}>
                                        {u.role !== 'ADMIN' && (
                                            <button
                                                style={styles.removeBtn}
                                                onClick={() => removeUser(u.userId, u.fullName)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

const styles = {
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    statCardAlert: { border: '1px solid #f5b7b1', background: '#fdedec' },
    primaryBtn: { display: 'inline-block', background: '#1a2332', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem' },
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem' },
    cardTitle: { margin: '0 0 1rem 0', fontSize: '1.1rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.7rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#6b7280' },
    tr: { borderBottom: '1px solid #f1f2f4' },
    td: { padding: '0.7rem', fontSize: '0.9rem' },
    roleBadge: { background: '#eef2ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 },
    removeBtn: { background: '#fdedec', color: '#c0392b', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }
};

export default AdminDashboard;