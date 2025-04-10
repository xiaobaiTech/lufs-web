import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUFS Analyzer",
  description: "Analyze audio files for LUFS measurements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
