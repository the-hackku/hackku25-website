import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { authOptions } from "@/lib/authoptions";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/ProgressBarProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HackKU25 – KU's Premier Hackathon Experience",
  description:
    "The Official Website for HackKU 2025. Join us for a weekend of innovation, coding, and creativity at the University of Kansas!",
  icons: {
    icon: "/images/branding/logo_white_bg.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <NextAuthProvider session={session}>
            <Providers>
              <div className="flex flex-col min-h-screen">
                <HeaderWrapper />
                <main className="flex-grow">{children}</main>
                <Footer />
                <Toaster />
              </div>
            </Providers>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
