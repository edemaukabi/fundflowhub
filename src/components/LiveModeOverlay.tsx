import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, FileCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * Shown in the main content area when a customer is in Live mode but has
 * not yet completed KYC (is_test_account === true).
 *
 * Staff roles (teller, account_executive, branch_manager) are never shown
 * this overlay — they do not need KYC to operate.
 */
export default function LiveModeOverlay() {
  const { setMode } = useAuth();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
          <ShieldAlert size={32} className="text-amber-600 dark:text-amber-400" />
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-xl font-bold text-ffh-navy dark:text-white">
          KYC verification required
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Live mode is locked until your identity has been verified. Upload your
          ID document and signature to complete the KYC process.
        </p>

        {/* Steps */}
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-left dark:border-amber-500/20 dark:bg-amber-500/5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            How to get verified
          </p>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                1
              </span>
              Go to{" "}
              <Link
                to="/dashboard/settings"
                className="font-medium text-ffh-blue hover:underline"
              >
                Settings → Documents & KYC
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                2
              </span>
              Upload your government-issued ID and signature photo
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                3
              </span>
              Wait for an Account Executive to review and approve your documents
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/dashboard/settings">
              <FileCheck size={16} className="mr-2" />
              Go to Documents
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMode("test")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Test mode
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
          While waiting, you can continue exploring the platform in{" "}
          <button
            onClick={() => setMode("test")}
            className="text-ffh-blue hover:underline"
          >
            Test mode
          </button>
          .
        </p>
      </div>
    </div>
  );
}
