import Link from 'next/link';
import { SparklesIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">Celestial Insights</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Unlock your spiritual potential with AI-powered insights.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 md:gap-16 lg:gap-20 sm:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Services</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/services/palm-reading" className="text-sm hover:underline text-muted-foreground">
                Palm Reading
              </Link>
              <Link href="/services/birth-chart" className="text-sm hover:underline text-muted-foreground">
                Birth Chart
              </Link>
              <Link href="/services/spiritual-guidance" className="text-sm hover:underline text-muted-foreground">
                Spiritual Guidance
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm hover:underline text-muted-foreground">
                About
              </Link>
              <Link href="/blog" className="text-sm hover:underline text-muted-foreground">
                Blog
              </Link>
              <Link href="/contact" className="text-sm hover:underline text-muted-foreground">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm hover:underline text-muted-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm hover:underline text-muted-foreground">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm hover:underline text-muted-foreground">
                Cookies
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Connect</h3>
            <nav className="flex flex-col gap-2">
              <Link href="https://twitter.com" className="text-sm hover:underline text-muted-foreground">
                Twitter
              </Link>
              <Link href="https://instagram.com" className="text-sm hover:underline text-muted-foreground">
                Instagram
              </Link>
              <Link href="https://facebook.com" className="text-sm hover:underline text-muted-foreground">
                Facebook
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mt-8 flex flex-col items-center md:flex-row md:justify-between px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Celestial Insights. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-2 md:mt-0">
          This site is for entertainment purposes only.
        </p>
      </div>
    </footer>
  );
}