// ElevenLabs Voice Oracle API Route - Converts palm readings to mystical voice narration
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, userId, voiceId = process.env.ELEVENLABS_VOICE_ID } = body;

    if (!text || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: text, userId' },
        { status: 400 }
      );
    }

    // Verify user authorization
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if user has premium access for voice features
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError || !profile || !['premium', 'ultimate'].includes(profile.subscription_tier)) {
      return NextResponse.json(
        { error: 'Premium subscription required for voice oracle feature' },
        { status: 403 }
      );
    }

    // Check if ElevenLabs API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      );
    }

    // Generate voice with ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      throw new Error(`Voice generation failed: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    // Convert to base64 for transmission
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio: audioBase64,
      mimeType: 'audio/mpeg'
    });

  } catch (error: any) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Voice generation failed' },
      { status: 500 }
    );
  }
}