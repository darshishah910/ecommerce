import { useState } from 'react';
import api from '@/lib/axios';
import '../styles/style.css';
import { validateLogin } from '../validations/loginValidation'
import toast, { Toaster } from 'react-hot-toast';
import '../styles/style.css'

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);



    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });

        setErrors((prev: any) => ({
            ...prev,
            [name]: null
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        console.log("Submit clicked");

        if (loading) return;

        const validationErrors = validateLogin(form);
        console.log("Validation:", validationErrors);


        if (validationErrors && Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            console.log("Calling API...");

            const res = await api.post('/login', form, {
                withCredentials: true,
            });

            console.log("API Response:", res.data);


            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.data.user));

            toast.success('Login successful ');

            setTimeout(() => {
                window.location.href = '/products';
            }, 800);

        } catch (error: any) {
            console.log("API Error:", error?.response);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 401) {
                toast.error('Invalid credentials');
            } else {
                toast.error('Login failed');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Toaster position="top-right" />

            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                {errors.email && (
                    <p className="error">
                        {Array.isArray(errors.email)
                            ? errors.email[0]
                            : errors.email}
                    </p>
                )}


                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <span
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>

                {errors.password && (
                    <p className="error">
                        {Array.isArray(errors.password)
                            ? errors.password[0]
                            : errors.password}
                    </p>
                )}


                <button type='submit' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>


                <p className="switch-link">
                    Don’t have an account?{' '}
                    <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
}