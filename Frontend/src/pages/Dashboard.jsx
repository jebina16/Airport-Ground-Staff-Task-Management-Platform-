
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../api/axios';

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [tasks, setTasks] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        const storedUser =
            JSON.parse(
                localStorage.getItem('user') || 'null'
            );

        setUser(storedUser);

        if (storedUser?.role === 'STAFF') {

            api.get('/tasks/my')
                .then((response) => {
                    setTasks(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } else {

            api.get('/tasks')
                .then((response) => {
                    setTasks(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        api.get('/notifications/unread-count')
            .then((response) => {
                setUnreadCount(response.data.count);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login');
    };

    if (!user) {

        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    const isAdmin = user.role === 'ADMIN';

    const isSupervisor = user.role === 'SUPERVISOR';

    const isStaff = user.role === 'STAFF';

    return (

        <div className="dashboard-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    ✈ AirportOps
                </div>

                <nav>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>


                    {isAdmin && (

                        <Link to="/staff">
                            User &amp; Staff Management
                        </Link>

                    )}


                    {isSupervisor && (

                        <Link to="/staff">
                            Staff
                        </Link>

                    )}


                    {(isAdmin ||
                        isSupervisor ||
                        isStaff) && (

                        <Link to="/tasks">
                            Tasks
                        </Link>

                    )}


                    <Link to="/notifications">
                        Notifications
                        {unreadCount > 0 && (
                            <span style={{
                                background: '#e53935',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '0 6px',
                                marginLeft: '6px',
                                fontSize: '0.75rem'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </Link>

                </nav>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </aside>


            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Good day,{" "}
                            {user.fullName}
                        </h1>

                        <p>
                            Airport Ground Staff
                            Management System
                        </p>

                    </div>

                    <div className="user-badge">

                        <strong>
                            {user.role}
                        </strong>

                    </div>

                </header>


                <section className="stat-grid">

                    <div className="stat-card">
                        <span>
                            Total Tasks
                        </span>

                        <strong>
                            {tasks.length}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Pending
                        </span>

                        <strong>
                            {
                                tasks.filter(
                                    t => t.status === 'PENDING'
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                tasks.filter(
                                    t => t.status === 'COMPLETED'
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Unread Alerts
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>
                    </div>

                </section>


                {isAdmin && (

                    <section className="dashboard-section">

                        <h2>
                            Administrator Control
                        </h2>

                        <p>
                            Manage supervisors,
                            staff, departments
                            and overall operations.
                        </p>

                        <Link
                            className="primary-link"
                            to="/staff"
                        >
                            Manage Users
                        </Link>

                    </section>

                )}


                {isSupervisor && (

                    <section className="dashboard-section">

                        <h2>
                            Supervisor Operations
                        </h2>

                        <p>
                            Assign work to staff
                            and monitor task progress.
                        </p>

                        <Link
                            className="primary-link"
                            to="/tasks"
                        >
                            Manage Tasks
                        </Link>

                    </section>

                )}


                {isStaff && (

                    <section className="dashboard-section">

                        <h2>
                            My Work
                        </h2>

                        <p>
                            View and update your
                            assigned tasks.
                        </p>

                        <Link
                            className="primary-link"
                            to="/tasks"
                        >
                            View My Tasks
                        </Link>

                    </section>

                )}

            </main>

        </div>
    );
}

export default Dashboard;