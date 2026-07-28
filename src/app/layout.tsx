import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ColorThemeProvider } from "@/components/ColorThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shreesha Mobile | Your Trusted Mobile Store",
  description: "Enterprise Mobile Shop Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            {children}
            <Toaster />
            <div id="google_translate_element" className="hidden opacity-0 invisible absolute pointer-events-none"></div>
          </ColorThemeProvider>
        </ThemeProvider>

        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,mr',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
