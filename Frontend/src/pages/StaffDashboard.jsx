import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function StaffDashboard({ user }) {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await api.get('/tasks/my');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const complete = async (taskId) => {
        if (!window.confirm('Mark this task as complete?')) return;
        try {
            await api.put(`/tasks/${taskId}/complete`);
            load();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update task');
        }
    };

    const pending = tasks.filter(t => t.status !== 'COMPLETED');
    const completed = tasks.filter(t => t.status === 'COMPLETED');

    return (
        <Layout user={user} title={`Welcome, ${user.fullName}`} subtitle="Your assigned tasks">

            <div style={styles.statGrid}>
                <div style={styles.statCard}><span>Pending Tasks</span><strong>{pending.length}</strong></div>
                <div style={styles.statCard}><span>Completed</span><strong>{completed.length}</strong></div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.cardTitle}>My Tasks</h2>

                {loading && <p>Loading...</p>}

                {!loading && tasks.length === 0 && (
                    <p style={{ color: '#6b7280' }}>No tasks assigned yet.</p>
                )}

                {!loading && tasks.map(t => (
                    <div key={t.taskId} style={styles.taskRow}>
                        <div>
                            <strong>{t.title}</strong>
                            {t.description && <div style={styles.meta}>{t.description}</div>}
                            <div style={styles.meta}>
                                Priority: {t.priority} — Deadline:{' '}
                                {t.deadline ? new Date(t.deadline).toLocaleString() : '—'}
                            </div>
                        </div>

                        {t.status === 'COMPLETED' ? (
                            <span style={t.acknowledged ? styles.doneBadge : styles.waitingBadge}>
                                {t.acknowledged ? 'Acknowledged ✓' : 'Awaiting Review'}
                            </span>
                        ) : (
                            <button style={styles.completeBtn} onClick={() => complete(t.taskId)}>
                                Mark Complete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </Layout>
    );
}

const styles = {
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem' },
    cardTitle: { margin: '0 0 1rem 0', fontSize: '1.1rem' },
    taskRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.9rem 0', borderBottom: '1px solid #f1f2f4' },
    meta: { fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' },
    completeBtn: { background: '#1a2332', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    doneBadge: { background: '#eafaf1', color: '#1e8449', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 },
    waitingBadge: { background: '#fef5e7', color: '#b9770e', padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }
};

export default StaffDashboard;