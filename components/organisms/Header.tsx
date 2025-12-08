import SignOutButton from "@/components/molecules/SignOutButton";
import type { ThemeColors } from "@/lib/themes";
import type { Tenant } from "@/lib/tenants";
import SettingsContainer from "@/components/organisms/SettingsContainer";

interface HeaderProps {
  title: string;
  colors?: ThemeColors;
  showSettingsLink?: boolean;
  tenant?: Tenant | null;
}

export default function Header({ title, colors, showSettingsLink = false, tenant }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          {showSettingsLink && tenant && colors && (
            <SettingsContainer tenant={tenant} colors={colors} />
          )}
          <SignOutButton colors={colors} />
        </div>
      </div>
    </header>
  );
}

