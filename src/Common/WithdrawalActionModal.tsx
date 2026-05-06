import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface WithdrawalActionModalProps {
    show: boolean;
    withdrawal: any;
    action: 'approve' | 'decline';
    onClose: () => void;
    onConfirm: (date: string, wallet: string) => Promise<{ success: boolean, message?: string }>;
}

const WithdrawalActionModal = ({ show, withdrawal, action, onClose, onConfirm }: WithdrawalActionModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const isApprove = action === 'approve';
    const title = isApprove ? 'Approve Withdrawal' : 'Decline Withdrawal';
    const confirmText = isApprove ? 'Approve' : 'Decline';
    const confirmVariant = isApprove ? 'success' : 'danger';
    const confirmIcon = isApprove ? 'ph-check' : 'ph-x';

    const handleSubmit = async () => {
        if (!withdrawal?.date || !withdrawal?.wallet) {
            toast.error('Invalid withdrawal data');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await onConfirm(withdrawal.date, withdrawal.wallet);
            if (result.success) {
                toast.success(result.message || `${confirmText} successful`);
                onClose();
            } else {
                toast.error(result.message || `Failed to ${confirmText.toLowerCase()}`);
            }
        } catch (error: any) {
            toast.error(error.message || `Failed to ${confirmText.toLowerCase()}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (!isProcessing) {
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop={isProcessing ? 'static' : true}>
            <Modal.Header closeButton={!isProcessing}>
                <Modal.Title>
                    <i className={`ph-duotone ${confirmIcon} me-2`}></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <h5>Do you want to {isApprove ? 'approve' : 'decline'} this withdrawal?</h5>
                    
                    {withdrawal && (
                        <div className="mt-3">
                            <p><strong>Amount:</strong> {withdrawal.amount ? `${parseFloat(withdrawal.amount).toLocaleString()} $AB Token` : 'N/A'}</p>
                            <p><strong>Wallet:</strong> {withdrawal.wallet || 'N/A'}</p>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={handleClose}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
                <Button 
                    variant={confirmVariant} 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className={`ph-duotone ${confirmIcon} me-2`}></i>
                            {confirmText}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WithdrawalActionModal;
