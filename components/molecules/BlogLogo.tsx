import Image from "next/image";

interface BlogLogoProps {
  logo: string | null | undefined;
  alt: string;
  size?: number;
}

export default function BlogLogo({ logo, alt, size = 64 }: BlogLogoProps) {
  // Get first letter of blog name for default logo
  const getInitial = (text: string) => {
    return text.charAt(0).toUpperCase() || "B";
  };

  // Show default logo if no logo provided
  if (!logo || !logo.trim()) {
    const initial = getInitial(alt);
    return (
      <div
        className="rounded-full border-2 border-green-500 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold"
        style={{ height: `${size}px`, width: `${size}px`, fontSize: `${size * 0.4}px` }}
      >
        {initial}
      </div>
    );
  }

  // All logos are stored locally in /public/uploads/, so we use Next.js Image for optimization
  return (
    <div
      className="rounded-full border-2 border-green-500 overflow-hidden relative"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <Image
        src={logo}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        priority // Load immediately since logo is above the fold
      />
    </div>
  );
}

