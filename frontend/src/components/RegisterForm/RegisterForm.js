import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [handle, setHandle] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        // Checking to make sure all fields have been filled out
        if (!email || !password || !handle || !username) {
            setError('All fields are required');
            return;
        }

        const userData = { email, password, handle, username };
        axios
            .post('http://localhost:3001/createUser', userData)
            .then((res) => {
                if (res.data.message === 'User created successfully') {
                    // Redirect to login page after successful registration
                    navigate('/login');
                } else {
                    setError('Failed to create user');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="RegisterWindow">
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <label>
                    Handle:
                    <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} />
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                {error && <p>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
