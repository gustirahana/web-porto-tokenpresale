import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BreadcrumbItem from '@Common/BreadcrumbItem';
import { confirmDeposit } from '@toolkit/deposit/thunks';
import { fetchProfile } from '@toolkit/profile/thunks';
import { RootState } from '../../store';
import { FaCopy, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const Deposit = () => {
    const dispatch = useDispatch<any>();
    const { profile, isLoading: isProfileLoading, error: profileError } = useSelector(
        (state: RootState) => state.profile
    );
    const { isConfirming, error, successMessage } = useSelector(
        (state: RootState) => state.deposit
    );
    const [txHash, setTxHash] = useState('');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, { position: 'top-center', autoClose: 1000 });
            setTimeout(() => { window.location.reload(); }, 1000);
        }
    }, [successMessage]);

    const topupAddress = useMemo(() => {
        return profile?.settings?.depositAddress || '';
    }, [profile]);

    const qrCodeSrc = useMemo(() => {
        if (!topupAddress) return '';
        return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(topupAddress)}`;
    }, [topupAddress]);

    const handleCopy = async () => {
        if (!topupAddress) return;
        try {
            await navigator.clipboard.writeText(topupAddress);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!txHash) return;
        setShowConfirmModal(true);
    };

    const handleConfirmDeposit = async () => {
        setShowConfirmModal(false);
        await dispatch(confirmDeposit(txHash));
        setTxHash('');
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Deposit" />

            <div className="dapp-container">
                {/* QR Code & Address Card */}
                <Card className="card-glass mb-4 sp-animate-in">
                    <Card.Header className="border-0">
                        <h4 className="mb-0 sp-text-primary fw-bold">Topup Address</h4>
                    </Card.Header>
                    <Card.Body>
                        {(error || profileError) && (
                            <div className="alert-glass p-3 mb-3">{error || profileError}</div>
                        )}
                        {successMessage && (
                            <div className="alert-glass-success p-3 mb-3">{successMessage}</div>
                        )}

                        {/* QR Code */}
                        <div className="qr-container mb-4">
                            <span className="sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Scan QR Code
                            </span>
                            {isProfileLoading ? (
                                <Spinner animation="border" style={{ color: 'var(--sp-accent-purple-light)' }} />
                            ) : qrCodeSrc ? (
                                <div className="qr-image-wrap">
                                    <img src={qrCodeSrc} alt="Deposit QR Code" width={180} height={180} />
                                </div>
                            ) : (
                                <div className="sp-text-muted py-3">Address not available yet</div>
                            )}
                        </div>

                        {/* Address Copy */}
                        <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                            SOL Wallet Address
                        </label>
                        <InputGroup className="input-group-dark mb-3">
                            <Form.Control
                                value={topupAddress || 'Loading...'}
                                readOnly
                                className="input-dark"
                                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />
                            <Button
                                className={copyStatus === 'copied' ? 'btn-gradient-green' : 'btn-gradient-outline'}
                                onClick={handleCopy}
                                disabled={!topupAddress}
                                style={{ minWidth: 100 }}
                            >
                                {copyStatus === 'copied' ? (
                                    <><FaCheck className="me-1" /> Copied!</>
                                ) : (
                                    <><FaCopy className="me-1" /> Copy</>
                                )}
                            </Button>
                        </InputGroup>
                        {copyStatus === 'error' && (
                            <small style={{ color: 'var(--sp-accent-red)' }}>Unable to copy, please copy manually.</small>
                        )}

                        {/* Warning Box */}
                        <div className="alert-glass-warning p-3 mt-4 d-flex align-items-start gap-3">
                            <FaExclamationTriangle className="mt-1 flex-shrink-0" style={{ color: '#fbbf24', fontSize: '1.2rem' }} />
                            <div>
                                <p className="fw-bold mb-2" style={{ color: '#fbbf24' }}>SOLANA WALLET ONLY</p>
                                <ul className="mb-0 ps-3" style={{ fontSize: '0.85rem' }}>
                                    <li>Only send SOL to this address.</li>
                                    <li>Sending via other networks may result in permanent loss of funds.</li>
                                </ul>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Confirmation Card */}
                <Card className="card-glass sp-animate-in-delay-1">
                    <Card.Header className="border-0">
                        <h5 className="mb-0 sp-text-primary fw-bold">Confirmation</h5>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                    Input Transaction Signature
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Paste your transaction signature here"
                                    value={txHash}
                                    onChange={(e) => setTxHash(e.target.value)}
                                    required
                                    className="input-dark"
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="btn-gradient-green"
                                disabled={isConfirming || !txHash}
                            >
                                {isConfirming ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Deposit'
                                )}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            {/* Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered dialogClassName="modal-glass">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deposit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="sp-text-secondary">Do you want to confirm this deposit?</p>
                    <div className="p-3" style={{
                        background: 'rgba(30, 64, 175, 0.08)',
                        border: '1px solid rgba(30, 64, 175, 0.2)',
                        borderRadius: 'var(--sp-radius-sm)'
                    }}>
                        <p className="mb-0 sp-text-primary" style={{ wordBreak: 'break-all' }}>
                            <strong>TXID:</strong> {txHash}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-gradient-outline" onClick={() => setShowConfirmModal(false)} disabled={isConfirming}>
                        Cancel
                    </Button>
                    <Button className="btn-gradient-green" onClick={handleConfirmDeposit} disabled={isConfirming}>
                        {isConfirming ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Processing...
                            </>
                        ) : (
                            'Confirm Deposit'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Deposit;
