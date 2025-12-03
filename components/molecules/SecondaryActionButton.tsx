import Link from "next/link";
import type { ThemeColors } from "@/lib/themes";
import type { LinkProps } from "next/link";

interface SecondaryActionButtonProps extends LinkProps {
  colors: ThemeColors;
  children: React.ReactNode;
  className?: string;
}

export default function SecondaryActionButton({
  colors,
  children,
  className,
  ...linkProps
}: SecondaryActionButtonProps) {
  return (
    <Link
      className={`inline-flex w-full items-center justify-center rounded-xl border ${colors.linkBorder} bg-transparent px-4 py-2.5 text-sm font-medium ${colors.linkText} transition ${colors.linkHoverBorder} ${colors.linkHoverBg} focus-visible:outline-none focus-visible:ring-2 ${colors.buttonFocusRing} focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${className || ""}`}
      {...linkProps}
    >
      {children}
    </Link>
  );
}

