import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import OTPPage from "./OTPPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRefetchUser = vi.fn();
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ refetchUser: mockRefetchUser }),
}));

vi.mock("@/api/auth", () => ({
  authApi: { verifyOtp: vi.fn() },
}));

import { authApi } from "@/api/auth";
const mockVerifyOtp = vi.mocked(authApi.verifyOtp);

function renderOTP(email: string | null = "test@example.com") {
  sessionStorage.clear();
  if (email) sessionStorage.setItem("ffh-otp-email", email);
  return render(
    <MemoryRouter>
      <OTPPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("OTPPage", () => {
  it("redirects to /login when no email in session", () => {
    renderOTP(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders 6 digit input boxes", () => {
    renderOTP();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("shows the email from sessionStorage", () => {
    renderOTP("alice@example.com");
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("shows error when submitting incomplete OTP", async () => {
    const user = userEvent.setup();
    renderOTP();
    // Type only 3 digits
    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");
    await user.click(screen.getByRole("button", { name: /verify otp/i }));
    await waitFor(() => {
      expect(screen.getByText(/enter the complete 6-digit/i)).toBeInTheDocument();
    });
  });

  it("navigates to /dashboard on successful verification", async () => {
    const user = userEvent.setup();
    mockVerifyOtp.mockResolvedValueOnce({} as never);
    mockRefetchUser.mockResolvedValueOnce(undefined);

    renderOTP();
    const inputs = screen.getAllByRole("textbox");
    const digits = ["1", "2", "3", "4", "5", "6"];
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], digits[i]);
    }
    await user.click(screen.getByRole("button", { name: /verify otp/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    expect(sessionStorage.getItem("ffh-otp-email")).toBeNull();
  });

  it("displays error message on failed verification", async () => {
    const user = userEvent.setup();
    mockVerifyOtp.mockRejectedValueOnce({
      response: { data: { error: "OTP expired" } },
    });

    renderOTP();
    const inputs = screen.getAllByRole("textbox");
    const digits = ["9", "9", "9", "9", "9", "9"];
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], digits[i]);
    }
    await user.click(screen.getByRole("button", { name: /verify otp/i }));

    await waitFor(() => {
      expect(screen.getByText("OTP expired")).toBeInTheDocument();
    });
  });
});
