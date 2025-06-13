'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useSupabase } from '@/components/supabase-provider';

export default function WelcomePage() {
  const router = useRouter();
  const { session } = useSupabase();

  useEffect(() => {
    // If not logged in, redirect to sign up
    if (session === null) {
      router.push('/signup');
    }
  }, [session, router]);

  if (session === null) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a123d] to-[#102147] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />

      <div className="container relative z-30 px-4 md:px-6 max-w-3xl">
        <Card className="backdrop-blur-sm bg-card/60 border-purple-500/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome to Celestial Insights
            </CardTitle>
            <CardDescription className="text-lg">
              Your journey to spiritual enlightenment begins now
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Thank you for joining our community of spiritual seekers. We're excited to help you discover the insights
              hidden in your palm and birth chart. Let's get started on your journey!
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-card/50 border border-purple-500/20 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Palm Reading</h3>
                <p className="text-sm text-muted-foreground">Upload a photo of your palm to receive personalized insights</p>
              </div>
              <div className="bg-card/50 border border-purple-500/20 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Birth Chart</h3>
                <p className="text-sm text-muted-foreground">Enter your birth details for an astrological analysis</p>
              </div>
              <div className="bg-card/50 border border-purple-500/20 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Unlock deeper insights with our subscription plans</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/dashboard" className="flex-1 sm:flex-initial">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/services" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="w-full">
                  Explore Services
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}