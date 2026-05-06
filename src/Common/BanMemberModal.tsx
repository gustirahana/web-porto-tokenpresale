import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface BanMemberModalProps {
    show: boolean;
    member: {
        id: string;
        username: string;
        banned: number;
    };
    onClose: () => void;
    onConfirm: () => Promise<{ success: boolean; message?: string }>;
}

const BanMemberModal = ({ show, member, onClose, onConfirm }: BanMemberModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const isBanned = member?.banned === 1;

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const response = await onConfirm();

            if (response.success) {
                toast.success(response.message || `User ${isBanned ? 'unbanned' : 'banned'} successfully`);
                onClose();
            } else {
                toast.error(response.message || `Failed to ${isBanned ? 'unban' : 'ban'} user`);
            }
        } catch (error) {
            console.error('Ban/Unban error:', error);
            toast.error(error.response?.data?.message ||
                error.message ||
                `Failed to ${isBanned ? 'unban' : 'ban'} user`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isBanned ? 'Unban User' : 'Ban User'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to {isBanned ? 'unban' : 'ban'} <strong>{member?.username}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
                    Cancel
                </Button>
                <Button
                    variant={isBanned ? 'success' : 'danger'}
                    onClick={handleConfirm}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : isBanned ? 'Unban User' : 'Ban User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BanMemberModal;