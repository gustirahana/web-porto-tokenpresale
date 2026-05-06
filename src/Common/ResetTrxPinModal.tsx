// components/ResetTrxPinModal.tsx
import { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface ResetTrxPinModalProps {
    show: boolean;
    member: {
        id: string;
        email: string;
    } | null;
    onClose: () => void;
    onConfirm: (memberId: string, trxPin: string) => Promise<{ success: boolean; message?: string }>;
}

const ResetTrxPinModal = ({ show, member, onClose, onConfirm }: ResetTrxPinModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [trxPin, setTrxPin] = useState('');
    const [showPin, setShowPin] = useState(false);

    const handleConfirm = async () => {
        if (!trxPin) {
            toast.error('Please enter a TRX PIN');
            return;
        }

        if (!/^\d{6}$/.test(trxPin)) {
            toast.error('TRX PIN must be exactly 6 digits');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await onConfirm(member!.id, trxPin);
            if (response.success) {
                toast.success(response.message || 'TRX PIN updated successfully');
                setTrxPin('');
                onClose();
            } else {
                toast.error(response.message || 'Failed to update TRX PIN');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update TRX PIN');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setTrxPin('');
        setShowPin(false);
        onClose();
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setTrxPin(value);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Reset TRX PIN</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Enter a new 6-digit TRX PIN for <strong>{member?.email}</strong>:</p>
                <Form.Group className="mb-3">
                    <Form.Label>TRX PIN (6 digits)</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPin ? "text" : "password"}
                            value={trxPin}
                            onChange={handlePinChange}
                            placeholder="Enter 6-digit PIN"
                            disabled={isProcessing}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            autoComplete="off"
                        />
                        <InputGroup.Text 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPin(!showPin)}
                        >
                            <i className={`fas ${showPin ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Enter exactly 6 digits (0-9)
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={isProcessing || trxPin.length !== 6}
                >
                    {isProcessing ? 'Updating...' : 'Update TRX PIN'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResetTrxPinModal;
