'use client';

import { useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function PalmReading() {
  const [imageFile, setImageFile] = useState(null);
  const [handType, setHandType] = useState('right');
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }

      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateReading = async () => {
    if (!imageFile || !user) {
      setError('Please upload an image and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError('');
    setReading('');

    try {
      console.log('🔮 Starting secure palm reading...');

      // Step 1: Ensure user profile exists
      let userTier = 'free';
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          console.log('👤 Creating user profile...');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              subscription_tier: 'free'
            });
          
          if (insertError) {
            throw new Error(`Failed to create user profile: ${insertError.message}`);
          }
          userTier = 'free';
        } else if (profileError) {
          throw new Error(`Profile error: ${profileError.message}`);
        } else {
          userTier = profile?.subscription_tier || 'free';
        }
      } catch (profileErr) {
        console.error('Profile error:', profileErr);
        userTier = 'free';
      }

      console.log(`📋 User tier: ${userTier}`);

      // Step 2: Create palm reading record
      console.log('📝 Creating palm reading record...');
      const { data: palmReading, error: createError } = await supabase
        .from('palm_readings')
        .insert({
          user_id: user.id,
          hand_type: handType,
          status: 'pending',
          tier: userTier
        })
        .select()
        .single();

      if (createError) {
        console.error('Create palm reading error:', createError);
        throw new Error(`Failed to create palm reading record: ${createError.message}`);
      }

      console.log(`✅ Record created: ${palmReading.id}`);

      // Step 3: Convert image to base64
      console.log('🖼️ Converting image...');
      const imageBase64 = await convertToBase64(imageFile);

      // Step 4: Call Supabase Edge Function (SECURE!)
      console.log('🔐 Calling secure Edge Function...');
      const { data, error: functionError } = await supabase.functions.invoke('palm-reading', {
        body: {
          imageBase64: imageBase64,
          handType: handType,
          userId: user.id,
          userTier: userTier,
          palmReadingId: palmReading.id
        }
      });

      console.log('📡 Edge Function response:', data);

      if (functionError) {
        console.error('Edge Function error:', functionError);
        throw new Error(functionError.message || 'Edge Function call failed');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Reading generation failed');
      }

      // Step 5: Display results
      console.log('✨ Displaying results...');
      setReading(data.reading);

      console.log('🎉 Palm reading completed successfully!');

    } catch (err) {
      console.error('❌ Palm reading error:', err);
      setError(err.message || 'Failed to generate reading');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔮 Palm Reading Oracle</h2>
          <p className="text-gray-600">Please log in to access palm reading features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          🔮 Secure Palm Reading Oracle
        </h2>

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">🔐</span>
            <div>
              <p className="text-green-700 text-sm font-medium">Secure Edge Function Active</p>
              <p className="text-green-600 text-xs">Your API keys are protected and never exposed to the client</p>
            </div>
          </div>
        </div>

        {/* Hand Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Hand
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="handType"
                value="left"
                checked={handType === 'left'}
                onChange={(e) => setHandType(e.target.value)}
                className="mr-2"
              />
              Left Hand
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="handType"
                value="right"
                checked={handType === 'right'}
                onChange={(e) => setHandType(e.target.value)}
                className="mr-2"
              />
              Right Hand
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Palm Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            📸 Upload a clear photo of your palm (max 5MB) - Processed via secure Edge Function
          </p>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Palm preview"
                className="max-w-xs max-h-64 object-contain rounded-lg border"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateReading}
          disabled={!imageFile || loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            !imageFile || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              🔐 Securely Analyzing Your Palm...
            </div>
          ) : (
            '🔐 Secure Analysis via Edge Function'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-xs mt-1">Check browser console for detailed logs</p>
              </div>
            </div>
          </div>
        )}

        {/* Reading Results */}
        {reading && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-4">
              <span className="text-purple-600 mr-2">🔮</span>
              <h3 className="text-xl font-semibold text-gray-900">
                Your Mystical Palm Reading
              </h3>
              <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                🔐 Secure
              </span>
            </div>
            <div className="prose prose-purple max-w-none">
              {reading.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}