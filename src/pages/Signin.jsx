// pages/Signin.jsx
import React, { useState } from 'react';
import InputField from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { LOGIN } from '../services/apiUrl';

const Signin = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await apiService({
                endpoint: LOGIN,
                method: 'POST',
                data: form,
            })
            alert('Sign in successful');
            await localStorage.setItem('token', res.token)
            await localStorage.setItem('userId', res?._id)

            navigate('/dashboard')
            localStorage.setItem("loginTime", Date.now());

            console.log(res.data);
        } catch (err) {
            alert('Invalid credentials');
            console.error(err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Sign In</h2>
            <form className="space-y-4" onSubmit={handleSignin}>
                <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                <InputField label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
                <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">{loading ? 'Loading...' : 'Sign In'}</button>
                <Link to="/signup" className="text-sm text-blue-600 hover:underline block mt-3">
                    You have not any Account Signup
                </Link>

            </form>
        </div>
    );
};

export default Signin;
