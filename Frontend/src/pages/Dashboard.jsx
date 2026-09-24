
import { useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import StaffDashboard from './StaffDashboard';

function Dashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(storedUser);
    }, []);

    if (!user) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    if (user.role === 'ADMIN') return <AdminDashboard user={user} />;
    if (user.role === 'SUPERVISOR') return <SupervisorDashboard user={user} />;
    if (user.role === 'STAFF') return <StaffDashboard user={user} />;

    return <div style={{ padding: '2rem' }}>Unknown role.</div>;
}

export default Dashboard;