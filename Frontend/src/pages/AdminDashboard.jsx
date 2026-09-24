import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function AdminDashboard({ user }) {

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAckList, setShowAckList] = useState(false);

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

    const acknowledge = async (taskId) => {
        try {
            await api.put(`/tasks/${taskId}/acknowledge`);
            load();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to acknowledge');
        }
    };

    const supervisors = users.filter(u => u.role === 'SUPERVISOR');
    const staff = users.filter(u => u.role === 'STAFF');
    const pending = tasks.filter(t => t.status === 'PENDING').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const needsAckTasks = tasks.filter(t => t.status === 'COMPLETED' && !t.acknowledged);

    return (
        <Layout user={user} title={`Welcome, ${user.fullName}`} subtitle="Full system overview and user management">

            <div style={styles.statGrid}>
                <div style={styles.statCard}><span>Supervisors</span><strong>{supervisors.length}</strong></div>
                <div style={styles.statCard}><span>Staff</span><strong>{staff.length}</strong></div>
                <div style={styles.statCard}><span>Pending Tasks</span><strong>{pending}</strong></div>
                <div style={styles.statCard}><span>Completed</span><strong>{completed}</strong></div>

                {/* This card is now clickable */}
                <button
                    style={{
                        ...styles.statCard,
                        ...styles.statCardButton,
                        ...(needsAckTasks.length > 0 ? styles.statCardAlert : {})
                    }}
                    onClick={() => setShowAckList(!showAckList)}
                >
                    <span>Needs Acknowledgement</span>
                    <strong>{needsAckTasks.length}</strong>
                    {needsAckTasks.length > 0 && (
                        <span style={styles.clickHint}>
                            {showAckList ? 'Click to hide ▲' : 'Click to view ▼'}
                        </span>
                    )}
                </button>
            </div>

            {/* Expandable list of tasks needing acknowledgement */}
            {showAckList && needsAckTasks.length > 0 && (
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Tasks Awaiting Acknowledgement</h2>

                    {needsAckTasks.map(t => (
                        <div key={t.taskId} style={styles.taskRow}>
                            <div>
                                <strong>{t.title}</strong>
                                <div style={styles.meta}>
                                    Completed by {t.assignedTo?.name || '—'} on{' '}
                                    {t.completedAt ? new Date(t.completedAt).toLocaleString() : '—'}
                                </div>
                            </div>
                            <button style={styles.okBtn} onClick={() => acknowledge(t.taskId)}>
                                OK — Acknowledge
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <a href="/staff" style={styles.primaryBtn}>+ Create New User</a>

            <div style={styles.card}>
                <h2 style={styles.cardTitle}>All Users</h2>

                {loading && <p>Loading...</p>}

                {!loading && (
                    <div style={styles.tableScroll}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Action</th>
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
                    </div>
                )}
            </div>
        </Layout>
    );
}

const styles = {
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' },
    statCardButton: { cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' },
    statCardAlert: { border: '1px solid #f5b7b1', background: '#fdedec' },
    clickHint: { fontSize: '0.7rem', color: '#c0392b', fontWeight: 600 },
    primaryBtn: { display: 'inline-block', background: '#1a2332', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem' },
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' },
    cardTitle: { margin: '0 0 1rem 0', fontSize: '1.1rem' },
    taskRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #f1f2f4' },
    meta: { fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' },
    okBtn: { background: '#1e8449', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
    tableScroll: { overflowX: 'auto' },
    table: { width: '100%', minWidth: '500px', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.7rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap' },
    tr: { borderBottom: '1px solid #f1f2f4' },
    td: { padding: '0.7rem', fontSize: '0.9rem', whiteSpace: 'nowrap' },
    roleBadge: { background: '#eef2ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 },
    removeBtn: { background: '#fdedec', color: '#c0392b', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }
};

export default AdminDashboard;