import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Form, InputGroup, Spinner, Row, Col, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
// CircleDot removed
import { useNavigate } from "react-router-dom";
import BreadcrumbItem from "@Common/BreadcrumbItem";
import { RootState } from "../../store";
import { fetchProfile, fetchBalance } from "@toolkit/profile/thunks";
import { fetchPresales, fetchLeaderboard } from "@toolkit/presale/thunks";
import { buyTokens } from "@toolkit/buyToken/thunks";
import { clearBuyTokenState } from "@toolkit/buyToken/slice";
import logo from "@assets/images/logo.png";

const PRESALE_TIERS = [
    { emoji: '🐳', name: 'Whale', minBalance: 1000000, color: '#6d28d9' },
    { emoji: '🦈', name: 'Shark', minBalance: 100000, color: '#3b82f6' },
    { emoji: '🐬', name: 'Dolphin', minBalance: 50000, color: '#0891B2' },
    { emoji: '🐟', name: 'Fish', minBalance: 10000, color: '#10b981' },
    { emoji: '🦐', name: 'Shrimp', minBalance: 1000, color: '#D97706' },
] as const;

const SolanaIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 395 395" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M64.6 142.1L340.4 142.1C344.2 142.1 346.5 146.3 344.3 149.5L297.7 217.5C296.1 219.8 293.5 221.1 290.7 221.1L14.9 221.1C11.1 221.1 8.8 216.8 11 213.7L57.6 145.7C59.2 143.4 61.8 142.1 64.6 142.1Z" fill="url(#paint0_linear)" />
        <path d="M64.6 24.6L340.4 24.6C344.2 24.6 346.5 28.9 344.3 32.1L297.7 100C296.1 102.3 293.5 103.7 290.7 103.7L14.9 103.7C11.1 103.7 8.8 99.4 11 96.3L57.6 28.3C59.2 26 61.8 24.6 64.6 24.6Z" fill="url(#paint1_linear)" />
        <path d="M328.7 259.5L52.9 259.5C49.1 259.5 46.8 263.8 49 266.9L95.6 334.9C97.2 337.2 99.8 338.5 102.6 338.5L378.4 338.5C382.2 338.5 384.5 334.3 382.3 331.1L335.7 263.1C334.1 260.8 331.5 259.5 328.7 259.5Z" fill="url(#paint2_linear)" />
        <defs>
            <linearGradient id="paint0_linear" x1="105" y1="142.1" x2="251.5" y2="221.1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#03E1FF" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="105" y1="24.6" x2="251.5" y2="103.7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#03E1FF" />
            </linearGradient>
            <linearGradient id="paint2_linear" x1="142.6" y1="338.6" x2="289.2" y2="259.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#03E1FF" />
            </linearGradient>
        </defs>
    </svg>
);

