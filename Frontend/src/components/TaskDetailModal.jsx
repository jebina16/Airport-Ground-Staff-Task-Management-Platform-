import { useEffect, useState } from 'react';
import api from '../api/axios';

function TaskDetailModal({ taskId, onClose }) {

    const [task, setTask] = useState(null);

    useEffect(() => {
        api.get(`/tasks/${taskId}`)
            .then((res) => setTask(res.data))
            .catch((error) => console.error(error));
    }, [taskId]);

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

                <button style={styles.closeBtn} onClick={onClose}>✕</button>

                {!task && <p>Loading task...</p>}

                {task && (
                    <>
                        <h2 style={styles.title}>{task.title}</h2>

                        <div style={styles.row}>
                            <span style={styles.label}>Status</span>
                            <span>{task.status}{task.acknowledged ? ' (Acknowledged)' : ''}</span>
                        </div>

                        <div style={styles.row}>
                            <span style={styles.label}>Priority</span>
                            <span>{task.priority}</span>
                        </div>

                        <div style={styles.row}>
                            <span style={styles.label}>Deadline</span>
                            <span>{task.deadline ? new Date(task.deadline).toLocaleString() : '—'}</span>
                        </div>

                        <div style={styles.row}>
                            <span style={styles.label}>Assigned To</span>
                            <span>{task.assignedTo?.name || '—'}</span>
                        </div>

                        <div style={styles.row}>
                            <span style={styles.label}>Created By</span>
                            <span>{task.createdBy?.fullName || '—'}</span>
                        </div>

                        {task.description && (
                            <div style={styles.descBlock}>
                                <span style={styles.label}>Description</span>
                                <p style={{ margin: '0.4rem 0 0 0' }}>{task.description}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: '#fff', borderRadius: '12px', padding: '1.75rem', width: '420px', maxWidth: '90vw', position: 'relative' },
    closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#6b7280' },
    title: { margin: '0 0 1rem 0', fontSize: '1.3rem', color: '#1a2332' },
    row: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f2f4', fontSize: '0.9rem' },
    label: { color: '#6b7280', fontWeight: 600 },
    descBlock: { marginTop: '1rem', fontSize: '0.9rem' }
};

export default TaskDetailModal;