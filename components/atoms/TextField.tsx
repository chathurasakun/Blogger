import type { ThemeColors } from "@/lib/themes";
import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  colors: ThemeColors;
  labelAction?: React.ReactNode;
}

export default function TextField({
  label,
  colors,
  labelAction,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      <div className={labelAction ? "flex items-center justify-between gap-2" : ""}>
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-wide text-slate-200"
        >
          {label}
        </label>
        {labelAction && labelAction}
      </div>
      <div className="relative">
        <input
          id={inputId}
          className={`block w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition ${colors.inputFocusBorder} focus:bg-slate-900 focus:ring-2 ${colors.inputFocusRing} placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
          {...inputProps}
        />
      </div>
    </div>
  );
}

