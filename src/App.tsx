import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Public pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import OTPPage from "@/pages/auth/OTPPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DocsPage from "@/pages/DocsPage";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AccountsPage from "@/pages/dashboard/AccountsPage";
import TransferPage from "@/pages/dashboard/TransferPage";
import WithdrawalPage from "@/pages/dashboard/WithdrawalPage";
import CardsPage from "@/pages/dashboard/CardsPage";
import TransactionsPage from "@/pages/dashboard/TransactionsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import DepositPage from "@/pages/dashboard/DepositPage";
import KYCReviewPage from "@/pages/dashboard/KYCReviewPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import CustomersPage from "@/pages/dashboard/CustomersPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />

            {/* Customer pages */}
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="transfer" element={<TransferPage />} />
            <Route path="withdraw" element={<WithdrawalPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            {/* Shared */}
            <Route path="settings" element={<SettingsPage />} />
            {/* Teller */}
            <Route
              path="deposit"
              element={
                <ProtectedRoute requiredRoles={["teller", "branch_manager"]}>
                  <DepositPage />
                </ProtectedRoute>
              }
            />
            {/* Account Executive + Branch Manager */}
            <Route
              path="kyc"
              element={
                <ProtectedRoute requiredRoles={["account_executive", "branch_manager"]}>
                  <KYCReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedRoute requiredRoles={["account_executive", "branch_manager"]}>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            {/* Branch Manager */}
            <Route
              path="reports"
              element={
                <ProtectedRoute requiredRoles={["branch_manager"]}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

