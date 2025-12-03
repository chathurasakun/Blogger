import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogger",
  description: "SaaS application for posting and managing blogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

