import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        // Checking to make sure all fields have been filled out
        if (!email || !password) {
            setError('All fields are required');
            return;
        }

        const userData = { email, password };
        axios
            .post('http://localhost:3001/login', userData)
            .then((res) => {
                if (res.status === 200) {
                    // Login successful, navigate to the home page
                    console.log(res.data.handle);
                    navigate(`/profile/${res.data.handle}`);
                } else {
                    // Login failed, display error message
                    setError('Incorrect email or password');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="LoginWindow">
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
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
