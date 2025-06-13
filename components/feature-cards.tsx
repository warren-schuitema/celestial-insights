import { HandIcon as HandPalmIcon, StarIcon, SparklesIcon, ScrollTextIcon } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: <HandPalmIcon className="h-8 w-8 text-purple-400" />,
      title: "AI Palm Reading",
      description: "Upload a photo of your palm and receive detailed insights about your life path, relationships, and potential."
    },
    {
      icon: <StarIcon className="h-8 w-8 text-blue-400" />,
      title: "Birth Chart Analysis",
      description: "Enter your birth details for a comprehensive astrological chart with personalized interpretations."
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-indigo-400" />,
      title: "Spiritual Guidance",
      description: "Receive tailored spiritual advice based on your unique energy patterns and cosmic alignments."
    },
    {
      icon: <ScrollTextIcon className="h-8 w-8 text-violet-400" />,
      title: "Personalized Reports",
      description: "Access in-depth reports and save your insights to track your spiritual journey over time."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-[58rem]">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
              Unlock Your Spiritual Potential
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform combines ancient wisdom with cutting-edge AI to provide accurate and meaningful spiritual insights.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-lg border bg-card p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-background/50 p-3 backdrop-blur-sm border border-purple-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}