'use client';

// Enhanced Palm Reading Upload Component - Fixed RLS issue by removing explicit user_id
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { HandIcon as HandPalmIcon, Upload, Loader2, CheckCircle2, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSupabase } from '@/components/supabase-provider';

export default function PalmReadingUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [hand, setHand] = useState<string>('right');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { supabase, session } = useSupabase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPEG, PNG, or WebP image.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateVoiceOracle = async (readingText: string) => {
    if (!session) return;
    
    setIsGeneratingVoice(true);
    try {
      const response = await fetch('/api/voice-oracle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: readingText,
          userId: session.user.id
        }),
      });

      if (response.ok) {
        const voiceData = await response.json();
        if (voiceData.success) {
          const audioBlob = new Blob([
            Uint8Array.from(atob(voiceData.audio), c => c.charCodeAt(0))
          ], { type: voiceData.mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          
          toast({
            title: 'Voice oracle ready!',
            description: 'Your reading is now available in mystical voice form.',
          });
        }
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          toast({
            title: 'Premium feature',
            description: 'Voice oracle is available for premium subscribers.',
            variant: 'destructive',
          });
        } else {
          throw new Error(errorData.error || 'Voice generation failed');
        }
      }
    } catch (error: any) {
      console.error('Voice generation error:', error);
      toast({
        title: 'Voice generation failed',
        description: error.message || 'Could not generate voice oracle.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !session) return;
    
    setIsUploading(true);
    setAnalysisResult(null);
    setAudioUrl(null);
    
    try {
      // Step 1: Upload image to Supabase Storage
      toast({
        title: 'Uploading image...',
        description: 'Please wait while we upload your palm image.',
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-palm-${hand}-${Date.now()}.${fileExt}`;
      const filePath = `palm-readings/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('palm-readings')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Step 2: Create initial database record - REMOVED explicit user_id
      const { data: palmReadingData, error: dbError } = await supabase
        .from('palm_readings')
        .insert({
          image_path: filePath,
          hand_type: hand,
          status: 'pending'
        })
        .select('id')
        .single();
        
      if (dbError) throw dbError;

      setIsUploading(false);
      setIsAnalyzing(true);

      // Step 3: Convert image to base64 for AI analysis
      toast({
        title: 'Image uploaded successfully!',
        description: 'Now analyzing your palm with AI...',
      });

      const imageBase64 = await fileToBase64(file);

      // Step 4: Call OpenAI API for palm reading analysis
      const response = await fetch('/api/palm-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          handType: hand,
          userId: session.user.id,
          userTier: 'free', // TODO: Get actual user tier from subscription
          palmReadingId: palmReadingData.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisData = await response.json();
      setAnalysisResult(analysisData);

      toast({
        title: 'Palm reading complete!',
        description: 'Your spiritual analysis is ready to view.',
      });

      // Step 5: Generate voice oracle for premium users (optional)
      if (analysisData.reading) {
        await generateVoiceOracle(analysisData.reading);
      }
      
      // Reset form
      setFile(null);
      setPreview(null);
      
    } catch (error: any) {
      console.error('Upload/Analysis error:', error);
      
      // Update status to failed if we have a palm reading ID
      if (session) {
        try {
          await supabase
            .from('palm_readings')
            .update({ status: 'failed' })
            .eq('status', 'pending');
        } catch (updateError) {
          console.error('Error updating failed status:', updateError);
        }
      }

      toast({
        title: 'Analysis failed',
        description: error.message || 'There was an error analyzing your palm. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const toggleAudio = () => {
    if (!audioUrl) return;
    
    const audio = document.getElementById('palm-reading-audio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandPalmIcon className="h-6 w-6 text-purple-500" />
            Palm Reading Analysis
          </CardTitle>
          <CardDescription>
            Upload a clear photo of your palm to receive a detailed AI-powered reading
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Your Palm Image</CardTitle>
          <CardDescription>
            Please upload a clear, well-lit photo of your palm against a plain background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center">
            {preview ? (
              <div className="relative w-full max-w-xs mx-auto">
                <img 
                  src={preview} 
                  alt="Palm preview" 
                  className="w-full h-auto rounded-md object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  disabled={isUploading || isAnalyzing}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="w-full py-8 flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-purple-500/10 rounded-full">
                  <Upload className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drag and drop your image here</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    JPEG, PNG or WebP, up to 5MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  id="palm-upload"
                  disabled={isUploading || isAnalyzing}
                />
                <Button asChild variant="outline" size="sm" disabled={isUploading || isAnalyzing}>
                  <label htmlFor="palm-upload" className="cursor-pointer">
                    Select File
                  </label>
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="font-medium">Which hand are you uploading?</div>
            <p className="text-sm text-muted-foreground">
              The dominant hand (writing hand) shows your current path, while the non-dominant hand shows your potential.
            </p>
            <RadioGroup value={hand} onValueChange={setHand} className="mt-2" disabled={isUploading || isAnalyzing}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right Hand (usually dominant for right-handed people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left Hand (usually dominant for left-handed people)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading || isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              'Upload and Analyze'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Analysis Results Card */}
      {analysisResult && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Your Palm Reading
            </CardTitle>
            <CardDescription>
              AI-powered spiritual analysis of your palm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap bg-muted/50 p-6 rounded-lg border">
                {analysisResult.reading}
              </div>
            </div>
            
            {/* Voice Oracle Section */}
            {audioUrl && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-purple-500" />
                    Voice Oracle
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAudio}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                </div>
                <audio
                  id="palm-reading-audio"
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
                <p className="text-xs text-muted-foreground">
                  Listen to your palm reading narrated by our mystical voice oracle
                </p>
              </div>
            )}

            {/* Generate Voice Button for Premium Users */}
            {analysisResult.reading && !audioUrl && !isGeneratingVoice && (
              <Button
                onClick={() => generateVoiceOracle(analysisResult.reading)}
                variant="outline"
                className="w-full"
                disabled={isGeneratingVoice}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Generate Voice Oracle (Premium)
              </Button>
            )}

            {isGeneratingVoice && (
              <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating mystical voice oracle...</span>
              </div>
            )}
            
            {analysisResult.diagram && (
              <div className="space-y-2">
                <h4 className="font-medium">Mystical Hand Diagram</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={analysisResult.diagram} 
                    alt="Tarot-mapped palm diagram" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Reading generated on {new Date(analysisResult.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Palm Reading Guide</CardTitle>
          <CardDescription>
            How to take the perfect palm photo for accurate readings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-green-500 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Good lighting</p>
                <p className="text-sm text-muted-foreground">
                  Take your photo in natural daylight or well-lit room
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-green-500 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Open palm fully</p>
                <p className="text-sm text-muted-foreground">
                  Stretch your fingers apart slightly to see all lines clearly
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-green-500 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Plain background</p>
                <p className="text-sm text-muted-foreground">
                  Use a solid, contrasting background for better analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-green-500 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Clean hands</p>
                <p className="text-sm text-muted-foreground">
                  Wash and dry your hands before taking the photo
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-lg font-medium">Common Mistakes to Avoid</div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Poor lighting or shadows</p>
                <p className="text-sm text-muted-foreground">
                  Makes it difficult to see the lines clearly
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Blurry images</p>
                <p className="text-sm text-muted-foreground">
                  Steady your hand and camera for a clear shot
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Hand not fully visible</p>
                <p className="text-sm text-muted-foreground">
                  Ensure your entire palm and all fingers are in the frame
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}