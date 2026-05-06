import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface EditProfileModalProps {
    show: boolean;
    member: any;
    onClose: () => void;
    onSave: (data: { walletAddress?: string, firstName?: string, lastName?: string }) => Promise<{ success: boolean, message?: string }>;
}

const EditProfileModal = ({ show, member, onClose, onSave }: EditProfileModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (member) {
            setFirstName(member.firstName || '');
            setLastName(member.lastName || '');
            setWalletAddress(member.walletAddress || '');
        }
    }, [member]);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const updateData: { walletAddress?: string, firstName?: string, lastName?: string } = {};

            // Only include changed fields
            if (firstName !== member.firstName) updateData.firstName = firstName;
            if (lastName !== member.lastName) updateData.lastName = lastName;
            if (walletAddress !== member.walletAddress) updateData.walletAddress = walletAddress;

            console.log('EditProfileModal - updateData:', updateData);
            console.log('EditProfileModal - walletAddress:', walletAddress);
            console.log('EditProfileModal - member.walletAddress:', member.walletAddress);

            // Don't send request if nothing changed
            if (Object.keys(updateData).length === 0) {
                toast.info('No changes detected');
                onClose();
                return;
            }

            const result = await onSave(updateData);
            if (result.success) {
                toast.success(result.message || 'Profile updated successfully');
                onClose();
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter Nickname"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Wallet Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="wallet address"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProfileModal;