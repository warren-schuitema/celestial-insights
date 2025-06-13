'use client';

import { useSupabase } from '@/components/supabase-provider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

export default function DashboardHeader() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.email?.split('@')[0] || 'User'}! Explore your spiritual journey.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}