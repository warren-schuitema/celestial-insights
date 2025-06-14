'use client';

import { useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function PalmReading() {
  const [imageFile, setImageFile] = useState(null);
  const [handType, setHandType] = useState('right');
  const [reading, setReading] = useState('');
  const [diagram, setDiagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }

      setImageFile(file);
      setError('');
      
      // Create preview
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
        // Remove the data:image/jpeg;base64, prefix
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
    setDiagram('');

    try {
      // Step 1: Get user profile to determine tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            subscription_tier: 'free'
          });
        
        if (insertError) {
          throw new Error('Failed to create user profile');
        }
      }

      const userTier = profile?.subscription_tier || 'free';

      // Step 2: Create palm reading record
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
        throw new Error('Failed to create palm reading record');
      }

      // Step 3: Convert image to base64
      const imageBase64 = await convertToBase64(imageFile);

      // Step 4: Call API to process the palm reading
      const response = await fetch('/api/palm-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageBase64,
          handType: handType,
          userId: user.id,
          userTier: userTier,
          palmReadingId: palmReading.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Reading generation failed');
      }

      // Step 5: Display results
      setReading(data.reading);
      if (data.diagram) {
        setDiagram(data.diagram);
      }

    } catch (err) {
      console.error('Palm reading error:', err);
      setError(err.message || 'Failed to generate reading');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Palm Reading Oracle</h2>
          <p className="text-gray-600">Please log in to access palm reading features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Palm Reading Oracle
        </h2>

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
            Upload a clear photo of your palm (max 5MB)
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
              Analyzing Your Palm...
            </div>
          ) : (
            'Upload and Analyze'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Reading Results */}
        {reading && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Palm Reading
            </h3>
            <div className="prose prose-purple max-w-none">
              {reading.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Tarot Diagram for Premium/Ultimate users */}
            {diagram && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Mystical Hand Diagram
                </h4>
                <div className="flex justify-center">
                  <img
                    src={diagram}
                    alt="Tarot hand diagram"
                    className="max-w-full rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}