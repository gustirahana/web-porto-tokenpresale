import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import BreadcrumbItem from "@Common/BreadcrumbItem";
import { RootState } from "../../store";
import { fetchProfile } from "@toolkit/profile/thunks";
import {
    FaKey,
    FaAngleRight,
    FaCopy
} from 'react-icons/fa';
import { toast } from "react-toastify";

const Settings = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { profile } = useSelector((state: RootState) => state.profile as any);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleChangePasswordClick = () => {
        navigate('/change-password');
    };

    const referralLink = `${window.location.origin}/register?reff=${profile?.username ?? ""}`;

    const handleCopyReferralLink = () => {
        navigator?.clipboard?.writeText(referralLink).then(() => {
            toast.success("Link copied to clipboard");
        }).catch(() => {
            toast.error("Failed to copy link");
        });
    };

    return (
        <>
            <Helmet>
                <title>Settings</title>
            </Helmet>
            <BreadcrumbItem mainTitle="Settings" />

            <div className="dapp-container" style={{ maxWidth: 680 }}>
                {/* Profile Card */}
                <Card className="card-glass-accent mb-4 sp-animate-in">
                    <Card.Body className="p-4">
                        {/* User Info */}
                        <div className="mb-4">
                            <h4 className="sp-text-primary fw-bold mb-1">
                                {profile?.username || 'N/A'}
                            </h4>
                            <p className="sp-text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                                @{profile?.firstName || 'N/A'}
                            </p>
                            <p className="sp-text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                {profile?.email || 'N/A'}
                            </p>
                        </div>

                        {/* Referral Link */}
                        <div className="mb-0">
                            <label className="form-label sp-text-secondary fw-semibold" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Referral Link
                            </label>
                            <div className="d-flex flex-wrap gap-2 align-items-stretch">
                                <div className="referral-link-box flex-grow-1">
                                    {referralLink}
                                </div>
                                <Button
                                    className="btn-gradient-outline d-flex align-items-center gap-2"
                                    onClick={handleCopyReferralLink}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    <FaCopy /> Copy
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Account Section */}
                <div className="sp-animate-in-delay-1">
                    <h6 className="sp-text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        ACCOUNT
                    </h6>
                    <div className="d-grid gap-2">
                        <button
                            className="settings-menu-item"
                            onClick={handleChangePasswordClick}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <span className="menu-icon"><FaKey /></span>
                                <span className="sp-text-primary fw-medium">Change Password</span>
                            </div>
                            <span className="menu-arrow"><FaAngleRight /></span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
