import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function SupervisorDashboard({ user }) {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await api.get('/tasks/department');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const acknowledge = async (taskId) => {
        try {
            await api.put(`/tasks/${taskId}/acknowledge`);
            load();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to acknowledge');
        }
    };

    const nudge = async (taskId) => {
        try {
            await api.put(`/tasks/${taskId}/nudge`);
            alert('Reminder sent.');
        } catch (error) {
            alert('Failed to send reminder');
        }
    };

    const pending = tasks.filter(t => t.status !== 'COMPLETED');
    const needsAck = tasks.filter(t => t.status === 'COMPLETED' && !t.acknowledged);
    const done = tasks.filter(t => t.status === 'COMPLETED' && t.acknowledged);

    return (
        <Layout user={user} title={`Welcome, ${user.fullName}`} subtitle="Your department's task overview">

            <div style={styles.statGrid}>
                <div style={styles.statCard}><span>Pending / In Progress</span><strong>{pending.length}</strong></div>
                <div style={{ ...styles.statCard, ...(needsAck.length > 0 ? styles.statCardAlert : {}) }}>
                    <span>Awaiting Your OK</span><strong>{needsAck.length}</strong>
                </div>
                <div style={styles.statCard}><span>Completed &amp; Acknowledged</span><strong>{done.length}</strong></div>
            </div>

            <a href="/tasks" style={styles.primaryBtn}>+ Assign New Task</a>

            {needsAck.length > 0 && (
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Needs Your Acknowledgement</h2>
                    {needsAck.map(t => (
                        <div key={t.taskId} style={styles.taskRow}>
                            <div>
                                <strong>{t.title}</strong>
                                <div style={styles.meta}>
                                    Completed by {t.assignedTo?.name} on{' '}
                                    {t.completedAt ? new Date(t.completedAt).toLocaleString() : ''}
                                </div>
                            </div>
                            <button style={styles.okBtn} onClick={() => acknowledge(t.taskId)}>
                                OK — Acknowledge
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Department Staff — Task Status</h2>

                {loading && <p>Loading...</p>}

                {!loading && pending.length === 0 && needsAck.length === 0 && (
                    <p style={{ color: '#6b7280' }}>All caught up — nothing pending.</p>
                )}

                {!loading && pending.map(t => (
                    <div key={t.taskId} style={styles.taskRow}>
                        <div>
                            <strong>{t.title}</strong>
                            <div style={styles.meta}>
                                Assigned to {t.assignedTo?.name} — Status: {t.status}
                            </div>
                        </div>
                        <button style={styles.nudgeBtn} onClick={() => nudge(t.taskId)}>
                            Send Reminder
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

const styles = {
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    statCardAlert: { border: '1px solid #f5b7b1', background: '#fdedec' },
    primaryBtn: { display: 'inline-block', background: '#1a2332', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem' },
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' },
    cardTitle: { margin: '0 0 1rem 0', fontSize: '1.1rem' },
    taskRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #f1f2f4' },
    meta: { fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' },
    okBtn: { background: '#1e8449', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    nudgeBtn: { background: '#fef5e7', color: '#b9770e', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }
};

export default SupervisorDashboard;