'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/components/supabase-provider';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const { session } = useSupabase();
  
  const plans = [
    {
      name: 'Free',
      description: 'Basic spiritual insights for beginners',
      price: { monthly: 0, yearly: 0 },
      features: [
        '3 Palm readings per month',
        '1 Birth chart analysis',
        'Basic interpretation',
        'Email support',
      ],
      cta: 'Get Started',
      href: session ? '/dashboard' : '/signup',
      popular: false,
    },
    {
      name: 'Premium',
      description: 'Advanced insights for dedicated spiritual seekers',
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        'Unlimited palm readings',
        'Unlimited birth chart analyses',
        'Detailed interpretations',
        'Relationship compatibility',
        'Monthly forecast',
        'Priority email support',
      ],
      cta: 'Upgrade Now',
      href: session ? '/checkout?plan=premium' : '/signup?plan=premium',
      popular: true,
    },
    {
      name: 'Ultimate',
      description: 'Complete spiritual guidance for serious practitioners',
      price: { monthly: 19.99, yearly: 199.99 },
      features: [
        'All Premium features',
        'Personalized spiritual guidance',
        'Life path predictions',
        'Career and financial insights',
        'Health and wellness guidance',
        'Priority phone support',
        'Access to exclusive workshops',
      ],
      cta: 'Get Ultimate',
      href: session ? '/checkout?plan=ultimate' : '/signup?plan=ultimate',
      popular: false,
    },
  ];

  return (
    <div className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a123d] to-[#102147] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      
      <div className="container relative z-20 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
              Choose Your Spiritual Journey
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the plan that best fits your spiritual exploration needs
            </p>
          </div>
          
          <div className="flex items-center space-x-4 rounded-lg border p-1 bg-card/50 backdrop-blur-sm border-purple-500/20">
            <Button
              variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
              className={cn(
                billingInterval === 'monthly' && 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
              )}
              onClick={() => setBillingInterval('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
              className={cn(
                billingInterval === 'yearly' && 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
              )}
              onClick={() => setBillingInterval('yearly')}
            >
              Yearly <span className="ml-1 text-xs opacity-80">Save 20%</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={cn(
                "backdrop-blur-sm border-purple-500/20 relative flex flex-col",
                plan.popular ? "border-purple-500/50 shadow-xl shadow-purple-900/10" : "bg-card/60"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-center text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-baseline text-3xl font-bold">
                    ${plan.price[billingInterval]}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      /{billingInterval === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                        : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="rounded-xl border p-6 bg-card/50 backdrop-blur-sm border-purple-500/20 max-w-3xl">
            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="text-left">
                <h4 className="font-medium">Can I switch plans later?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, you can upgrade or downgrade your plan at any time.
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-medium">Is there a refund policy?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We offer a 14-day money-back guarantee on all paid plans.
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-medium">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We accept all major credit cards and PayPal.
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-medium">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, you can cancel your subscription at any time with no penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}