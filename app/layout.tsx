// Updated layout.tsx to handle font loading errors more gracefully
// Added fallback font handling and improved error resilience
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseProvider } from '@/components/supabase-provider';
import { StarsBackground } from '@/components/ui/stars-background';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Celestial Insights - AI Spiritual Guidance',
  description: 'Discover your spiritual path with AI-powered palm reading and astrological insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseProvider>
            <div className="flex flex-col min-h-screen bg-background relative">
              <StarsBackground 
                starDensity={0.00015}
                allStarsTwinkle={true}
                twinkleProbability={0.7}
                minTwinkleSpeed={0.5}
                maxTwinkleSpeed={1}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
              <div className="relative z-20">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}