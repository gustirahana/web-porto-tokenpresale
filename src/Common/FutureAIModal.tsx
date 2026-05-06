import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface FutureAIModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => Promise<{ success: boolean; message: string }>;
    member: any;
    isUpdating?: boolean;
}

const FutureAIModal: React.FC<FutureAIModalProps> = ({
    show,
    onClose,
    onConfirm,
    member,
    isUpdating = false
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Reset state when modal is closed
    const handleClose = () => {
        setIsLoading(false);
        onClose();
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        
        try {
            const response = await onConfirm();
            
            if (response.success) {
                toast.success(response.message || 'Future AI status updated successfully');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                toast.error(response.message || 'Failed to update Future AI status');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while updating Future AI status');
        } finally {
            setIsLoading(false);
        }
    };

    const isEnabled = member?.futureStatus === 1;
    const actionText = isEnabled ? 'Turn OFF' : 'Turn ON';

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="ph-duotone ph-robot me-2"></i>
                    Future AI Status
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>
                        Are you sure you want to <strong>{actionText}</strong> Future AI for user{' '}
                        <strong>{member?.username}</strong>?
                    </p>
                    <div className="alert alert-info">
                        <i className="ph-duotone ph-info me-2"></i>
                        <strong>Current Status:</strong> {isEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button 
                    variant={isEnabled ? 'danger' : 'success'} 
                    onClick={handleConfirm}
                    disabled={isLoading || isUpdating}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <i className={`ph-duotone ${isEnabled ? 'ph-power' : 'ph-power'} me-2`}></i>
                            {actionText}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FutureAIModal;
