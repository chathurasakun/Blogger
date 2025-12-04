import Button from "../atoms/Button";
import type { ThemeColors } from "@/lib/themes";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  colors: ThemeColors;
  isLoading?: boolean;
  loadingText?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export default function PrimaryActionButton({
  colors,
  isLoading = false,
  loadingText,
  size = "full",
  children,
  ...buttonProps
}: PrimaryActionButtonProps) {
  return (
    <Button
      colors={colors}
      variant="primary"
      isLoading={isLoading}
      loadingText={loadingText}
      size={size}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

