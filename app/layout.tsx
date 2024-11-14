import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import ClientLayoutWrapper from "@/providers/ClientLayoutWrapper";
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
  title: "HackKU25",
  description: "HackKU Portal",
  icons: {
    icon: "/images/duck2.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head></head>
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
                <main className="flex-grow">
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </main>
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
