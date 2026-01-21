import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthToast } from "@/components/auth-toast";
import { Suspense } from "react";
import { ThemeHydration } from "@/components/providers/ThemeHydration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://supercv.ai'),
  title: {
    default: "Super CV | AI-Powered Resume Architect",
    template: "%s | Super CV"
  },
  description: "Transform your career with AI-powered resume analysis. Get ATS-optimized, recruiter-approved CVs that land 3x more interviews.",
  keywords: ["resume", "CV", "AI", "ATS", "job search", "career", "resume builder", "resume analyzer"],
  authors: [{ name: "Super CV" }],
  creator: "Super CV",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://supercv.ai",
    siteName: "Super CV",
    title: "Super CV | AI-Powered Resume Architect",
    description: "Transform your career with AI-powered resume analysis. Get ATS-optimized, recruiter-approved CVs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Super CV - AI Resume Architect"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Super CV | AI-Powered Resume Architect",
    description: "Transform your career with AI-powered resume analysis.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen font-sans",
        inter.variable,
        playfair.variable
      )}>
        <AuthProvider>
          <QueryProvider>
            <ThemeHydration />
            {children}
            <Toaster position="top-center" richColors />
            <Suspense fallback={null}>
              <AuthToast />
            </Suspense>
          </QueryProvider>
        </AuthProvider>

        {/* Dify AI Career Coach Chatbot */}
        <Script id="dify-config" strategy="lazyOnload">
          {`
            window.difyChatbotConfig = {
              token: 'lW6CLN40cB6KdrxB',
              inputs: {},
              systemVariables: {},
              userVariables: {},
            }
          `}
        </Script>
        <Script
          src="https://udify.app/embed.min.js"
          id="lW6CLN40cB6KdrxB"
          strategy="lazyOnload"
        />
        <style jsx global>{`
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}</style>
      </body>
    </html>
  );
}