'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { StarIcon, Loader2 } from 'lucide-react';
import { useSupabase } from '@/components/supabase-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const birthChartSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
  birthTime: z.string().min(1, 'Birth time is required'),
  birthPlace: z.string().min(3, 'Birth place must be at least 3 characters'),
  gender: z.string().optional(),
});

type BirthChartFormValues = z.infer<typeof birthChartSchema>;

export default function BirthChartForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, session } = useSupabase();
  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BirthChartFormValues>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: {
      name: '',
      birthDate: new Date(),
      birthTime: '',
      birthPlace: '',
      gender: 'not-specified',
    },
  });

  const onSubmit = async (data: BirthChartFormValues) => {
    if (!session) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('birth_charts')
        .insert({
          user_id: session.user.id,
          name: data.name,
          birth_date: format(data.birthDate, 'yyyy-MM-dd'),
          birth_time: data.birthTime,
          birth_place: data.birthPlace,
          gender: data.gender,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: 'Birth chart details submitted!',
        description: 'Your astrological chart is being generated.',
      });
      
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission failed',
        description: error.message || 'There was an error submitting your birth chart details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="h-6 w-6 text-blue-500" />
            Birth Chart Analysis
          </CardTitle>
          <CardDescription>
            Enter your birth details to receive a comprehensive astrological chart and interpretation
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Birth Details</CardTitle>
          <CardDescription>
            Please provide accurate information for the most precise astrological reading
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-lg border border-border p-2 bg-background"
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={currentYear}
                    defaultMonth={field.value}
                    disabled={{ after: new Date() }}
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">{errors.birthDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth Time (as accurate as possible)</Label>
              <Input
                id="birthTime"
                type="time"
                {...register('birthTime')}
              />
              {errors.birthTime && (
                <p className="text-sm text-destructive">{errors.birthTime.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                If you don't know the exact time, provide your best estimate or select 12:00 PM
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input
                id="birthPlace"
                placeholder="City, Country"
                {...register('birthPlace')}
              />
              {errors.birthPlace && (
                <p className="text-sm text-destructive">{errors.birthPlace.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Gender (optional)</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-binary" id="non-binary" />
                      <Label htmlFor="non-binary">Non-binary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-specified" id="not-specified" />
                      <Label htmlFor="not-specified">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Chart...
                </>
              ) : (
                'Generate Birth Chart'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Birth Charts</CardTitle>
          <CardDescription>
            Understanding astrological birth charts and their significance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">What is a Birth Chart?</h3>
            <p className="text-sm text-muted-foreground">
              A birth chart, also known as a natal chart, is a map of where all the planets were in their journey around the Sun at the exact moment you were born. Think of it as a snapshot of the sky when you entered the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">What Your Birth Chart Reveals</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/10 text-blue-500 p-1 rounded-full text-xs">♈︎</span>
                <div>
                  <p className="text-sm font-medium">Sun Sign</p>
                  <p className="text-xs text-muted-foreground">Your core identity and ego</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-purple-500/10 text-purple-500 p-1 rounded-full text-xs">♋︎</span>
                <div>
                  <p className="text-sm font-medium">Moon Sign</p>
                  <p className="text-xs text-muted-foreground">Your emotional nature and subconscious</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-500/10 text-indigo-500 p-1 rounded-full text-xs">♑︎</span>
                <div>
                  <p className="text-sm font-medium">Rising Sign (Ascendant)</p>
                  <p className="text-xs text-muted-foreground">How others perceive you</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-rose-500/10 text-rose-500 p-1 rounded-full text-xs">♀︎</span>
                <div>
                  <p className="text-sm font-medium">Venus Placement</p>
                  <p className="text-xs text-muted-foreground">Your love language and values</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-500/10 text-red-500 p-1 rounded-full text-xs">♂︎</span>
                <div>
                  <p className="text-sm font-medium">Mars Placement</p>
                  <p className="text-xs text-muted-foreground">Your drive and ambition</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Why Birth Time Matters</h3>
            <p className="text-sm text-muted-foreground">
              The exact time of birth is crucial for accurate readings. Even a difference of a few minutes can change your Rising Sign and the positions of planets in the houses of your chart.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}