/**
 * Logo component — renders the correct brand asset variant based on context.
 *
 * variant:
 *   "wordmark-dark"  — teal icon + white text  (use on dark backgrounds)
 *   "wordmark-light" — teal icon + navy text   (use on light backgrounds)
 *   "mono-white"     — all-white               (use on dark panels where color is too loud)
 *   "icon"           — icon only               (sidebar, small contexts)
 *
 * The `auto` prop (default true) reads ThemeContext and picks the right wordmark automatically.
 * Set auto=false and pass an explicit variant when the background is always dark/light
 * regardless of the user's theme (e.g. the landing nav is always dark).
 */
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  variant?: "wordmark-dark" | "wordmark-light" | "mono-white" | "icon";
  auto?: boolean;
  height?: number;
  className?: string;
}

const ASSET: Record<string, string> = {
  "wordmark-dark": "/brand/logo-wordmark-dark.svg",
  "wordmark-light": "/brand/logo-wordmark-light.svg",
  "mono-white": "/brand/logo-mono-white.svg",
  icon: "/brand/logo-icon.svg",
};

export default function Logo({
  variant,
  auto = true,
  height = 34,
  className = "",
}: LogoProps) {
  const { theme } = useTheme();

  const resolved =
    variant ??
    (auto ? (theme === "dark" ? "wordmark-dark" : "wordmark-light") : "wordmark-light");

  return (
    <img
      src={ASSET[resolved]}
      alt="FundFlowHub"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
      draggable={false}
    />
  );
}
