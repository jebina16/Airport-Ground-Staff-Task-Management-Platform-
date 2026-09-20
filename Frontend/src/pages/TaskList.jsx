import { useEffect, useState } from 'react';
import api from '../api/axios';

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        deadline: '',
        assignedToStaffId: ''
    });

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaffList(res.data);
        } catch (error) {
            console.error('Failed to load staff:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchStaff();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                ...form,
                assignedToStaffId: Number(form.assignedToStaffId)
            });

            setForm({
                title: '',
                description: '',
                priority: 'MEDIUM',
                deadline: '',
                assignedToStaffId: ''
            });

            fetchTasks();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed to create task'
            );
        }
    };

    const priorityColor = {
        HIGH: { bg: '#fde8e8', text: '#c0392b' },
        MEDIUM: { bg: '#fef5e7', text: '#b9770e' },
        LOW: { bg: '#eafaf1', text: '#1e8449' }
    };

    const statusColor = {
        PENDING: { bg: '#fef5e7', text: '#b9770e' },
        IN_PROGRESS: { bg: '#eaf2fd', text: '#2874a6' },
        COMPLETED: { bg: '#eafaf1', text: '#1e8449' }
    };

    return (
        <div style={styles.page}>

            <h1 style={styles.pageTitle}>Task Management</h1>
            <p style={styles.pageSubtitle}>
                Create tasks and assign them to ground staff
            </p>

            <div style={styles.formCard}>
                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        style={styles.input}
                        placeholder="Task Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        required
                    />

                    <input
                        style={styles.input}
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <select
                        style={styles.input}
                        value={form.priority}
                        onChange={(e) =>
                            setForm({ ...form, priority: e.target.value })
                        }
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>

                    <input
                        style={styles.input}
                        type="datetime-local"
                        value={form.deadline}
                        onChange={(e) =>
                            setForm({ ...form, deadline: e.target.value })
                        }
                        required
                    />

                    <select
                        style={styles.input}
                        value={form.assignedToStaffId}
                        onChange={(e) =>
                            setForm({ ...form, assignedToStaffId: e.target.value })
                        }
                        required
                    >
                        <option value="">-- Select Staff --</option>

                        {staffList.map((staff) => (
                            <option
                                key={staff.staffId}
                                value={staff.staffId}
                            >
                                {staff.name} ({staff.designation})
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={styles.button}>
                        Create Task
                    </button>
                </form>
            </div>

            <div style={styles.tableCard}>

                {loading && (
                    <p style={styles.emptyState}>Loading tasks...</p>
                )}

                {!loading && tasks.length === 0 && (
                    <p style={styles.emptyState}>
                        No tasks yet. Create one above.
                    </p>
                )}

                {!loading && tasks.length > 0 && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Deadline</th>
                                <th style={styles.th}>Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((t) => (
                                <tr key={t.taskId} style={styles.tr}>

                                    <td style={styles.td}>
                                        <strong>{t.title}</strong>
                                        {t.description && (
                                            <div style={styles.descText}>
                                                {t.description}
                                            </div>
                                        )}
                                    </td>

                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            background: priorityColor[t.priority]?.bg,
                                            color: priorityColor[t.priority]?.text
                                        }}>
                                            {t.priority}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            background: statusColor[t.status]?.bg,
                                            color: statusColor[t.status]?.text
                                        }}>
                                            {t.status}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        {t.deadline
                                            ? new Date(t.deadline).toLocaleString()
                                            : '—'}
                                    </td>

                                    <td style={styles.td}>
                                        {t.assignedTo
                                            ? t.assignedTo.name
                                            : '—'}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 800,
        color: '#1a2332',
        margin: '0 0 0.25rem 0'
    },
    pageSubtitle: {
        color: '#6b7280',
        margin: '0 0 1.5rem 0'
    },
    formCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center'
    },
    input: {
        padding: '0.6rem 0.8rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.9rem',
        outline: 'none',
        minWidth: '160px'
    },
    button: {
        padding: '0.6rem 1.2rem',
        background: '#1a2332',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    tableCard: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '0.9rem 1rem',
        background: '#f8f9fb',
        color: '#374151',
        fontSize: '0.85rem',
        fontWeight: 700,
        borderBottom: '1px solid #e5e7eb'
    },
    tr: {
        borderBottom: '1px solid #f1f2f4'
    },
    td: {
        padding: '0.9rem 1rem',
        fontSize: '0.9rem',
        color: '#1f2937',
        verticalAlign: 'top'
    },
    descText: {
        fontSize: '0.8rem',
        color: '#6b7280',
        marginTop: '0.2rem'
    },
    badge: {
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'inline-block'
    },
    emptyState: {
        padding: '2rem',
        textAlign: 'center',
        color: '#9ca3af'
    }
};

export default TaskList;