import SecondaryActionButton from "@/components/molecules/SecondaryActionButton";
import { getThemeColors } from "@/lib/themes";

interface TenantNotFoundProps {
  host: string;
}

export default function TenantNotFound({ host }: TenantNotFoundProps) {
  // Use default emerald theme since there's no tenant to get theme from
  const colors = getThemeColors(null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-8 text-center text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
          Tenant not found
        </p>
        <h1 className="mb-3 text-2xl font-semibold">
          This tenant doesn&apos;t exist
        </h1>
        <p className="mb-6 text-sm text-slate-300/80">
          We couldn&apos;t find a tenant for{" "}
          <span className="font-semibold text-emerald-300">{host}</span>.
          Double-check the URL.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SecondaryActionButton href="/" colors={colors}>
            Go back to select a tenant
          </SecondaryActionButton>
        </div>
      </div>
    </main>
  );
}

