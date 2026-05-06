// src/Routes/allRoutes.tsx
import BuyAction from "@/pages/buyAction/BuyAction.tsx";
import Login from "@/pages/auth/LoginV1.tsx";
import Register from "@/pages/auth/Register.tsx";
import ForgotPassword from "@/pages/auth/ForgotPassword.tsx";
import Withdrawal from "@/pages/withdrawal/Withdrawal.tsx";
import TransactionHistory from "@/pages/transaction/TransactionHistory.tsx";
import Deposit from "@/pages/deposit/Deposit.tsx";
import Settings from "@/pages/settings/Settings.tsx";
import ChangePassword from "@/pages/settings/ChangePassword.tsx";

const protectedRoutes = [
    { path: "/presale", component: <BuyAction /> },
    { path: "/withdrawal", component: <Withdrawal /> },
    { path: "/transaction-history", component: <TransactionHistory /> },
    { path: "/deposit", component: <Deposit /> },
    { path: "/settings", component: <Settings /> },
    { path: "/change-password", component: <ChangePassword /> },
];

const publicRoutes = [
    { path: "/login", component: <Login /> },
    { path: "/register", component: <Register /> },
    { path: "/forgot-password", component: <ForgotPassword /> },
];

export {
    protectedRoutes,
    publicRoutes
};