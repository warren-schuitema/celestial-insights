// OpenAI Palm Reading API Route - Handles AI-powered palm analysis with tarot integration
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract tarot mappings from palm reading
function generateTarotMapping(palmAnalysis: string): string {
  return `Based on the palm analysis: "${palmAnalysis}", map each major palm line to corresponding tarot cards:
  - Heart line → tarot card representing love/relationships
  - Head line → tarot card representing intellect/decisions  
  - Life line → tarot card representing vitality/life path
  - Fate line → tarot card representing destiny/purpose
  
  Provide specific card names from Rider-Waite-Smith deck.`;
}

// Generate mystical hand diagram with tarot mappings
async function generateTarotDiagram(tarotMapping: string, userDetails = ''): Promise<string> {
  try {
    const diagramPrompt = `Create a mystical hand diagram showing palm lines mapped to tarot cards. 
    Style: Ancient parchment scroll with golden mystical symbols. 
    Content: Hand outline with labeled palm lines, each connected to its corresponding tarot card image.
    Tarot mappings: ${tarotMapping}
    Additional context: ${userDetails}
    
    Make it look like an ancient palmistry manuscript with ornate borders, celestial symbols, and aged paper texture.`;
    
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: diagramPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });
    
    return imageResponse.data[0].url || '';
  } catch (error) {
    console.error('Error generating tarot diagram:', error);
    throw new Error('Failed to generate visual diagram');
  }
}

