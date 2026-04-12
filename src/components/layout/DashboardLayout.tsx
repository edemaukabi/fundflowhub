import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LiveModeOverlay from "@/components/LiveModeOverlay";
import { useAuth } from "@/context/AuthContext";

/** Roles that are never locked by the live-mode KYC gate. */
const STAFF_ROLES = ["teller", "account_executive", "branch_manager"];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, mode } = useAuth();
  const location = useLocation();

  // Settings page is always accessible (needed to upload KYC docs).
  const isSettingsPage = location.pathname.startsWith("/dashboard/settings");

  const showLiveOverlay =
    mode === "live" &&
    user !== null &&
    user.is_test_account === true &&
    !STAFF_ROLES.includes(user.role) &&
    !isSettingsPage;

  return (
    <div className="flex h-screen overflow-hidden bg-ffh-bg dark:bg-ffh-bg-dark">
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar — overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {showLiveOverlay ? <LiveModeOverlay /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}
