// Updated Authentication Callback - Automatically creates user profiles upon successful authentication
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange code for session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
      }

      if (session?.user) {
        // Check if user profile already exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Error checking profile:', profileCheckError);
        }

        // Create profile if it doesn't exist
        if (!existingProfile) {
          const { error: profileInsertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              subscription_tier: 'free',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileInsertError) {
            console.error('Error creating profile:', profileInsertError);
            // Don't fail the auth flow, just log the error
          }
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/welcome', request.url));
}