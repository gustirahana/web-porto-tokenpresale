// ============================================================
// MOCK FIXTURES — SP ADST Token Presale
// Demo-mode data returned by the Axios mock adapter.
// All data is realistic but fake — no real API calls made.
// ============================================================

export const MOCK_USER_ID = 'demo-user-001';

// ── Auth ────────────────────────────────────────────────────
export const mockAuthResponse = {
  data: {
    accessToken: 'mock.access.token.demo',
    refreshToken: 'mock.refresh.token.demo',
    user: {
      id: MOCK_USER_ID,
      username: 'demotrader',
      email: 'demo@spadst.io',
    },
  },
};

// ── Profile ─────────────────────────────────────────────────
export const mockProfile = {
  id: MOCK_USER_ID,
  username: 'demotrader',
  email: 'demo@spadst.io',
  fullName: 'Demo Trader',
  referralCode: 'DEMO2025',
  referredBy: null,
  isVerified: true,
  createdAt: '2025-01-15T08:00:00Z',
  settings: {
    presaleEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    tokenSold: 4_200_000,
    tokenTotal: 21_000_000,
    tokenSoftcap: 5_000_000,
    tokenHardcap: 21_000_000,
  },
};

// ── Balance ──────────────────────────────────────────────────
export const mockBalance = {
  balance: 52_500.00,      // SP ADST tokens owned
  pinBalance: 2.45678901,  // SOL balance for buying
  saldo: 52_500.00,
};

// ── Presale Batches ──────────────────────────────────────────
export const mockPresales = [
  {
    id: 'batch-001',
    batch: 1,
    allocation: 3_000_000,
    price: 0.000020,
    sold: 3_000_000,
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-02-01T00:00:00Z',
    enabled: 0,
  },
  {
    id: 'batch-002',
    batch: 2,
    allocation: 5_000_000,
    price: 0.000028,
    sold: 5_000_000,
    start_date: '2025-02-01T00:00:00Z',
    end_date: '2025-03-01T00:00:00Z',
    enabled: 0,
  },
  {
    id: 'batch-003',
    batch: 3,
    allocation: 7_000_000,
    price: 0.000035,
    sold: 4_200_000,
    start_date: '2025-03-01T00:00:00Z',
    end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: 1, // ← ACTIVE batch
  },
  {
    id: 'batch-004',
    batch: 4,
    allocation: 6_000_000,
    price: 0.000045,
    sold: 0,
    start_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: 0,
  },
];

// ── Leaderboard ──────────────────────────────────────────────
export const mockLeaderboard = [
  { rank: 1, displayName: 'CryptoWhale_88',   spadstBalance: 1_250_000, totalTransactions: 42 },
  { rank: 2, displayName: 'SolanaKing',        spadstBalance: 980_000,   totalTransactions: 31 },
  { rank: 3, displayName: 'BlockchainPanda',   spadstBalance: 750_000,   totalTransactions: 28 },
  { rank: 4, displayName: 'demotrader',         spadstBalance: 52_500,    totalTransactions: 7  },
  { rank: 5, displayName: 'DeFiDragon',        spadstBalance: 45_000,    totalTransactions: 15 },
  { rank: 6, displayName: 'TokenHunter99',     spadstBalance: 38_000,    totalTransactions: 12 },
  { rank: 7, displayName: 'SOLarFlare',         spadstBalance: 32_500,    totalTransactions: 9  },
  { rank: 8, displayName: 'MoonSurfer',         spadstBalance: 28_000,    totalTransactions: 11 },
  { rank: 9, displayName: 'SatoshiDreamer',    spadstBalance: 22_000,    totalTransactions: 8  },
  { rank: 10, displayName: 'PresalePro',        spadstBalance: 18_500,    totalTransactions: 6  },
];

// ── Transactions ─────────────────────────────────────────────
export const mockTransactions = [
  {
    id: 'txn-001',
    type: 'buy_token',
    amount: 28_571.43,
    solAmount: 1.0,
    price: 0.000035,
    status: 'completed',
    txHash: '5KJcHm7rQzWxPvNtYsAdBf3LuEo8GnXhImVRTkMw4qD9',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-002',
    type: 'buy_token',
    amount: 14_285.71,
    solAmount: 0.5,
    price: 0.000035,
    status: 'completed',
    txHash: 'AhRnBv6JmKpLwQxTyUzCdEfGiHjKlMnOpQrStUvWxYz',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-003',
    type: 'deposit',
    amount: 3.0,
    solAmount: 3.0,
    price: null,
    status: 'completed',
    txHash: 'ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEe',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-004',
    type: 'withdrawal',
    amount: 9_643.86,
    solAmount: 0,
    price: null,
    status: 'pending',
    txHash: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Withdrawals (grouped by status) ──────────────────────────
export const mockWithdrawals = {
  pending: [
    {
      id: 'wd-001',
      amount: 9_643.86,
      wallet: '7mXkLs9bTpQrVnYzAcDefGhIjKlMnOpQrStUvWxYzAb',
      status: 'pending',   // ← must be string for getStatusBadge().toUpperCase()
      txHash: null,
      date_created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  completed: [
    {
      id: 'wd-002',
      amount: 5_000.00,
      wallet: '9pZkLs3bTpQrVnYzAcDefGhIjKlMnOpQrStUvWxAbCd',
      status: 'completed', // ← must be string
      txHash: 'CompletedTxHashMockXxYyZzAaBbCcDdEeFfGgHhIi',
      date_created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  rejected: [],
};

// ── Deposit Address ───────────────────────────────────────────
export const mockDepositAddress = {
  address: 'DemoSolanaWalletAddress7mXkLs9bTpQrVnYzAcDe',
  network: 'Solana (SOL)',
};

// ── Settings ──────────────────────────────────────────────────
export const mockSettings = {
  notifications: true,
  language: 'en',
  twoFactor: false,
  walletAddress: '7mXkLs9bTpQrVnYzAcDefGhIjKlMnOpQrStUvWxYzAb',
};
