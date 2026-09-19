import { useEffect, useState } from 'react';

import api from '../api/axios';

function StaffList() {

    const [users, setUsers] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);

    const [form, setForm] =
        useState({
            fullName: '',
            email: '',
            password: '',
            role: 'STAFF',
            employeeCode: '',
            designation: '',
            phone: '',
            shift: '',
            departmentId: ''
        });

    const [message, setMessage] =
        useState('');

    const [error, setError] =
        useState('');

    const user =
        JSON.parse(
            localStorage.getItem('user') ||
            'null'
        );


    // ==========================================
    // FETCH USERS
    // ==========================================

    const fetchUsers = async () => {

        try {

            const response =
                await api.get(
                    '/admin/users'
                );

            setUsers(response.data);

        } catch (error) {

            console.error(
                'Unable to fetch users:',
                error
            );

            setError(
                'Unable to load users'
            );
        }
    };


    // ==========================================
    // FETCH DEPARTMENTS
    // ==========================================

    const fetchDepartments =
        async () => {

            try {

                const response =
                    await api.get(
                        '/departments'
                    );

                setDepartments(
                    response.data
                );

            } catch (error) {

                console.error(
                    'Unable to fetch departments:',
                    error
                );

                setError(
                    'Unable to load departments'
                );
            }
        };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        if (user?.role === 'ADMIN') {

            fetchUsers();

            fetchDepartments();
        }

    }, []);


    // ==========================================
    // HANDLE FORM CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    // ==========================================
    // CREATE USER
    // ==========================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setMessage('');
            setError('');

            try {

                await api.post(
                    '/admin/users',
                    {
                        ...form,

                        departmentId:
                            form.departmentId
                                ? Number(
                                    form.departmentId
                                )
                                : null
                    }
                );

                setMessage(
                    `${form.role} account created successfully`
                );

                setForm({
                    fullName: '',
                    email: '',
                    password: '',
                    role: 'STAFF',
                    employeeCode: '',
                    designation: '',
                    phone: '',
                    shift: '',
                    departmentId: ''
                });

                fetchUsers();

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    'Unable to create user'
                );
            }
        };


    // ==========================================
    // ADMIN ONLY
    // ==========================================

    if (user?.role !== 'ADMIN') {

        return (
            <div className="page-container">

                <h1>
                    Staff Management
                </h1>

                <p>
                    Only Admin can create
                    and manage user accounts.
                </p>

            </div>
        );
    }


    return (

        <div className="page-container">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        Create Supervisor
                        and Staff accounts
                    </p>

                </div>

            </div>


            {/* CREATE USER FORM */}

            <div className="form-card">

                <h2>
                    Create New User
                </h2>

                <form
                    className="form-grid"
                    onSubmit={handleSubmit}
                >

                    {/* FULL NAME */}

                    <div>

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter full name"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter password"
                            required
                        />

                    </div>


                    {/* ROLE */}

                    <div>

                        <label>
                            Role
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={
                                handleChange
                            }
                            required
                        >

                            <option value="STAFF">
                                Staff
                            </option>

                            <option value="SUPERVISOR">
                                Supervisor
                            </option>

                        </select>

                    </div>


                    {/* STAFF ONLY FIELDS */}

                    {form.role === 'STAFF' && (

                        <>

                            {/* EMPLOYEE CODE */}

                            <div>

                                <label>
                                    Employee Code
                                </label>

                                <input
                                    type="text"
                                    name="employeeCode"
                                    value={
                                        form.employeeCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. GS001"
                                    required
                                />

                            </div>


                            {/* DESIGNATION */}

                            <div>

                                <label>
                                    Designation
                                </label>

                                <input
                                    type="text"
                                    name="designation"
                                    value={
                                        form.designation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Ground Staff"
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div>

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                    required
                                />

                            </div>


                            {/* SHIFT */}

                            <div>

                                <label>
                                    Shift
                                </label>

                                <select
                                    name="shift"
                                    value={
                                        form.shift
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Shift
                                    </option>

                                    <option value="MORNING">
                                        Morning
                                    </option>

                                    <option value="EVENING">
                                        Evening
                                    </option>

                                    <option value="NIGHT">
                                        Night
                                    </option>

                                </select>

                            </div>


                            {/* DEPARTMENT */}

                            <div>

                                <label>
                                    Department
                                </label>

                                <select
                                    name="departmentId"
                                    value={
                                        form.departmentId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map(
                                        (department) => (

                                            <option
                                                key={
                                                    department.departmentId
                                                }
                                                value={
                                                    department.departmentId
                                                }
                                            >

                                                {
                                                    department.departmentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </>

                    )}


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="success-message">

                            {message}

                        </div>

                    )}


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="error-message">

                            {error}

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Create Account
                    </button>

                </form>

            </div>


            {/* EXISTING USERS */}

            <div className="table-card">

                <h2>
                    Existing Users
                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                >
                                    No users found
                                </td>

                            </tr>

                        ) : (

                            users.map(
                                (u) => (

                                    <tr
                                        key={
                                            u.userId
                                        }
                                    >

                                        <td>
                                            {
                                                u.fullName
                                            }
                                        </td>

                                        <td>
                                            {
                                                u.email
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className="role-badge"
                                            >
                                                {
                                                    u.role
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default StaffList;