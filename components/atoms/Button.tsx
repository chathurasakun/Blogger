import type { ThemeColors } from "@/lib/themes";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  colors: ThemeColors;
  variant?: "primary" | "secondary" | "text";
  isLoading?: boolean;
  loadingText?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export default function Button({
  colors,
  variant = "primary",
  isLoading = false,
  loadingText,
  size = "full",
  children,
  className,
  disabled,
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  if (variant === "text") {
    return (
      <button
        type="button"
        className={`text-xs font-medium ${colors.forgotPasswordText} ${colors.forgotPasswordHover} hover:underline ${className || ""}`}
        disabled={isDisabled}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
    full: "w-full px-4 py-2.5 text-sm",
  };

  const widthClass = size === "full" ? "w-full" : "";

  const baseClasses = `inline-flex ${widthClass} items-center justify-center rounded-xl ${sizeClasses[size]} font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed`;

  const variantClasses = {
    primary: `bg-gradient-to-r ${colors.buttonGradient} text-slate-950 shadow-lg ${colors.buttonShadow} ${colors.buttonHoverShadow} hover:brightness-110 focus-visible:ring ${colors.buttonFocusRing} disabled:hover:brightness-100`,
    secondary: `border ${colors.linkBorder} bg-transparent ${colors.linkText} ${colors.linkHoverBorder} ${colors.linkHoverBg} focus-visible:ring ${colors.buttonFocusRing}`,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      disabled={isDisabled}
      {...buttonProps}
    >
      {isLoading ? (loadingText || "Loading...") : children}
    </button>
  );
}

