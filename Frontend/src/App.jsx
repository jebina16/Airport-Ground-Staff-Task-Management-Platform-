import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffList from './pages/StaffList';
import TaskList from './pages/TaskList';
import Notifications from './pages/Notifications';

import ProtectedRoute from './components/ProtectedRoute';

function App() {

    return (

        <Router>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'SUPERVISOR'
                            ]}
                        >
                            <StaffList />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <TaskList />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </Router>
    );
}

export default App;