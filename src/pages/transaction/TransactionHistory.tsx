import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionHistory } from "@toolkit/transactionHistory/thunks";
import { selectTransactionHistory } from "@toolkit/transactionHistory/slice";
import { Form, InputGroup, Button } from "react-bootstrap";
import BreadcrumbItem from "@Common/BreadcrumbItem";
import dayjs from 'dayjs';
import { FaSearch, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TransactionHistory = () => {
    const [page, setPage] = useState(1);
    const [perPage] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchError, setSearchError] = useState("");

    const dispatch = useDispatch();
    const { transactions, recordsTotal, recordsFiltered, isLoading, error } = useSelector(selectTransactionHistory);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.length >= 3 || searchInput === "") {
                setSearchError("");
                setSearchText(searchInput);
                setPage(1);
            } else if (searchInput.length > 0) {
                setSearchError("Minimum 3 characters required");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        dispatch(fetchTransactionHistory({
            page,
            perPage,
            search: searchText
        }) as any);
    }, [dispatch, page, perPage, searchText]);

    const totalPages = Math.ceil(
        (searchText && recordsFiltered !== undefined ? recordsFiltered : recordsTotal) / perPage
    );

    const getTypeChip = (type: string) => {
        const chipClass = type === 'deposit' ? 'chip-green' : type === 'purchase' ? 'chip-purple' : 'chip-cyan';
        return (
            <span className={`info-chip ${chipClass}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                {type?.replace('_', ' ').toUpperCase() || 'N/A'}
            </span>
        );
    };

    const getDescription = (tx: any) => {
        const mode = tx?.docs?.mode;
        if (!mode) return <span className="sp-text-muted">N/A</span>;
        if (tx.type === 'deposit') {
            const match = mode.match(/Deposit\s+[\d.,]+\s+\w+/);
            return match ? match[0] : mode;
        }
        return mode;
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Transaction History" />

            <div className="dapp-container-wide">
                <div className="sp-animate-in">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
                        <h3 className="mb-0 sp-text-primary fw-bold">Transaction History</h3>
                        <Form.Group className="mb-0" style={{ width: '300px', maxWidth: '100%' }}>
                            <InputGroup className="input-group-dark">
                                <Form.Control
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    isInvalid={!!searchError}
                                    disabled={isLoading}
                                    autoComplete="off"
                                    className="input-dark"
                                />
                                <InputGroup.Text>
                                    {isLoading ? (
                                        <FaSpinner className="spinner" style={{ color: 'var(--sp-accent-purple-light)' }} />
                                    ) : (
                                        <FaSearch style={{ color: 'var(--sp-text-muted)' }} />
                                    )}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {searchError}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </div>

                    {error ? (
                        <div className="alert-glass p-3 mb-0">Error: {error}</div>
                    ) : (
                        <>
                            {/* Transaction Cards */}
                            <div className="dapp-tx-list">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((tx: any, idx: number) => (
                                        <div key={tx.id || idx} className="dapp-tx-row">
                                            <div className="dapp-tx-left">
                                                {getTypeChip(tx.type)}
                                                <span className="dapp-tx-date">
                                                    {dayjs(tx.createdAt).format('DD MMM YYYY')}
                                                </span>
                                            </div>
                                            <div className="dapp-tx-desc" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                                {getDescription(tx)}
                                            </div>
                                        </div>
                                    ))
                                ) : !isLoading ? (
                                    <div className="text-center sp-text-muted py-4">No transactions found</div>
                                ) : null}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="dapp-pagination">
                                    <Button
                                        variant="link"
                                        className="dapp-page-btn"
                                        disabled={page <= 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        <FaChevronLeft size={12} />
                                    </Button>
                                    <span className="dapp-page-info">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="link"
                                        className="dapp-page-btn"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        <FaChevronRight size={12} />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default TransactionHistory;
