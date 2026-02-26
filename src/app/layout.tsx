import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeToggleGlobal } from "@/components/theme-toggle-global";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Star Uniform — Billing & Invoicing",
  description: "Multi-tenant billing and invoicing for small businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ThemeToggleGlobal />
        </Providers>
      </body>
    </html>
  );
}
