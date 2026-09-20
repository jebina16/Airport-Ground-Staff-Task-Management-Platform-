import { useEffect, useState } from 'react';
import api from '../api/axios';

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [staffList, setStaffList] = useState([]);

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

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Task Management</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>

                <input
                    placeholder="Task Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    required
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <select
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
                    type="datetime-local"
                    value={form.deadline}
                    onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                    }
                    required
                />

                {/* This is the fix — a dropdown showing staff NAMES,
                    while the actual value sent to the backend is the staff ID */}
                <select
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

                <button type="submit">Create Task</button>
            </form>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t) => (
                        <tr key={t.taskId}>
                            <td>{t.title}</td>
                            <td>{t.priority}</td>
                            <td>{t.status}</td>
                            <td>
                                {t.deadline
                                    ? new Date(t.deadline).toLocaleString()
                                    : ''}
                            </td>
                            <td>
                                {t.assignedTo
                                    ? t.assignedTo.name
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskList;