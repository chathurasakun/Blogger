import Button from "./Button";
import type { ThemeColors } from "@/lib/themes";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  colors: ThemeColors;
  isLoading?: boolean;
  loadingText?: string;
}

export default function PrimaryActionButton({
  colors,
  isLoading = false,
  loadingText,
  children,
  ...buttonProps
}: PrimaryActionButtonProps) {
  return (
    <Button
      colors={colors}
      variant="primary"
      isLoading={isLoading}
      loadingText={loadingText}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

