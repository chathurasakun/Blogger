interface AdminBadgeProps {
  variant?: "default" | "compact" | "header";
  className?: string;
}

export default function AdminBadge({ variant = "default", className = "" }: AdminBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1.5 font-medium rounded-full";
  
  if (variant === "compact") {
    return (
      <span
        className={`${baseClasses} bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 text-xs ${className}`}
        title="Administrator"
      >
        <span className="text-amber-400">👑</span>
        <span>Admin</span>
      </span>
    );
  }

  if (variant === "header") {
    return (
      <span
        className={`${baseClasses} bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1 text-xs font-semibold ${className}`}
        title="Administrator"
      >
        <span className="text-amber-400 text-sm">👑</span>
        <span>Admin</span>
      </span>
    );
  }

  // Default variant
  return (
    <span
      className={`${baseClasses} bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 text-sm font-semibold shadow-lg shadow-amber-500/10 ${className}`}
      title="Administrator"
    >
      <span className="text-amber-400 text-base">👑</span>
      <span>Administrator</span>
    </span>
  );
}