const BuyAction = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { profile, balance, pinBalance, isBalanceLoading, balanceError } = useSelector((state: RootState) => state.profile);
    const { presales, leaderboard, isLoading, error } = useSelector((state: RootState) => state.presale);
    const { isBuying, error: buyTokenError, successMessage } = useSelector((state: RootState) => state.buyToken);
    const [solAmount, setSolAmount] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const currentBatch = useMemo(() => {
        return presales.find((p: any) => p.enabled === 1) || null;
    }, [presales]);



    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchPresales());
        dispatch(fetchBalance());
        dispatch(fetchLeaderboard());
    }, [dispatch]);

    // --- Rank tier progress (client-side calc tied to profile balance) ---
    const spadstBalance: number = balance ?? 0;

    const { currentTier, nextTier, progressPct, needed } = useMemo(() => {
        const sorted = [...PRESALE_TIERS].sort((a, b) => b.minBalance - a.minBalance);
        const curIdx = sorted.findIndex(t => spadstBalance >= t.minBalance);
        const cur = curIdx !== -1 ? sorted[curIdx] : null;

        // If no tier achieved, we simulate being at the "bottom" index + 1
        const effectiveCurIdx = curIdx !== -1 ? curIdx : sorted.length;
        const nxt = effectiveCurIdx > 0 ? sorted[effectiveCurIdx - 1] : null;

        let pct = 0;
        let need = 0;
        if (!cur && nxt) {
            // Reaching Shrimp for the first time
            pct = (spadstBalance / nxt.minBalance) * 100;
            need = nxt.minBalance - spadstBalance;
        } else if (cur && nxt) {
            // Reaching the next tier
            pct = ((spadstBalance - cur.minBalance) / (nxt.minBalance - cur.minBalance)) * 100;
            need = nxt.minBalance - spadstBalance;
        } else if (cur && !nxt) {
            // Max tier
            pct = 100;
            need = 0;
        }

        return { currentTier: cur, nextTier: nxt, progressPct: Math.min(Math.max(pct, 2), 100), needed: need };
    }, [spadstBalance]);

    useEffect(() => {
        const presaleEnd = profile?.settings?.presaleEnd;
        if (!presaleEnd) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const updateTimeLeft = () => {
            const endDate = new Date(presaleEnd);
            const difference = endDate.getTime() - Date.now();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        updateTimeLeft();
        const timer = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [profile?.settings?.presaleEnd]);

    const soldPercentage = useMemo(() => {
        const tokenSold = profile?.settings?.tokenSold;
        const tokenTotal = profile?.settings?.tokenTotal;
        if (!tokenTotal || !tokenSold) return 0;
        return (tokenSold / tokenTotal) * 100;
    }, [profile?.settings?.tokenSold, profile?.settings?.tokenTotal]);

    const formattedTokenReceive = useMemo(() => {
        const parsedValue = parseFloat(solAmount);
        if (!parsedValue || parsedValue <= 0) return "0";
        const batchPrice = currentBatch?.price || 0.000035;
        const tokenAmount = parsedValue / batchPrice;
        return tokenAmount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }, [solAmount, currentBatch]);

    const handleBuyTokenClick = () => {
        const parsedAmount = parseFloat(solAmount);
        if (!parsedAmount || parsedAmount <= 0) return;
        if (!currentBatch?.price || !currentBatch?.batch) return;
        setShowConfirmModal(true);
    };

    const handleConfirmBuyToken = async () => {
        const parsedAmount = parseFloat(solAmount);
        if (!parsedAmount || parsedAmount <= 0 || !currentBatch?.price || !currentBatch?.batch) {
            setShowConfirmModal(false);
            return;
        }

        setShowConfirmModal(false);

        try {
            await dispatch(buyTokens({
                amount: parsedAmount,
                price: currentBatch.price,
                batch: currentBatch.batch,
            }));
            setSolAmount("");
        } catch (error) {
            // Error is handled by Redux state
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, { position: 'top-center', autoClose: 1000 });
            setTimeout(() => { window.location.reload(); }, 1100);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (buyTokenError) {
            toast.error(buyTokenError, { position: 'top-center', autoClose: 1000 });
            setTimeout(() => { dispatch(clearBuyTokenState()); }, 1100);
        }
    }, [buyTokenError, dispatch]);

    const tokenName = "SP ADST";
    const currentBatchNumber = currentBatch?.batch || 3;
    const totalTokenSold = profile?.settings?.tokenSold || 0;
    const totalTokenSupply = profile?.settings?.tokenTotal || 0;
    const softCap = profile?.settings?.tokenSoftcap || 0;
    const hardCap = profile?.settings?.tokenTotal || 0;
    const currentBatchPrice = currentBatch?.price || 0.000035;
    const remainingBatchToken = currentBatch ? (currentBatch.allocation - currentBatch.sold) : 0;
    const currency = "Solana (SOL)";
    const totalAllocation = "21,000,000 SPADST";

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Pre Sale" />

            <div className="dapp-container-wide">
                {/* dApp Page Header */}
                <div className="dapp-header sp-animate-in">
                    <p className="sp-text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>Token Presale</p>
                    <h2 className="dapp-title section-title-gradient mb-0">SP ADST</h2>
                </div>



                {/* === Rank Progress Banner === */}
                <div className="sp-animate-in my-5">
                    {nextTier ? (
                        <p className="text-center sp-text-muted mb-3" style={{ fontSize: '0.82rem', marginTop: '1rem', marginBottom: '1rem' }}>
                            You need{' '}
                            <span className="fw-bold" style={{ color: nextTier.color }}>
                                {needed.toLocaleString('en-US')} more SPADST
                            </span>{' '}
                            to reach <span className="fw-bold" style={{ color: nextTier.color }}>{nextTier.emoji} {nextTier.name}</span>
                        </p>
                    ) : currentTier ? (
                        <p className="text-center mb-3" style={{ fontSize: '0.82rem', color: currentTier.color }}>
                            🎉 Max Tier — <strong>{currentTier.emoji} {currentTier.name}</strong>!
                        </p>
                    ) : (
                        <p className="text-center sp-text-muted mb-3" style={{ fontSize: '0.82rem' }}>
                            Buy <span className="fw-bold" style={{ color: '#D97706' }}>1,000 SPADST</span> to unlock{' '}
                            <span style={{ color: '#D97706' }}>🦐 Shrimp</span> tier
                        </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '75px 1fr 75px', gap: '12px', alignItems: 'center', width: '100%', paddingBottom: '10px' }}>
                        {/* Current tier (Left) */}
                        <div className="text-start">
                            {currentTier ? (
                                <div className="d-flex flex-column align-items-start">
                                    <span style={{ fontSize: '1.6rem', lineHeight: 1, filter: `drop-shadow(0 0 5px ${currentTier.color}80)` }}>{currentTier.emoji}</span>
                                    <span className="fw-bold mt-1" style={{ color: currentTier.color, fontSize: '0.72rem', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{currentTier.name}</span>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-start">
                                    <span className="fw-bold sp-text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>No Tier</span>
                                </div>
                            )}
                        </div>

                        {/* Progress bar (Center) */}
                        <div style={{ position: 'relative', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{
                                height: '100%',
                                width: `${progressPct}%`,
                                background: currentTier
                                    ? `linear-gradient(90deg, ${currentTier.color}80, ${currentTier.color})`
                                    : 'linear-gradient(90deg, rgba(217,119,6,0.3), rgba(217,119,6,0.6))',
                                borderRadius: '8px',
                                transition: 'width 0.8s ease',
                            }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="fw-bold" style={{ fontSize: '0.82rem', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)', letterSpacing: '0.5px' }}>
                                    {spadstBalance.toLocaleString('en-US')} <span className="opacity-75" style={{ fontSize: '0.7rem' }}>SPADST</span>
                                </span>
                            </div>
                        </div>

                        {/* Next tier (Right) */}
                        <div className="text-end">
                            {nextTier ? (
                                <div className="d-flex flex-column align-items-end">
                                    <span style={{ fontSize: '1.6rem', lineHeight: 1, opacity: 0.8 }}>{nextTier.emoji}</span>
                                    <span className="fw-bold mt-1" style={{ color: nextTier.color, fontSize: '0.72rem', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{nextTier.name}</span>
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-end">
                                    <span style={{ fontSize: '1.6rem', lineHeight: 1, color: '#d4a853', filter: 'drop-shadow(0 0 5px rgba(212,168,83,0.5))' }}>👑</span>
                                    <span className="fw-bold mt-1" style={{ color: '#d4a853', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>Max!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <Card className="card-glass mb-4">
                        <Card.Body className="text-center py-5">
                            <Spinner animation="border" role="status" style={{ color: 'var(--sp-accent-purple-light)' }}>
                                <span className="visually-hidden">Loading presale data...</span>
                            </Spinner>
                        </Card.Body>
                    </Card>
                )}

                {error && (
                    <div className="alert-glass p-3 mb-4">
                        Error loading presale data: {error}
                    </div>
                )}

                {presales.length > 0 && !isLoading && (
                    <div className="d-flex flex-column" style={{ gap: '48px' }}>

                        {/* Countdown Timer */}
                        <div className="sp-animate-in-delay-1" style={{ textAlign: 'center', paddingBottom: '8px' }}>
                            <h5 className="section-title-gradient mb-3" style={{ fontSize: '1.1rem', textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                                PRESALE ENDS IN
                            </h5>
                            <div className="countdown-container">
                                <div className="countdown-box">
                                    <div className="countdown-value">{pad(timeLeft.days)}</div>
                                    <div className="countdown-label">Days</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-box">
                                    <div className="countdown-value">{pad(timeLeft.hours)}</div>
                                    <div className="countdown-label">Hours</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-box">
                                    <div className="countdown-value">{pad(timeLeft.minutes)}</div>
                                    <div className="countdown-label">Mins</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-box">
                                    <div className="countdown-value">{pad(timeLeft.seconds)}</div>
                                    <div className="countdown-label">Secs</div>
                                </div>
                            </div>
                        </div>

                        {/* Balance Cards */}
                        <Row className="mb-0 sp-animate-in-delay-2">
                            <Col md={6} className="mb-3 mb-md-0">
                                <Card className="stat-card h-100">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <SolanaIcon size={24} className="me-3" />
                                            <span className="stat-label">SOL Balance</span>
                                        </div>
                                        <div className="stat-value mb-3">
                                            {isBalanceLoading ? (
                                                <Spinner animation="border" size="sm" style={{ color: 'var(--sp-accent-purple-light)' }} />
                                            ) : balanceError ? (
                                                <span style={{ color: 'var(--sp-accent-red)' }}>Error</span>
                                            ) : (
                                                pinBalance !== null ? pinBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '0.00'
                                            )}
                                        </div>
                                        <Button className="btn-gradient w-100" onClick={() => navigate("/deposit")}>
                                            Deposit
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="stat-card h-100">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={logo} alt="SP ADST" className="me-3" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                            <span className="stat-label">SP ADST Balance</span>
                                        </div>
                                        <div className="stat-value mb-3">
                                            {isBalanceLoading ? (
                                                <Spinner animation="border" size="sm" style={{ color: 'var(--sp-accent-green-light)' }} />
                                            ) : balanceError ? (
                                                <span style={{ color: 'var(--sp-accent-red)' }}>Error</span>
                                            ) : (
                                                balance !== null ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
                                            )}
                                        </div>
                                        <Button className="btn-gradient-green w-100" onClick={() => navigate("/withdrawal")}>
                                            Withdraw
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Buy Token Form */}
                        {currentBatch && (
                            <Card className="card-glass sp-animate-in-delay-3">
                                <Card.Header className="border-0">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                        <h4 className="mb-0 sp-text-primary fw-bold">
                                            Buy Your Tokens Now
                                            <span className="info-chip chip-purple ms-2" style={{ fontSize: '0.75rem' }}>
                                                Batch {currentBatchNumber}
                                            </span>
                                        </h4>
                                    </div>
                                </Card.Header>
                                <Card.Body style={{ paddingTop: '1.5rem' }}>
                                    {/* Progress Section */}
                                    <div className="mb-4">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
                                            <span className="sp-text-secondary" style={{ fontSize: '0.85rem' }}>Total Tokens Sold</span>
                                            <span className="sp-text-primary fw-bold" style={{ fontSize: '0.85rem' }}>{soldPercentage.toFixed(2)}%</span>
                                        </div>
                                        <div className="progress-premium">
                                            <div className="progress-bar-premium" style={{ width: `${Math.max(soldPercentage, 2)}%` }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
                                            <small className="sp-text-muted">
                                                {totalTokenSold.toLocaleString("en-US")} TOKEN
                                            </small>
                                            <small className="sp-text-muted">
                                                {totalTokenSupply.toLocaleString("en-US")} TOKEN
                                            </small>
                                        </div>
                                    </div>

                                    {/* Caps Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
                                        <div className="info-chip chip-cyan">
                                            Soft Cap: {softCap.toLocaleString("en-US")}
                                        </div>
                                        <div className="info-chip chip-purple">
                                            Hard Cap: {hardCap.toLocaleString("en-US")}
                                        </div>
                                    </div>

                                    {/* Current Batch Info */}
                                    <div className="p-3 mb-4" style={{
                                        background: 'rgba(30, 64, 175, 0.08)',
                                        border: '1px solid rgba(30, 64, 175, 0.2)',
                                        borderRadius: 'var(--sp-radius-sm)'
                                    }}>
                                        <p className="mb-1 sp-text-primary fw-semibold">
                                            Current Batch Price: <span className="sp-text-cyan">{currentBatchPrice} SOL / TOKEN</span>
                                        </p>
                                        <p className="mb-0 sp-text-muted" style={{ fontSize: '0.85rem' }}>
                                            Remaining Tokens: {remainingBatchToken.toLocaleString("en-US")}
                                        </p>
                                    </div>

                                    {/* Buy Form */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                            Amount You Want to Pay (SOL)
                                        </Form.Label>
                                        <InputGroup className="input-group-dark">
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={solAmount}
                                                onChange={(e) => setSolAmount(e.target.value)}
                                                className="input-dark"
                                            />
                                            <InputGroup.Text>SOL</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group style={{ marginBottom: '1rem' }}>
                                        <Form.Label className="sp-text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                                            You Will Receive {tokenName}
                                        </Form.Label>
                                        <InputGroup className="input-group-dark">
                                            <Form.Control value={formattedTokenReceive} readOnly className="input-dark" />
                                            <InputGroup.Text>TOKEN</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    {buyTokenError && (
                                        <div className="alert-glass p-3 mb-3">
                                            {buyTokenError}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div className="alert-glass-success p-3 mb-3">
                                            {successMessage}
                                        </div>
                                    )}

                                    <Button
                                        className="btn-gradient-green w-100 mt-4"
                                        size="lg"
                                        onClick={handleBuyTokenClick}
                                        disabled={isBuying || !solAmount || parseFloat(solAmount) <= 0 || !currentBatch}
                                        style={{ fontSize: '1rem', letterSpacing: '1px' }}
                                    >
                                        {isBuying ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'BUY TOKEN'
                                        )}
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Batch Schedule */}
                        <div className="sp-animate-in-delay-4" style={{ paddingTop: '8px', borderTop: '1px solid var(--sp-border-glass)' }}>
                            <h4 className="mb-3 sp-text-primary fw-bold">Presale Batch Schedule</h4>
                            <div className="dapp-batch-list">
                                {presales.length > 0 ? (
                                    presales.map((presale: any) => {
                                        const isActive = presale.enabled === 1;
                                        return (
                                            <div key={presale.id || presale.batch} className="dapp-batch-row" style={isActive ? { borderColor: 'rgba(30, 64, 175, 0.4)' } : {}}>
                                                <div className="dapp-batch-id">
                                                    <span className="fw-bold">#{presale.batch}</span>
                                                    {isActive && (
                                                        <span className="info-chip chip-green" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                                                            ACTIVE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="dapp-batch-info">
                                                    <div className="dapp-batch-stat">
                                                        <span className="dapp-batch-label">Allocation</span>
                                                        <span className="dapp-batch-value">{presale.allocation.toLocaleString("en-US")} TOKEN</span>
                                                    </div>
                                                    <div className="dapp-batch-stat">
                                                        <span className="dapp-batch-label">Price</span>
                                                        <span className="dapp-batch-value sp-text-cyan">{presale.price} SOL</span>
                                                    </div>
                                                    <div className="dapp-batch-stat">
                                                        <span className="dapp-batch-label">Collected</span>
                                                        <span className="dapp-batch-value">{presale.sold.toLocaleString("en-US")} TOKEN</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center sp-text-muted py-4">No presale batches available</div>
                                )}
                            </div>
                            <div className="p-3" style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--sp-border-glass)',
                                borderRadius: 'var(--sp-radius-sm)'
                            }}>
                                <h6 className="section-title-gradient fw-bold mb-3" style={{ fontSize: '0.9rem' }}>General Information</h6>
                                <p className="mb-2 sp-text-secondary" style={{ fontSize: '0.85rem' }}>
                                    Purchase Currency: <span className="sp-text-primary">{currency}</span>
                                </p>
                                <p className="mb-2 sp-text-secondary" style={{ fontSize: '0.85rem' }}>
                                    Total Presale Allocation: <span className="sp-text-primary">{totalAllocation}</span>
                                </p>
                                <p className="mb-0 sp-text-secondary" style={{ fontSize: '0.85rem' }}>
                                    Hard Cap (Token Value): <span className="sp-text-primary">{hardCap.toLocaleString("en-US")} TOKEN</span>
                                </p>
                            </div>
                        </div>


                    </div>
                )}


            </div>

            {/* Leaderboard Schedule */}
            <div className="sp-animate-in mb-5" style={{ paddingTop: '8px' }}>
                <h4 className="mb-3 section-title-gradient fw-bold text-center" style={{ fontSize: '1.25rem' }}>Top 30 SPADST Holders</h4>
                <div className="card-glass-purple p-0 overflow-hidden">
                    <div className="table-responsive sp-animate-in" style={{
                        background: 'linear-gradient(145deg, rgba(22, 22, 45, 0.9) 0%, rgba(12, 12, 28, 0.95) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(124, 60, 245, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        <table className="table sp-table mb-0" style={{ minWidth: '400px', backgroundColor: 'transparent' }}>
                            <thead>
                                <tr>
                                    <th className="border-0" style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>Rank</th>
                                    <th className="border-0" style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>Holder</th>
                                    <th className="text-end border-0" style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>SPADST Balance</th>
                                    <th className="text-center border-0" style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>Txns</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard && leaderboard.length > 0 ? (
                                    leaderboard.map((user: any, idx: number) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent', transition: 'all 0.3s ease' }} className="leaderboard-row">
                                            <td style={{ padding: '16px 20px', verticalAlign: 'middle', border: 'none' }}>
                                                {user.rank === 1 ? <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.8))' }}>🥇</span> :
                                                    user.rank === 2 ? <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 10px rgba(192,192,192,0.8))' }}>🥈</span> :
                                                        user.rank === 3 ? <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 10px rgba(205,127,50,0.8))' }}>🥉</span> :
                                                            <span className="fw-bold" style={{ color: '#94a3b8' }}>#{user.rank}</span>}
                                            </td>
                                            <td style={{ padding: '16px 20px', verticalAlign: 'middle', border: 'none', color: '#ffffff', textShadow: '0 0 5px rgba(255, 255, 255, 0.3)' }} className="fw-bold">
                                                {user.displayName}
                                            </td>
                                            <td style={{ padding: '16px 20px', verticalAlign: 'middle', border: 'none', color: '#00f2fe', textShadow: '0 0 10px rgba(0, 242, 254, 0.3)' }} className="text-end fw-bold">
                                                {user.spadstBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td style={{ padding: '16px 20px', verticalAlign: 'middle', border: 'none' }} className="text-center">
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>{user.totalTransactions}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 border-0" style={{ color: '#94a3b8' }}>
                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.5 }}>🏆</div>
                                                <div>No leaderboard data available yet.</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered dialogClassName="modal-glass">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="sp-text-secondary">Do you want to buy SP ADST Token?</p>
                    {solAmount && currentBatch && (
                        <div className="p-3" style={{
                            background: 'rgba(30, 64, 175, 0.08)',
                            border: '1px solid rgba(30, 64, 175, 0.2)',
                            borderRadius: 'var(--sp-radius-sm)'
                        }}>
                            <p className="mb-1 sp-text-primary">
                                <strong>Amount:</strong> {parseFloat(solAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} SOL
                            </p>
                            <p className="mb-1 sp-text-primary">
                                <strong>Price:</strong> {currentBatch.price} SOL / TOKEN
                            </p>
                            <p className="mb-0 sp-text-primary">
                                <strong>You will receive:</strong>{' '}
                                <span className="sp-text-green fw-bold">{formattedTokenReceive} SP ADST</span>
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-gradient-outline" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button className="btn-gradient-green" onClick={handleConfirmBuyToken} disabled={isBuying}>
                        {isBuying ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Processing...
                            </>
                        ) : (
                            'Confirm Purchase'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default BuyAction;
