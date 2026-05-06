// ============================================================
// MOCK ADAPTER — SP ADST Token Presale
// Directly overrides Network singleton methods so ALL API calls
// return fixture data immediately. No Axios interceptor tricks.
// ============================================================

import Network from '../utils/Network';
import {
  mockAuthResponse,
  mockProfile,
  mockBalance,
  mockPresales,
  mockLeaderboard,
  mockTransactions,
  mockWithdrawals,
  mockDepositAddress,
  mockSettings,
  MOCK_USER_ID,
} from './fixtures';

// ── Seed localStorage so the app boots as authenticated ──────
function seedMockAuth() {
  const mockAuthState = {
    tokens: {
      accessToken: 'mock.access.token.demo',
      refreshToken: 'mock.refresh.token.demo',
      username: 'demotrader',
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    username: 'demotrader',
  };

  const persistRoot = {
    auth: JSON.stringify(mockAuthState),
    Theme: JSON.stringify({ layoutTheme: 'default' }),
    _persist: JSON.stringify({ version: -1, rehydrated: true }),
  };

  localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  localStorage.setItem('user', MOCK_USER_ID);
  localStorage.setItem('username', 'demotrader');
}

// ── Fake delay to simulate network ───────────────────────────
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

// ── Mock router — URL → fixture data ─────────────────────────
async function mockRouter(method: string, url: string, body?: any): Promise<any> {
  await delay(80 + Math.random() * 120);
  const m = method.toLowerCase();

  // Auth
  if (url.includes('auth/signIn') || url.includes('auth/login')) {
    localStorage.setItem('user', MOCK_USER_ID);
    localStorage.setItem('username', 'demotrader');
    // Auth thunk reads: response.data.user.username — must be wrapped in { data: ... }
    return { data: mockAuthResponse.data };
  }
  if (url.includes('auth/refresh')) {
    return { data: { accessToken: 'mock.access.refreshed', refreshToken: 'mock.refresh.refreshed' } };
  }

  // Profile & Balance
  if (url.includes('/profile')) return mockProfile;
  if (url.includes('/balance')) return mockBalance;

  // Presales
  if (url.includes('/presales') || url.includes('presales')) {
    return mockPresales;
  }

  // Leaderboard
  if (url.includes('leaderboard')) return { data: mockLeaderboard };

  // Buy Token
  if (url.includes('buy-token') && m === 'post') {
    mockBalance.balance += (body?.amount ?? 0) / (body?.price ?? 0.000035);
    mockBalance.pinBalance = Math.max(0, mockBalance.pinBalance - (body?.amount ?? 0));
    return { message: 'Tokens purchased successfully', success: true };
  }

  // Transactions
  if (url.includes('/transaction')) {
    return { data: mockTransactions, recordsTotal: mockTransactions.length, recordsFiltered: mockTransactions.length };
  }

  // Withdrawal status (tier info)
  if (url.includes('withdrawal-status')) {
    return {
      data: {
        isEnabled: true,
        enabledDate: '2026-05-01T00:00:00Z',
        spadstBalance: 52_500,
        platformFeePercent: 10,
        walletAddress: '7mXkLs9bTpQrVnYzAcDefGhIjKlMnOpQrStUvWxYzAb',
        presaleTier: {
          name: 'Dolphin',
          maxWithdrawPerSession: 50_000,
          maxWithdrawsPerWeek: 3,
          withdrawsUsedThisWeek: 1,
          remainingWithdrawals: 2,
          nextResetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        sProjectRank: { name: 'Dolphin', maxWithdrawPerSession: 50_000 },
      }
    };
  }

  // Withdrawals list
  if (url.includes('users/withdrawal') && m === 'get') {
    const key = url.includes('status=0') ? 'pending' : url.includes('status=1') ? 'completed' : 'rejected';
    const list = mockWithdrawals[key as keyof typeof mockWithdrawals] || [];
    return { data: list, recordsTotal: list.length, recordsFiltered: list.length };
  }

  // Withdraw submit
  if (url.includes('/withdraw') && m === 'post') {
    return { message: 'Withdrawal request submitted successfully', success: true };
  }

  // Approve / Decline
  if (url.includes('approve-by-wallet') || url.includes('decline-by-wallet')) {
    return { success: true, message: 'Action completed' };
  }

  // Deposit address
  if (url.includes('deposit/address') || url.includes('wallet/deposit')) {
    return { data: { address: mockDepositAddress.address } };
  }

  // Topup
  if (url.includes('topup-wallet')) {
    return { message: 'Deposit confirmation received.' };
  }

  // Settings
  if (url.includes('users/settings')) return mockSettings;

  // Change password
  if (url.includes('change-password')) return { success: true, message: 'Password changed' };

  // Register / Forgot
  if (url.includes('register') || url.includes('signUp')) return { success: true, message: 'Registration successful' };
  if (url.includes('forgot')) return { success: true, message: 'Reset link sent' };

  // Fallback
  console.warn(`[MockAdapter] Unhandled: ${method.toUpperCase()} ${url}`);
  return { data: null, success: true };
}

// ── Install: override Network singleton methods directly ──────
export function installMockAdapter() {
  seedMockAuth();

  // Replace all Network methods with mock versions
  (Network as any).get = (url: string, config?: any) => mockRouter('get', url, config);
  (Network as any).post = (url: string, data?: any) => mockRouter('post', url, data);
  (Network as any).put = (url: string, data?: any) => mockRouter('put', url, data);
  (Network as any).patch = (url: string, data?: any) => mockRouter('patch', url, data);
  (Network as any).delete = (url: string) => mockRouter('delete', url);

  console.info(
    '%c[SP ADST] 🚀 Mock mode — Network methods overridden, no real API calls.',
    'color: #00f2fe; font-weight: bold; background: #0f0f1a; padding: 4px 8px; border-radius: 4px;'
  );
}
