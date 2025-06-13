'use client';

// Updated Dashboard Page - Fixed tab navigation using URL query parameters
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HandIcon as HandPalmIcon, StarIcon, SparklesIcon, ScrollTextIcon } from 'lucide-react';
import { useSupabase } from '@/components/supabase-provider';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import PalmReadingUpload from '@/components/dashboard/palm-reading-upload';
import BirthChartForm from '@/components/dashboard/birth-chart-form';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // If not logged in, redirect to login
    if (session === null) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
    // Read tab from URL query parameters
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['overview', 'palm-reading', 'birth-chart', 'insights'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page reload
    const newUrl = value === 'overview' ? '/dashboard' : `/dashboard?tab=${value}`;
    router.push(newUrl, { scroll: false });
  };

  if (session === null) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="container px-4 md:px-6">
        <DashboardHeader />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="palm-reading">Palm Reading</TabsTrigger>
            <TabsTrigger value="birth-chart">Birth Chart</TabsTrigger>
            <TabsTrigger value="insights">My Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
                  <CardDescription>Your spiritual analysis history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">Start your first reading today</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <CardDescription>Your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Free</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Link href="/pricing" className="underline">Upgrade for more insights</Link>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Palm Readings</CardTitle>
                  <CardDescription>Hand analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">Upload your palm photo to begin</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Birth Charts</CardTitle>
                  <CardDescription>Astrological profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">Enter your birth details to begin</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                  <CardDescription>Choose a spiritual service to begin your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-500/10 rounded-full">
                        <HandPalmIcon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">Palm Reading</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload a clear photo of your palm to receive AI-powered insights about your life path.
                        </p>
                        <Link href="/dashboard?tab=palm-reading">
                          <Button variant="link" className="p-0 h-auto">
                            Start a palm reading
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-500/10 rounded-full">
                        <StarIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">Birth Chart</h4>
                        <p className="text-sm text-muted-foreground">
                          Enter your birth details to generate a complete astrological profile and interpretation.
                        </p>
                        <Link href="/dashboard?tab=birth-chart">
                          <Button variant="link" className="p-0 h-auto">
                            Create a birth chart
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your spiritual journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-3">
                    <SparklesIcon className="h-12 w-12 text-muted-foreground/30" />
                    <div className="space-y-1">
                      <h4 className="font-medium">No activity yet</h4>
                      <p className="text-sm text-muted-foreground">
                        Your recent readings and insights will appear here.
                      </p>
                    </div>
                    <Link href="/services">
                      <Button variant="outline" size="sm">Explore Services</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="palm-reading">
            <PalmReadingUpload />
          </TabsContent>
          
          <TabsContent value="birth-chart">
            <BirthChartForm />
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Your Spiritual Insights</CardTitle>
                <CardDescription>View and manage your past readings and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3">
                  <ScrollTextIcon className="h-16 w-16 text-muted-foreground/30" />
                  <div className="space-y-1">
                    <h4 className="text-xl font-medium">No insights yet</h4>
                    <p className="text-muted-foreground max-w-md">
                      Start your spiritual journey by getting a palm reading or birth chart analysis.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Link href="/dashboard?tab=palm-reading">
                      <Button variant="outline">Get Palm Reading</Button>
                    </Link>
                    <Link href="/dashboard?tab=birth-chart">
                      <Button variant="outline">Create Birth Chart</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}