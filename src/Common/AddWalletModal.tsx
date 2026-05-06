import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface AddWalletModalProps {
    show: boolean;
    member: any;
    onClose: () => void;
    onSave: (amountToAdd: string, notes: string) => Promise<{ success: boolean, message?: string }>;
}

const AddWalletModal = ({ show, member, onClose, onSave }: AddWalletModalProps) => {
    const [amountToAdd, setAmountToAdd] = useState('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const currentBalance = member?.balance;

    const handleClose = () => {
        setAmountToAdd('');
        setNotes('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!amountToAdd) {
            toast.error('Amount is required');
            return;
        }

        if (!notes) {
            toast.error('Notes are required');
            return;
        }

        const amount = Number(amountToAdd);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid positive number');
            return;
        }

        setIsSaving(true);
        try {
            const result = await onSave(amountToAdd, notes);
            if (result.success) {
                toast.success(result.message || `Successfully added ${amountToAdd} USDT`);
                handleClose();
            } else {
                toast.error(result.message || 'Failed to add balance');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add balance');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Wallet Balance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={member?.username || ''}
                        readOnly
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Current Balance</Form.Label>
                    <Form.Control
                        type="text"
                        value={`${currentBalance} USDT`}
                        readOnly
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Amount to Add (USDT)</Form.Label>
                    <Form.Control
                        type="number"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="Enter amount to add"
                        step="0.01"
                        min="0.01"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter Notes"
                        required
                    />
                    <Form.Text className="text-muted">
                        Please provide details about this transaction
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSaving || !amountToAdd || !notes}
                >
                    {isSaving ? 'Adding...' : 'Add Balance'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddWalletModal;