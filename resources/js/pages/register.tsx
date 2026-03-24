import { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { validateRegister } from '../validations/authValidation';
import '../styles/style.css';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setErrors((prev: any) => ({ ...prev, [name]: null }));

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (loading) return;

        const validationErrors = validateRegister(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await axios.post('/register', form, {
                withCredentials: true,
            });

            toast.success('Registration successful!');

            window.location.href = '/login';

        } catch (error: any) {
            console.log(error.response?.data); 

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                toast.error('Validation failed!');
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    const getError = (field: string) => {
        if (!errors[field]) return null;
        return Array.isArray(errors[field]) ? errors[field][0] : errors[field];
    };

    return (
        <div className="auth-container">
            <Toaster position="top-right" />

            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>

               
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />
                {getError('name') && <p className="error">{getError('name')}</p>}

              
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                {getError('email') && <p className="error">{getError('email')}</p>}

                
                <div className="password-field">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <span
                        className="toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                {getError('password') && (
                    <p className="error">{getError('password')}</p>
                )}

                <small className="hint">
                    Must include: 1 uppercase, 1 number, 1 special character (@$!%*?&)
                </small>

                <div className="password-field">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        placeholder="Confirm Password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                    />
                    <span
                        className="toggle"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                {getError('password_confirmation') && (
                    <p className="error">
                        {getError('password_confirmation')}
                    </p>
                )}

                <button disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="switch-link">
                    Already have an account? <Link href="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}