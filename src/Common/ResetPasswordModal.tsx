// components/ResetPasswordModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface ResetPasswordModalProps {
    show: boolean;
    member: {
        id: string;
        email: string;
    } | null;
    onClose: () => void;
    onConfirm: (memberId: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const ResetPasswordModal = ({ show, member, onClose, onConfirm }: ResetPasswordModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleConfirm = async () => {
        if (!password) {
            toast.error('Please enter a new password');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await onConfirm(member!.id, password);
            if (response.success) {
                toast.success(response.message || 'Password updated successfully');
                setPassword('');
                onClose();
            } else {
                toast.error(response.message || 'Failed to update password');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setShowPassword(false);
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Enter a new password for <strong>{member?.email}</strong>:</p>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            disabled={isProcessing}
                            autoComplete="new-password"
                        />
                        <InputGroup.Text 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={isProcessing || !password}
                >
                    {isProcessing ? 'Updating...' : 'Update Password'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResetPasswordModal;