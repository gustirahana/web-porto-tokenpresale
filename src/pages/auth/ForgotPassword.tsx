import React, { useState } from 'react';
import { Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authlogin from '@assets/images/logo.png';
import Network from '../../utils/Network';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLinkSent, setIsLinkSent] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email', { position: 'top-center', autoClose: 1000 });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        setShowConfirmModal(false);
        setIsProcessing(true);

        try {
            await Network.post('/auth/send-password-reset', {
                email: email.trim(),
            });

            toast.success('Reset link has been sent to your email', { position: 'top-center', autoClose: 1000 });
            setIsLinkSent(true);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send reset link';
            toast.error(errorMessage, { position: 'top-center', autoClose: 1000 });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="sp-login-bg d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative' }}>
            <div className="sp-login-card card-glass" style={{ maxWidth: 460, width: '100%', margin: '0 20px', zIndex: 10 }}>
                <Card.Body style={{ padding: '2.5rem' }}>
                    <div className="text-center mb-4">
                        <img src={authlogin} alt="SP ADST" style={{ maxWidth: 120 }} className="img-fluid mb-3" />
                        <h4 className="sp-text-primary fw-bold mb-1">Forgot Password</h4>
                        <p className="sp-text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            {!isLinkSent ? 'Enter your email to reset your password' : 'Check your inbox for the reset link'}
                        </p>
                    </div>

                    {!isLinkSent ? (
                        <form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                    Registered Email Address
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    className="input-dark"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isProcessing}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid mt-4">
                                <Button
                                    type="submit"
                                    className="btn btn-gradient py-3"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>
                            </div>

                            <div className="text-center mt-4">
                                <span className="sp-text-muted" style={{ fontSize: '0.9rem' }}>Remember your password? </span>
                                <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--sp-accent-purple-light)' }}>
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="p-4 mb-4" style={{ background: 'rgba(30, 64, 175, 0.08)', border: '1px solid rgba(30, 64, 175, 0.2)', borderRadius: '12px' }}>
                                <p className="mb-2 sp-text-secondary" style={{ fontSize: '0.9rem' }}>Reset link sent to:</p>
                                <h5 className="sp-text-primary fw-bold mb-0" style={{ wordBreak: 'break-all' }}>{email}</h5>
                            </div>
                            <Button className="btn btn-gradient-outline w-100 py-3" onClick={handleBackToLogin}>
                                Back to Login
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </div>

            <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                <p className="sp-text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    &copy; SP ADST 2025
                </p>
            </div>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered dialogClassName="modal-glass">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="sp-text-primary fw-bold">Confirm Reset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="sp-text-secondary mb-0">
                        Are you sure you want to send a password reset link to <strong className="sp-text-primary">{email}</strong>?
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button className="btn-gradient-outline" onClick={() => setShowConfirmModal(false)} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button className="btn-gradient-green" onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Sending...
                            </>
                        ) : (
                            'Confirm Send'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ForgotPassword;