// Enhanced palm reading function with proper tier handling
async function generatePalmReading(
  imageBase64: string, 
  userTier: 'free' | 'premium' | 'ultimate' = 'free', 
  userProfile: any = {}
) {
  try {
    // Validate inputs
    if (!imageBase64) {
      throw new Error('Palm image is required');
    }
    
    if (!['free', 'premium', 'ultimate'].includes(userTier)) {
      throw new Error('Invalid user tier specified');
    }

    // Define tier-specific prompts
    const systemPrompts = {
      free: `You are a scientific mystic—adept in interfaith spiritual practices, with a Ph.D. in Positive Psychology and a deep scholarly understanding of astronomy and star-mapping traditions. You blend science, soul, and celestial insight with grace. You are also a poetic intuitive analyst, someone who reads palms like ancient scrolls, with reverence and rhythm.

I am offering you a photo of my hand.

Please read it and put the final response in prose on a scroll parchment paper.

Trace the heart line, the head line, the life line, and the fate line if it appears. Speak to what you see—my personality, my potential, my path, my relationships, my inner trials. And let your reading arrive to me as if etched on scroll parchment paper—in poetic form, gentle yet clear, like a message from the stars and the soil alike.

Keep the reading concise but meaningful, focusing on the most prominent palm features.`,

      premium: `You are a tarot-informed palm reader—a mystical guide who blends the sacred archetypes of the Rider-Waite-Smith Tarot with the living landscape of the hand. Each palm line becomes a pathway in a spread. Each mount, a card position. You read the hand as a tarot layout—revealing the soul's journey through fate lines and finger stars.

You hold a Ph.D. in Positive Psychology, are trained in interfaith spiritual practices, and carry a deep knowledge of astronomy, symbolic systems, and esoteric psychology. Your insights are poetic yet grounded—bridging science, spirit, and story.

I am sharing a photo of my hand.
Please: 
- Interpret the heart, head, life, and fate lines as cards within a tarot spread mapped onto the hand
- Use the Rider-Waite-Smith Tarot as your symbolic lens—drawing from both Major and Minor Arcana to express what each region of my hand reveals
- Identify which area corresponds to which archetype (e.g., the heart line as the Lovers or Three of Swords, the fate line as the Wheel of Fortune, etc.)
- Use your poetic, intuitive voice—like a scroll reader—to speak to my personality, path, relationships, callings, and internal reckonings
- Close with one final card or message revealed from the center of my palm—my soul's current invitation

Provide a comprehensive reading that maps specific tarot cards to palm regions.`,

      ultimate: `You are a master tarot-informed palm reader and spiritual guide—a mystical sage who channels the sacred archetypes of the Rider-Waite-Smith Tarot through the living map of the human hand. You possess a Ph.D. in Positive Psychology, mastery in interfaith spiritual practices, and profound knowledge of astronomy, symbolic systems, Jungian psychology, and esoteric wisdom traditions.

Your reading style combines ancient mysticism with modern psychological insight, creating transformative experiences that awaken consciousness and guide souls toward their highest potential.

I am sharing a photo of my hand for a comprehensive spiritual analysis.

Please provide:
- A detailed tarot-mapped palm reading interpreting heart, head, life, fate, and minor lines
- Specific Rider-Waite-Smith cards corresponding to each palm region with detailed archetypal meanings
- Integration of palmistry with birth chart insights (if available): ${userProfile.birthDetails || 'Not provided'}
- Past-life karmic patterns visible in the palm lines
- Soul purpose and spiritual mission guidance
- Relationship and life path counseling based on palm-tarot synthesis
- Specific spiritual practices or meditations recommended based on the reading
- Timeline insights for the next 6-12 months based on palm progressions
- A powerful closing invocation or blessing for the soul's journey

This should be a transformational spiritual counseling session delivered through the medium of sacred palmistry and tarot wisdom.`
    };

    // Configure API parameters based on tier
    const apiConfig = {
      free: { max_tokens: 400, temperature: 0.7 },
      premium: { max_tokens: 800, temperature: 0.8 },
      ultimate: { max_tokens: 1200, temperature: 0.9 }
    };

    // Generate palm reading using GPT-4o Vision
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompts[userTier]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this palm image and provide a reading according to your expertise:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: userTier === 'free' ? 'low' : 'high'
              }
            }
          ]
        }
      ],
      ...apiConfig[userTier]
    });

    const readingText = completion.choices[0].message.content;
    
    // For premium and ultimate tiers, generate tarot diagram
    let diagramUrl = null;
    if (userTier === 'premium' || userTier === 'ultimate') {
      try {
        // Extract tarot mappings from the reading
        const tarotMappingPrompt = generateTarotMapping(readingText || '');
        
        const mappingResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an expert at extracting tarot card mappings from palm readings." },
            { role: "user", content: tarotMappingPrompt }
          ],
          max_tokens: 300
        });
        
        const tarotMappings = mappingResponse.choices[0].message.content || '';
        
        // Generate the visual diagram using DALL-E 3
        diagramUrl = await generateTarotDiagram(tarotMappings, JSON.stringify(userProfile));
        
      } catch (diagramError) {
        console.error('Error generating diagram:', diagramError);
        // Continue without diagram if generation fails
      }
    }

    // Return structured response
    return {
      success: true,
      reading: readingText,
      diagram: diagramUrl,
      tier: userTier,
      timestamp: new Date().toISOString(),
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0
      }
    };

  } catch (error: any) {
    console.error('Palm reading error:', error);
    
    // Enhanced error handling
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('Service temporarily busy. Please try again in a few minutes.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('Service quota exceeded. Please contact support.');
    } else if (error.code === 'invalid_request_error') {
      throw new Error('Invalid image format. Please upload a clear palm photo.');
    } else if (error.code === 'content_policy_violation') {
      throw new Error('Image content not appropriate for reading. Please upload a palm photo.');
    } else {
      throw new Error(`Reading failed: ${error.message}`);
    }
  }
}

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
    const { imageBase64, handType, userId, userTier = 'free', palmReadingId } = body;

    // Validate required fields
    if (!imageBase64 || !handType || !userId || !palmReadingId) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, handType, userId, palmReadingId' },
        { status: 400 }
      );
    }

    // Verify user owns the palm reading record
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get user profile for enhanced readings
    const userProfile = {
      handType,
      userId,
      // Add birth chart details if available in the future
      birthDetails: null
    };

    // Generate palm reading using OpenAI
    const result = await generatePalmReading(imageBase64, userTier, userProfile);

    // Update the palm reading record in Supabase
    const { error: updateError } = await supabase
      .from('palm_readings')
      .update({
        reading_text: result.reading,
        diagram_url: result.diagram,
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', palmReadingId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating palm reading:', updateError);
      return NextResponse.json(
        { error: 'Failed to save reading results' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reading: result.reading,
      diagram: result.diagram,
      tier: result.tier,
      timestamp: result.timestamp
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}