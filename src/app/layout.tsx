import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HelpDesk — Support Ticketing",
  description: "Professional customer support ticketing system",
};

export const viewport: Viewport = {
  themeColor: "#00c2ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className={`${inter.className} h-full`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
