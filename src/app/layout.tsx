import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TanGYM - Ghi chép lịch tập gym chuyên nghiệp",
  description: "Ứng dụng theo dõi lịch tập gym tối ưu cho mobile.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TanGYM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="main-wrapper">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
