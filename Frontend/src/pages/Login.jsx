import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError('');
        setLoading(true);

        try {

            const response = await api.post(
                '/auth/login',
                {
                    email: email.trim(),
                    password: password
                }
            );

            const loggedInUser = response.data;

            if (!loggedInUser.token) {
                throw new Error('Token not received');
            }

            localStorage.setItem(
                'token',
                loggedInUser.token
            );

            localStorage.setItem(
                'user',
                JSON.stringify({
                    email: loggedInUser.email,
                    fullName: loggedInUser.fullName,
                    role: loggedInUser.role
                })
            );

            navigate('/dashboard');

        } catch (error) {

            console.error(
                'Login error:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Invalid email or password'
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-brand">

                <div className="logo">
                    ✈
                </div>

                <h1>
                    AirportOps
                </h1>

                <p>
                    Airport Ground Staff
                    Management System
                </p>

                <span>
                    Streamline staff, tasks
                    and airport ground operations.
                </span>

            </div>

            <div className="login-container">

                <div className="login-card">

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-description">
                        Sign in to access your dashboard
                    </p>

                    <form onSubmit={handleLogin}>

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Signing in...'
                                : 'Sign In'
                            }
                        </button>

                    </form>

                    <p className="admin-note">
                        Account access is managed
                        by the system administrator.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;