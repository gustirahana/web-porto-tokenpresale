import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '@toolkit/auth/thunks.ts';
import authlogin from '@assets/images/logo.png';
import { FaEye, FaEyeSlash, FaFlask } from 'react-icons/fa';

// ── Demo credentials (shown on login page in mock mode) ──────
const DEMO_USERNAME = 'demotrader';
const DEMO_PASSWORD = 'demo1234';
const IS_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const LoginV1 = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await dispatch(login({
                username: credentials.username,
                password: credentials.password,
                platform: 'web'
            }));
            navigate('/presale');
        } catch (err) {
            console.log(err)
            setError((err as Error)?.message || String(err) || 'Login failed');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleUseDemoAccount = () => {
        setCredentials({ username: DEMO_USERNAME, password: DEMO_PASSWORD });
    };

    return (
        <div className="sp-login-bg" style={{ minHeight: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="sp-login-card card-glass" style={{ maxWidth: 440, width: '100%' }}>
                <Card.Body style={{ padding: '2.5rem' }}>
                    <div className="text-center mb-4" style={{ textAlign: 'center' }}>
                        <img
                            src={authlogin}
                            alt="SP ADST"
                            style={{ maxWidth: 120, display: 'block', margin: '0 auto 1rem' }}
                            className="img-fluid mb-3"
                        />
                        <h4 className="sp-text-primary fw-bold mb-1" style={{ textAlign: 'center' }}>Welcome Back</h4>
                        <p className="sp-text-muted mb-0" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                            Sign in to your SP ADST account
                        </p>
                    </div>

                    {/* ── Demo Mode Banner ── */}
                    {IS_MOCK && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(124, 60, 245, 0.15), rgba(0, 242, 254, 0.08))',
                            border: '1px solid rgba(124, 60, 245, 0.35)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            marginBottom: '1.25rem',
                        }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaFlask style={{ color: '#00f2fe', fontSize: '0.85rem' }} />
                                <span style={{ color: '#00f2fe', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Demo Mode
                                </span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                                This is a portfolio demo — use the demo account below to explore the app.
                            </p>
                            <div style={{
                                background: 'rgba(0,0,0,0.25)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                marginTop: '10px',
                                fontFamily: 'monospace',
                                fontSize: '0.82rem',
                                color: '#e2e8f0',
                            }}>
                                <div><span style={{ color: '#94a3b8' }}>username: </span><strong>{DEMO_USERNAME}</strong></div>
                                <div><span style={{ color: '#94a3b8' }}>password: </span><strong>{DEMO_PASSWORD}</strong></div>
                            </div>
                            <button
                                type="button"
                                onClick={handleUseDemoAccount}
                                style={{
                                    marginTop: '10px',
                                    width: '100%',
                                    padding: '7px',
                                    background: 'linear-gradient(135deg, rgba(124,60,245,0.3), rgba(0,242,254,0.2))',
                                    border: '1px solid rgba(124,60,245,0.5)',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,60,245,0.5), rgba(0,242,254,0.3))')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,60,245,0.3), rgba(0,242,254,0.2))')}
                            >
                                ⚡ Use Demo Account
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Wallet Address (SOL)
                            </label>
                            <input
                                type="text"
                                className="form-control input-dark"
                                name="username"
                                placeholder="Enter your Solana wallet address"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Password
                            </label>
                            <InputGroup className="input-group-dark">
                                <FormControl
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                    className="input-dark"
                                    style={{ borderRight: 'none' }}
                                />
                                <Button
                                    variant="link"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid var(--sp-border-glass)',
                                        borderLeft: 'none',
                                        color: 'var(--sp-text-muted)',
                                        borderRadius: '0 6px 6px 0'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </div>
                        <div className="text-end mb-3">
                            <Link
                                to="/forgot-password"
                                className="text-decoration-none"
                                style={{ color: 'var(--sp-accent-purple-light)', fontSize: '0.85rem' }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        {error && (
                            <div className="alert-glass p-3 mb-3" style={{ borderRadius: '10px' }}>
                                {error}
                            </div>
                        )}
                        <div className="d-grid mt-4" style={{ textAlign: 'center' }}>
                            <button type="submit" className="btn btn-gradient py-3" style={{ width: '100%' }}>
                                Sign In
                            </button>
                        </div>
                        <div className="text-center mt-4" style={{ textAlign: 'center' }}>
                            <span className="sp-text-muted" style={{ fontSize: '0.9rem' }}>
                                Don't have an account?{' '}
                            </span>
                            <Link
                                to="/register"
                                className="fw-semibold text-decoration-none"
                                style={{ color: 'var(--sp-accent-purple-light)' }}
                            >
                                Register here
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </div>

            <div style={{
                position: 'fixed',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1
            }}>
                <p className="sp-text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    &copy; SP ADST 2025
                </p>
            </div>
        </div>
    );
};

export default LoginV1;