/**
 * Theme configuration for multi-tenant theming.
 * Each theme defines a complete color palette for the application.
 */

export type ThemeId = "emerald" | "violet" | "blue" | "orange" | "rose";

export interface ThemeColors {
  // Primary colors
  primary: string;
  secondary: string;
  accent: string;
  // Gradient classes
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  gradientTextFrom: string;
  gradientTextVia: string;
  gradientTextTo: string;
  // Badge/indicator
  badgeBg: string;
  badgeBgLight: string;
  badgeText: string;
  // Input focus
  inputFocusBorder: string;
  inputFocusRing: string;
  // Button
  buttonGradient: string;
  buttonShadow: string;
  buttonHoverShadow: string;
  buttonFocusRing: string;
  // Link
  linkBorder: string;
  linkText: string;
  linkHoverBg: string;
  linkHoverBorder: string;
  // Checkbox
  checkboxColor: string;
  checkboxFocusRing: string;
  // Forgot password link
  forgotPasswordText: string;
  forgotPasswordHover: string;
}

/**
 * Theme definitions - centralized theme configuration
 */
export const themes: Record<ThemeId, ThemeColors> = {
  emerald: {
    primary: "emerald",
    secondary: "cyan",
    accent: "sky",
    gradientFrom: "from-emerald-400",
    gradientVia: "via-cyan-400",
    gradientTo: "to-sky-500",
    gradientTextFrom: "from-emerald-300",
    gradientTextVia: "via-cyan-300",
    gradientTextTo: "to-sky-400",
    badgeBg: "bg-emerald-400",
    badgeBgLight: "bg-emerald-400/10",
    badgeText: "text-emerald-300",
    inputFocusBorder: "focus:border-emerald-400/70",
    inputFocusRing: "focus:ring-emerald-500/60",
    buttonGradient: "from-emerald-400 via-cyan-400 to-sky-500",
    buttonShadow: "shadow-emerald-500/30",
    buttonHoverShadow: "hover:shadow-emerald-400/40",
    buttonFocusRing: "focus-visible:ring-emerald-400",
    linkBorder: "border-emerald-300/40",
    linkText: "text-emerald-200",
    linkHoverBg: "hover:bg-emerald-400/10",
    linkHoverBorder: "hover:border-emerald-300",
    checkboxColor: "text-emerald-400",
    checkboxFocusRing: "focus:ring-emerald-500/60",
    forgotPasswordText: "text-emerald-300",
    forgotPasswordHover: "hover:text-emerald-200",
  },
  violet: {
    primary: "violet",
    secondary: "purple",
    accent: "fuchsia",
    gradientFrom: "from-violet-400",
    gradientVia: "via-purple-400",
    gradientTo: "to-fuchsia-500",
    gradientTextFrom: "from-violet-300",
    gradientTextVia: "via-purple-300",
    gradientTextTo: "to-fuchsia-400",
    badgeBg: "bg-violet-400",
    badgeBgLight: "bg-violet-400/10",
    badgeText: "text-violet-300",
    inputFocusBorder: "focus:border-violet-400/70",
    inputFocusRing: "focus:ring-violet-500/60",
    buttonGradient: "from-purple-500 via-pink-500 to-rose-500",
    buttonShadow: "shadow-purple-500/30",
    buttonHoverShadow: "hover:shadow-pink-400/40",
    buttonFocusRing: "focus-visible:ring-violet-400",
    linkBorder: "border-violet-300/40",
    linkText: "text-violet-200",
    linkHoverBg: "hover:bg-violet-400/10",
    linkHoverBorder: "hover:border-violet-300",
    checkboxColor: "text-violet-400",
    checkboxFocusRing: "focus:ring-violet-500/60",
    forgotPasswordText: "text-violet-300",
    forgotPasswordHover: "hover:text-violet-200",
  },
  blue: {
    primary: "blue",
    secondary: "indigo",
    accent: "sky",
    gradientFrom: "from-blue-400",
    gradientVia: "via-indigo-400",
    gradientTo: "to-sky-500",
    gradientTextFrom: "from-blue-300",
    gradientTextVia: "via-indigo-300",
    gradientTextTo: "to-sky-400",
    badgeBg: "bg-blue-400",
    badgeBgLight: "bg-blue-400/10",
    badgeText: "text-blue-300",
    inputFocusBorder: "focus:border-blue-400/70",
    inputFocusRing: "focus:ring-blue-500/60",
    buttonGradient: "from-blue-400 via-indigo-400 to-sky-500",
    buttonShadow: "shadow-blue-500/30",
    buttonHoverShadow: "hover:shadow-blue-400/40",
    buttonFocusRing: "focus-visible:ring-blue-400",
    linkBorder: "border-blue-300/40",
    linkText: "text-blue-200",
    linkHoverBg: "hover:bg-blue-400/10",
    linkHoverBorder: "hover:border-blue-300",
    checkboxColor: "text-blue-400",
    checkboxFocusRing: "focus:ring-blue-500/60",
    forgotPasswordText: "text-blue-300",
    forgotPasswordHover: "hover:text-blue-200",
  },
  orange: {
    primary: "orange",
    secondary: "amber",
    accent: "yellow",
    gradientFrom: "from-orange-400",
    gradientVia: "via-amber-400",
    gradientTo: "to-yellow-500",
    gradientTextFrom: "from-orange-300",
    gradientTextVia: "via-amber-300",
    gradientTextTo: "to-yellow-400",
    badgeBg: "bg-orange-400",
    badgeBgLight: "bg-orange-400/10",
    badgeText: "text-orange-300",
    inputFocusBorder: "focus:border-orange-400/70",
    inputFocusRing: "focus:ring-orange-500/60",
    buttonGradient: "from-orange-400 via-amber-400 to-yellow-500",
    buttonShadow: "shadow-orange-500/30",
    buttonHoverShadow: "hover:shadow-orange-400/40",
    buttonFocusRing: "focus-visible:ring-orange-400",
    linkBorder: "border-orange-300/40",
    linkText: "text-orange-200",
    linkHoverBg: "hover:bg-orange-400/10",
    linkHoverBorder: "hover:border-orange-300",
    checkboxColor: "text-orange-400",
    checkboxFocusRing: "focus:ring-orange-500/60",
    forgotPasswordText: "text-orange-300",
    forgotPasswordHover: "hover:text-orange-200",
  },
  rose: {
    primary: "rose",
    secondary: "pink",
    accent: "fuchsia",
    gradientFrom: "from-rose-400",
    gradientVia: "via-pink-400",
    gradientTo: "to-fuchsia-500",
    gradientTextFrom: "from-rose-300",
    gradientTextVia: "via-pink-300",
    gradientTextTo: "to-fuchsia-400",
    badgeBg: "bg-rose-400",
    badgeBgLight: "bg-rose-400/10",
    badgeText: "text-rose-300",
    inputFocusBorder: "focus:border-rose-400/70",
    inputFocusRing: "focus:ring-rose-500/60",
    buttonGradient: "from-rose-400 via-pink-400 to-fuchsia-500",
    buttonShadow: "shadow-rose-500/30",
    buttonHoverShadow: "hover:shadow-rose-400/40",
    buttonFocusRing: "focus-visible:ring-rose-400",
    linkBorder: "border-rose-300/40",
    linkText: "text-rose-200",
    linkHoverBg: "hover:bg-rose-400/10",
    linkHoverBorder: "hover:border-rose-300",
    checkboxColor: "text-rose-400",
    checkboxFocusRing: "focus:ring-rose-500/60",
    forgotPasswordText: "text-rose-300",
    forgotPasswordHover: "hover:text-rose-200",
  },
};

/**
 * Get theme colors by theme ID.
 * Falls back to "emerald" if theme doesn't exist.
 */
export function getThemeColors(themeId: string | null | undefined): ThemeColors {
  const theme = themeId && themeId in themes ? (themeId as ThemeId) : "emerald";
  return themes[theme];
}

