import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HandIcon as HandPalmIcon, StarIcon, SparklesIcon, ScrollTextIcon } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <HandPalmIcon className="h-12 w-12 text-purple-400" />,
      title: "AI Palm Reading",
      description: "Our advanced AI analyzes the lines, mounts, and shapes of your palm to provide detailed insights about your personality, talents, relationships, and life path.",
      features: [
        "Line of Life analysis",
        "Heart line interpretation",
        "Head line insights",
        "Fate line examination",
        "Shape and mount analysis"
      ],
      cta: "Try Palm Reading",
      href: "/dashboard?tab=palm-reading"
    },
    {
      icon: <StarIcon className="h-12 w-12 text-blue-400" />,
      title: "Birth Chart Analysis",
      description: "Enter your birth details to receive a comprehensive astrological chart that reveals your celestial blueprint and provides personalized interpretations.",
      features: [
        "Sun, Moon, and Rising sign analysis",
        "Planetary positions and aspects",
        "House placements and interpretations",
        "Major life themes and patterns",
        "Compatibility insights"
      ],
      cta: "Create Birth Chart",
      href: "/dashboard?tab=birth-chart"
    },
    {
      icon: <SparklesIcon className="h-12 w-12 text-indigo-400" />,
      title: "Spiritual Guidance",
      description: "Receive personalized spiritual advice based on your unique energy patterns, cosmic alignments, and life circumstances.",
      features: [
        "Personalized meditation suggestions",
        "Energy alignment recommendations",
        "Spiritual practice guidance",
        "Life purpose insights",
        "Chakra analysis and balancing"
      ],
      cta: "Get Guidance",
      href: "/dashboard"
    },
    {
      icon: <ScrollTextIcon className="h-12 w-12 text-violet-400" />,
      title: "Personalized Reports",
      description: "Access in-depth reports that combine insights from multiple spiritual modalities for a comprehensive understanding of your path.",
      features: [
        "Combined palm and astrological insights",
        "Detailed PDF reports to save and reference",
        "Historical tracking of your spiritual journey",
        "Monthly forecasts and predictions",
        "Personalized growth recommendations"
      ],
      cta: "View Reports",
      href: "/dashboard?tab=insights"
    }
  ];

  return (
    <div className="py-12 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a123d] to-[#102147] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      
      <div className="container relative z-20 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
              Our Spiritual Services
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our range of AI-powered spiritual services designed to illuminate your path
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((service, index) => (
            <Card key={index} className="backdrop-blur-sm bg-card/60 border-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-blue-900/5 opacity-50" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-background/50 p-3 backdrop-blur-sm border border-purple-500/20">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <h4 className="font-medium mb-3">Features:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="relative">
                <Link href={service.href} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    {service.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 bg-card/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Ready to Begin Your Spiritual Journey?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of seekers who have discovered their true path through our AI-powered spiritual insights platform. Sign up today to start your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                  <SparklesIcon className="h-24 w-24 text-purple-400 opacity-70" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,31,162,0.1),transparent_70%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}