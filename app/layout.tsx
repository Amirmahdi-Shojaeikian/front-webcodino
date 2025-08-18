import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AppShell from "@/components/AppShell";
import NeonParticlesBackground from "@/components/NeonParticlesBackground";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastContainer from "@/components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "وب کدینو | طراحی سایت، اپلیکیشن و هاست",
  description: "شرکت وب کدینو ارائه‌دهنده خدمات طراحی سایت، اپلیکیشن، سرور، هاست و تولید محتوا. کیفیت و امنیت را با ما تجربه کنید.",
  keywords: "طراحی سایت, اپلیکیشن, هاست, سرور, وب کدینو",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <AppShell>
            <NeonParticlesBackground />
            <Navbar />
            <ToastContainer />
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
