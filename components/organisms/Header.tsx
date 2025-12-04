import SignOutButton from "@/components/molecules/SignOutButton";
import type { ThemeColors } from "@/lib/themes";

interface HeaderProps {
  title: string;
  userEmail: string;
  colors?: ThemeColors;
}

export default function Header({ title, userEmail, colors }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">{userEmail}</span>
          <SignOutButton colors={colors} />
        </div>
      </div>
    </header>
  );
}

