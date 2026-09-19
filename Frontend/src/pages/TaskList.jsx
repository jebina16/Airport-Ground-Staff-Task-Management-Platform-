import { useEffect, useState } from 'react';

import api from '../api/axios';

function TaskList() {

    const [tasks, setTasks] =
        useState([]);

    const [staffList, setStaffList] =
        useState([]);

    const [form, setForm] =
        useState({
            title: '',
            description: '',
            priority: 'MEDIUM',
            deadline: '',
            assignedToStaffId: ''
        });

    const [error, setError] =
        useState('');

    const user =
        JSON.parse(
            localStorage.getItem('user')
            || 'null'
        );

    const isStaff =
        user?.role === 'STAFF';

    const canCreate =
        user?.role === 'ADMIN' ||
        user?.role === 'SUPERVISOR';

    const fetchTasks = async () => {

        try {

            const response =
                await api.get(
                    isStaff
                        ? '/tasks/my'
                        : '/tasks'
                );

            setTasks(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    const fetchStaff = async () => {

        try {

            const response =
                await api.get('/staff');

            setStaffList(
                response.data
            );

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {

        fetchTasks();

        if (canCreate) {
            fetchStaff();
        }

    }, []);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const createTask =
        async (e) => {

            e.preventDefault();

            setError('');

            try {

                await api.post(
                    '/tasks',
                    {
                        ...form,
                        assignedToStaffId:
                            Number(
                                form.assignedToStaffId
                            )
                    }
                );

                setForm({
                    title: '',
                    description: '',
                    priority: 'MEDIUM',
                    deadline: '',
                    assignedToStaffId: ''
                });

                fetchTasks();

            } catch (error) {

                console.error(error);

                setError(
                    'Unable to create task'
                );
            }
        };

    const updateStatus =
        async (
            taskId,
            status
        ) => {

            try {

                await api.put(
                    `/tasks/${taskId}/status`,
                    {
                        status
                    }
                );

                fetchTasks();

            } catch (error) {

                console.error(error);

            }
        };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Task Management
                    </h1>

                    <p>
                        {isStaff
                            ? 'Your assigned tasks'
                            : 'Create and monitor ground operation tasks'
                        }
                    </p>

                </div>

            </div>


            {canCreate && (

                <div className="form-card">

                    <h2>
                        Create Task
                    </h2>

                    <form
                        className="form-grid"
                        onSubmit={createTask}
                    >

                        <div>
                            <label>
                                Task Title
                            </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div>
                            <label>
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >

                                <option value="LOW">
                                    Low
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="HIGH">
                                    High
                                </option>

                            </select>
                        </div>


                        <div className="full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div>

                            <label>
                                Deadline
                            </label>

                            <input
                                type="datetime-local"
                                name="deadline"
                                value={
                                    form.deadline
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Assign To
                            </label>

                            <select
                                name="assignedToStaffId"
                                value={
                                    form.assignedToStaffId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Staff
                                </option>

                                {staffList.map(
                                    (staff) => (

                                        <option
                                            key={
                                                staff.staffId
                                            }
                                            value={
                                                staff.staffId
                                            }
                                        >

                                            {
                                                staff.name
                                            }
                                            {' - '}
                                            {
                                                staff.employeeCode
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {error && (

                            <div className="error-message">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Assign Task
                        </button>

                    </form>

                </div>

            )}


            <div className="table-card">

                <h2>
                    Tasks
                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>
                                Title
                            </th>

                            <th>
                                Priority
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Deadline
                            </th>

                            {isStaff && (
                                <th>
                                    Action
                                </th>
                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {tasks.map(
                            (task) => (

                                <tr
                                    key={
                                        task.taskId
                                    }
                                >

                                    <td>
                                        {task.title}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                `priority-${task.priority.toLowerCase()}`
                                            }
                                        >
                                            {
                                                task.priority
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        <span className="status-badge">
                                            {
                                                task.status
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        {task.deadline}
                                    </td>

                                    {isStaff && (

                                        <td>

                                            {task.status !==
                                                'COMPLETED' && (

                                                <button
                                                    className="small-button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            task.taskId,
                                                            'COMPLETED'
                                                        )
                                                    }
                                                >
                                                    Mark Completed
                                                </button>

                                            )}

                                        </td>

                                    )}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default TaskList;