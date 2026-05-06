import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card, Button, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authlogin from '@assets/images/logo.png';
import { registerUser } from '@toolkit/register/thunks';
import { RootState } from '../../store';

const initialFormState = {
    username: '',
    firstName: '',
    password: '',
    email: '',
    confirmPassword: '',
    referral: '',
};

const Register = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoading, error, isSuccess } = useSelector((state: RootState) => state.registration);
    const [formData, setFormData] = useState(initialFormState);
    const [localError, setLocalError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isReferralLocked, setIsReferralLocked] = useState(false);

    useEffect(() => {
        const referralParam = searchParams.get('reff');
        if (referralParam) {
            setFormData((prev) => ({ ...prev, referral: referralParam }));
            setIsReferralLocked(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Registrasi berhasil! Mengarahkan ke halaman login...', {
                position: 'top-center',
                autoClose: 1000,
            });
            setTimeout(() => {
                navigate('/login');
            }, 1100);
        }
    }, [isSuccess, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // Prevent spaces in firstName field
        const processedValue = name === 'firstName' ? value.replace(/\s/g, '') : value;
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalError(null);

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Password dan konfirmasi password harus sama.');
            return;
        }

        try {
            await dispatch(registerUser(formData));
        } catch (err) {
            // error state handled via redux
        }
    };

    return (
        <div className="sp-login-bg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <div className="sp-login-card card-glass" style={{ maxWidth: 480, width: '100%', margin: '0 20px', zIndex: 2 }}>
                <Card.Body style={{ padding: '2.5rem' }}>
                    <div className="text-center mb-4">
                        <img src={authlogin} alt="register" style={{ maxWidth: 120 }} className="img-fluid mb-3" />
                        <h4 className="sp-text-primary fw-bold mb-1">Create Account</h4>
                        <p className="sp-text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Join the SP ADST Ecosystem
                        </p>
                    </div>

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
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <div className="mt-1" style={{ fontSize: '0.75rem', color: 'var(--sp-accent-red)' }}>
                                Please make sure to use a valid Solana wallet address. Transactions will fail if an invalid address is provided.
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Nickname
                            </label>
                            <input
                                type="text"
                                className="form-control input-dark"
                                name="firstName"
                                placeholder="Enter your nickname"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control input-dark"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-dark"
                                    style={{ borderRight: 'none' }}
                                />
                                <Button
                                    variant="link"
                                    onClick={() => setShowPassword(!showPassword)}
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

                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Confirm Password
                            </label>
                            <InputGroup className="input-group-dark">
                                <FormControl
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="input-dark"
                                    style={{ borderRight: 'none' }}
                                />
                                <Button
                                    variant="link"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid var(--sp-border-glass)',
                                        borderLeft: 'none',
                                        color: 'var(--sp-text-muted)',
                                        borderRadius: '0 6px 6px 0'
                                    }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                            </InputGroup>
                        </div>

                        <div className="mb-3">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                Referral Code
                            </label>
                            <input
                                type="text"
                                className="form-control input-dark"
                                name="referral"
                                placeholder="Enter referral code (optional)"
                                value={formData.referral}
                                onChange={handleChange}
                                readOnly={isReferralLocked}
                                disabled={isReferralLocked}
                                style={isReferralLocked ? { opacity: 0.6 } : {}}
                            />
                        </div>

                        {localError && (
                            <div className="alert-glass p-3 mb-3" style={{ borderRadius: '10px' }}>
                                {localError}
                            </div>
                        )}
                        {error && (
                            <div className="alert-glass p-3 mb-3" style={{ borderRadius: '10px' }}>
                                {error}
                            </div>
                        )}
                        {isSuccess && (
                            <div className="alert-glass-success p-3 mb-3" style={{ borderRadius: '10px' }}>
                                Registration successful! Redirecting to login...
                            </div>
                        )}

                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-gradient py-3" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <span className="sp-text-muted" style={{ fontSize: '0.9rem' }}>
                                Already have an account?{' '}
                            </span>
                            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--sp-accent-purple-light)' }}>
                                Login here
                            </Link>
                        </div>
                    </form>
                </Card.Body>
            </div>

            <div style={{ position: 'fixed', bottom: 16, zIndex: 1 }}>
                <p className="sp-text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    &copy; SP ADST 2025
                </p>
            </div>
        </div>
    );
};

export default Register;

