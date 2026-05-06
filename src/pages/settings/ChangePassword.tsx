import React, { useState } from "react";
import { Card, Button, InputGroup, Spinner, Modal } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import BreadcrumbItem from "@Common/BreadcrumbItem";
import Network from "../../utils/Network";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields", { position: "top-center", autoClose: 1000 });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match", { position: "top-center", autoClose: 1000 });
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long", { position: "top-center", autoClose: 1000 });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmChangePassword = async () => {
        setShowConfirmModal(false);
        setIsChangingPassword(true);
        try {
            const userId = localStorage.getItem('user');
            if (!userId) throw new Error('User ID not found');

            await Network.post(`/users/${userId}/update-password`, {
                password,
                newPassword,
                confirmNewPassword: confirmPassword,
            });

            toast.success("Password changed successfully!", { position: "top-center", autoClose: 1000 });

            setPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => { navigate("/settings"); }, 500);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to change password";
            toast.error(errorMessage, { position: "top-center", autoClose: 1000 });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const eyeButtonStyle = {
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid var(--sp-border-glass)',
        borderLeft: 'none',
        color: 'var(--sp-text-muted)',
        borderRadius: '0 6px 6px 0'
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Change Password" />

            <div className="dapp-container-narrow">
                <Card className="card-glass sp-animate-in">
                    <Card.Header className="border-0">
                        <div className="d-flex align-items-center gap-2">
                            <FaLock style={{ color: 'var(--sp-accent-purple-light)' }} />
                            <h5 className="mb-0 sp-text-primary fw-bold">Change Password</h5>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={handleChangePassword}>
                            {/* Current Password */}
                            <div className="mb-4">
                                <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                    Current Password
                                </label>
                                <InputGroup className="input-group-dark">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        disabled={isChangingPassword}
                                        required
                                        className="form-control input-dark"
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isChangingPassword}
                                        type="button"
                                        style={eyeButtonStyle}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </InputGroup>
                            </div>

                            {/* New Password */}
                            <div className="mb-4">
                                <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                    New Password
                                </label>
                                <InputGroup className="input-group-dark">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        disabled={isChangingPassword}
                                        required
                                        className="form-control input-dark"
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={isChangingPassword}
                                        type="button"
                                        style={eyeButtonStyle}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </InputGroup>
                            </div>

                            {/* Confirm New Password */}
                            <div className="mb-4">
                                <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                    Confirm New Password
                                </label>
                                <InputGroup className="input-group-dark">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        disabled={isChangingPassword}
                                        required
                                        className="form-control input-dark"
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isChangingPassword}
                                        type="button"
                                        style={eyeButtonStyle}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </InputGroup>
                            </div>

                            <Button
                                type="submit"
                                className="btn-gradient w-100 py-3"
                                disabled={isChangingPassword || !password || !newPassword || !confirmPassword}
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Changing Password...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </Button>
                        </form>
                    </Card.Body>
                </Card>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered dialogClassName="modal-glass">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="sp-text-secondary">Are you sure you want to change your password?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn-gradient-outline"
                        onClick={() => setShowConfirmModal(false)}
                        disabled={isChangingPassword}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="btn-gradient"
                        onClick={handleConfirmChangePassword}
                        disabled={isChangingPassword}
                    >
                        {isChangingPassword ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Processing...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default ChangePassword;
