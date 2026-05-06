import React, { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Form, Button, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Clock, Wallet, History, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import BreadcrumbItem from '@Common/BreadcrumbItem';
import { fetchWithdrawals, withdrawTokens } from '@toolkit/withdrawal/thunks';
import { RootState } from '../../store';
import Network from '../../utils/Network';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const WITHDRAWAL_ENABLED_DATE = dayjs('2026-05-01');
const TIER_COLORS: Record<string, string> = {
    Whale: '#00D4FF', Shark: '#00FF88', Dolphin: '#f59e0b', Fish: '#a855f7', Shrimp: '#6b7280',
};
const TIER_EMOJI: Record<string, string> = {
    Whale: '🐋', Shark: '🦈', Dolphin: '🐬', Fish: '🐟', Shrimp: '🦐',
};

interface WithdrawalStatus {
    isEnabled: boolean;
    enabledDate: string;
    spadstBalance: number;
    presaleTier: { name: string; maxWithdrawPerSession: number; maxWithdrawsPerWeek: number; withdrawsUsedThisWeek: number; remainingWithdrawals: number; nextResetDate: string };
    sProjectRank: { name: string; maxWithdrawPerSession: number };
    walletAddress: string;
    platformFeePercent: number;
}

const fmt = (n: number) => n.toLocaleString('en-US');

const useCountdown = (targetDate: dayjs.Dayjs) => {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const tick = () => {
            const diff = targetDate.diff(dayjs());
            if (diff <= 0) { setTimeLeft(''); return; }
            const d = dayjs.duration(diff);
            setTimeLeft(`${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
};

const Withdrawal = () => {
    const dispatch = useDispatch<any>();
    const { pendingWithdrawals, completedWithdrawals, rejectedWithdrawals, isLoading, isWithdrawing } = useSelector((s: RootState) => s.withdrawal);

    const [status, setStatus] = useState<WithdrawalStatus | null>(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'rejected'>('pending');

    const isEnabled = dayjs().isAfter(WITHDRAWAL_ENABLED_DATE);
    const countdown = useCountdown(WITHDRAWAL_ENABLED_DATE);

    useEffect(() => {
        const userId = localStorage.getItem('user');
        if (!userId) return;
        Network.get(`/users/${userId}/withdrawal-status`)
            .then(res => setStatus(res.data || res))
            .catch(() => {})
            .finally(() => setStatusLoading(false));
        dispatch(fetchWithdrawals({ page: 1, perPage: 10, status: 0 }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchWithdrawals({ page: 1, perPage: 10, status: activeTab === 'pending' ? 0 : activeTab === 'completed' ? 1 : 2 }));
    }, [activeTab, dispatch]);

    const amountNum = parseFloat(amount) || 0;
    const fee = status ? Math.round(amountNum * (status.platformFeePercent / 100) * 100) / 100 : 0;
    const netAmount = amountNum - fee;
    const maxAmount = status?.presaleTier?.maxWithdrawPerSession || 0;

    const tierColor = status?.presaleTier?.name ? TIER_COLORS[status.presaleTier.name] : 'var(--sp-accent-cyan)';

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEnabled) return;
        if (amountNum <= 0 || amountNum > maxAmount) {
            toast.error(`Amount must be between 1 and ${maxAmount} SPADST`);
            return;
        }
        try {
            await dispatch(withdrawTokens({ amount: amountNum }));
            toast.success('Withdrawal request submitted!');
            setAmount('');
            dispatch(fetchWithdrawals({ page: 1, perPage: 10, status: 0 }));
        } catch {
            toast.error('Withdrawal failed. Please try again.');
        }
    };

    const getStatusBadge = (s: string) => {
        const map: Record<string, { color: string; bg: string }> = {
            pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
            completed: { color: '#00FF88', bg: 'rgba(0,255,136,0.15)' },
            rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
        };
        const c = map[s] || map.pending;
        return <Badge style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}40`, fontSize: '0.7rem' }}>{s.toUpperCase()}</Badge>;
    };

    const currentList = activeTab === 'pending' ? pendingWithdrawals : activeTab === 'completed' ? completedWithdrawals : rejectedWithdrawals;

    return (
        <React.Fragment>
            <Helmet><title>Withdrawal — SP ADST</title></Helmet>
            <BreadcrumbItem mainTitle="Withdrawal" />

            <div className="dapp-container" style={{ maxWidth: 760 }}>
                {/* Countdown Banner (if not enabled) */}
                {!isEnabled && countdown && (
                    <Card className="mb-4 sp-animate-in text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                        <Card.Body className="p-4">
                            <Clock size={32} style={{ color: '#f59e0b' }} className="mb-2" />
                            <p className="sp-text-muted mb-1" style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Withdrawal Opens In</p>
                            <h2 className="fw-bold mb-1" style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{countdown}</h2>
                            <p className="sp-text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                Available from {WITHDRAWAL_ENABLED_DATE.format('DD MMMM YYYY')}
                            </p>
                        </Card.Body>
                    </Card>
                )}

                {/* User Tier Info Card */}
                {statusLoading ? (
                    <div className="text-center py-3"><Spinner animation="border" style={{ color: 'var(--sp-accent-cyan)' }} /></div>
                ) : status && status.presaleTier && (
                    <Card className="card-glass mb-4 sp-animate-in-delay-1" style={{ borderColor: `${tierColor}40` }}>
                        <Card.Body className="p-4">
                            <h6 className="sp-text-muted fw-bold mb-3" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Withdrawal Limits</h6>
                            <div className="row g-3">
                                <div className="col-6 col-md-3 text-center">
                                    <p className="sp-text-muted mb-1" style={{ fontSize: '0.7rem' }}>BALANCE</p>
                                    <p className="fw-bold sp-text-primary mb-0" style={{ fontSize: '0.95rem' }}>{fmt(status.spadstBalance)}</p>
                                    <small className="sp-text-muted">SPADST</small>
                                </div>
                                <div className="col-6 col-md-3 text-center">
                                    <p className="sp-text-muted mb-1" style={{ fontSize: '0.7rem' }}>TIER</p>
                                    <Badge style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}50` }}>
                                        {TIER_EMOJI[status.presaleTier?.name ?? ''] ?? ''} {status.presaleTier?.name ?? '—'}
                                    </Badge>
                                </div>
                                <div className="col-6 col-md-3 text-center">
                                    <p className="sp-text-muted mb-1" style={{ fontSize: '0.7rem' }}>MAX / SESSION</p>
                                    <p className="fw-bold mb-0" style={{ color: tierColor, fontSize: '0.95rem' }}>{maxAmount} SPADST</p>
                                </div>
                                <div className="col-6 col-md-3 text-center">
                                    <p className="sp-text-muted mb-1" style={{ fontSize: '0.7rem' }}>THIS WEEK</p>
                                    <p className="fw-bold sp-text-primary mb-0" style={{ fontSize: '0.95rem' }}>
                                        {status.presaleTier?.remainingWithdrawals ?? '—'}/{status.presaleTier?.maxWithdrawsPerWeek ?? '—'}
                                    </p>
                                    <small className="sp-text-muted">remaining</small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Withdrawal Form */}
                <Card className="card-glass mb-4 sp-animate-in-delay-2" style={{ position: 'relative', overflow: 'hidden' }}>
                    {!isEnabled && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                            <Lock size={32} style={{ color: '#f59e0b' }} />
                            <p className="fw-bold mb-0" style={{ color: '#f59e0b' }}>Locked until 1 May 2026</p>
                        </div>
                    )}
                    <Card.Body className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Wallet size={16} style={{ color: 'var(--sp-accent-cyan)' }} />
                            <h6 className="sp-text-primary fw-bold mb-0">Submit Withdrawal</h6>
                        </div>
                        <Form onSubmit={handleWithdraw}>
                            {/* Wallet display */}
                            {status?.walletAddress && (
                                <Form.Group className="mb-3">
                                    <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Receiving Wallet (Solana)</Form.Label>
                                    <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sp-border-glass)', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--sp-text-secondary)' }}>
                                        {status.walletAddress}
                                    </div>
                                </Form.Group>
                            )}
                            <Form.Group className="mb-2">
                                <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>
                                    Amount (SPADST) — Max: {maxAmount}
                                </Form.Label>
                                <Form.Control
                                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                    placeholder={`Enter amount (max ${maxAmount} SPADST)`}
                                    min={1} max={maxAmount} disabled={!isEnabled || isWithdrawing}
                                    className="input-dark"
                                />
                            </Form.Group>
                            {amountNum > 0 && (
                                <div className="mb-3 p-3 rounded" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="sp-text-muted" style={{ fontSize: '0.8rem' }}>Requested</span>
                                        <span className="sp-text-secondary" style={{ fontSize: '0.8rem' }}>{amountNum} SPADST</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="sp-text-muted" style={{ fontSize: '0.8rem' }}>Platform fee ({status?.platformFeePercent || 10}%)</span>
                                        <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>- {fee} SPADST</span>
                                    </div>
                                    <div className="d-flex justify-content-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                                        <span className="fw-bold sp-text-primary" style={{ fontSize: '0.9rem' }}>You receive</span>
                                        <span className="fw-bold" style={{ color: '#00FF88', fontSize: '0.9rem' }}>{netAmount.toFixed(2)} SPADST</span>
                                    </div>
                                </div>
                            )}
                            <Button type="submit" className="btn-gradient w-100 py-3" disabled={!isEnabled || isWithdrawing || amountNum <= 0 || amountNum > maxAmount}>
                                {isWithdrawing ? <><Spinner animation="border" size="sm" className="me-2" />Processing...</> : isEnabled ? 'Submit Withdrawal' : 'Locked'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Withdrawal History */}
                <Card className="card-glass sp-animate-in-delay-3">
                    <Card.Body className="p-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <History size={16} style={{ color: 'var(--sp-accent-cyan)' }} />
                            <h6 className="sp-text-primary fw-bold mb-0">Withdrawal History</h6>
                        </div>
                        <div className="d-flex gap-2 mb-3">
                            {(['pending', 'completed', 'rejected'] as const).map(tab => (
                                <button key={tab} className={`tab-chip ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        {isLoading ? <div className="text-center py-3"><Spinner animation="border" size="sm" style={{ color: 'var(--sp-accent-cyan)' }} /></div> : (
                            <div className="table-responsive">
                                <Table className="table-sp mb-0">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Tx</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentList.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center sp-text-muted py-4">No {activeTab} withdrawals</td></tr>
                                        ) : currentList.map((w: any) => (
                                            <tr key={w.id}>
                                                <td className="sp-text-secondary" style={{ fontSize: '0.8rem' }}>{dayjs(w.date_created).format('DD MMM YYYY')}</td>
                                                <td className="fw-bold sp-text-primary">{fmt(w.amount)} SPADST</td>
                                                <td>{getStatusBadge(w.status)}</td>
                                                <td>
                                                    {w.txHash ? (
                                                        <a href={`https://solscan.io/tx/${w.txHash}`} target="_blank" rel="noreferrer" style={{ color: 'var(--sp-accent-cyan)', fontSize: '0.8rem' }}>
                                                            View <ExternalLink size={11} style={{ marginLeft: 2 }} />
                                                        </a>
                                                    ) : <span className="sp-text-muted" style={{ fontSize: '0.75rem' }}>—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    );
};

export default Withdrawal;
