import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const team = [
    {
      name: "Mawulom Nenonene",
      role: "Founder & Spiritual Guide",
      image: "/Mawulom.jpg",
      bio: "Mawulɔ̃m carries the wisdom of interfaith teachings, the healing of plant medicine, and the precision of biomedical science. His lived experience, contemplative practice, and meditation informs our spiritual guidance offerings."
    },
    {
      name: "Warren Schuitema",
      role: "Chief AI Engineer",
      image: "/3eEbkcdwaLZQ5sLM1Hybl_825df02bd20d49ff9a2a3ffc2885bb60.png",
      bio: "Warren leads our AI development team, creating algorithms that blend ancient wisdom with cutting-edge machine learning."
    },
    {
      name: "Aisha Patel",
      role: "Palmistry Expert",
      image: "https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=500",
      bio: "With over a decade studying hand analysis across traditions, Aisha brings deep expertise to our palm reading systems."
    },
    {
      name: "Elijah Thompson",
      role: "Technology Integration Specialist",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=500",
      bio: "Elijah bridges the gap between ancient spiritual practices and modern technology, ensuring our platform honors traditional wisdom while leveraging cutting-edge AI capabilities."
    }
  ];

  return (
    <div className="py-12 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a123d] to-[#102147] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      
      <div className="container relative z-20 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
              About Celestial Insights
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Merging ancient wisdom with artificial intelligence to guide your spiritual journey
            </p>
          </div>
        </div>
        
        <div className="grid gap-12 md:gap-16 mt-12 md:mt-16">
          <section className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Mission</h2>
              <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                At Celestial Insights, we believe that everyone deserves access to spiritual guidance that can help navigate life's journey. Our mission is to democratize access to personalized spiritual insights by combining the ancient arts of palmistry and astrology with modern AI technology.
              </p>
              <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                We're committed to creating a platform that respects all spiritual traditions while providing accurate, meaningful, and accessible insights to people from all walks of life.
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-purple-900/30 backdrop-blur-md border border-purple-500/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-300"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                    <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
                    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Approach</h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                We combine time-honored spiritual traditions with cutting-edge technology
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="rounded-lg border bg-card/60 backdrop-blur-sm border-purple-500/20 p-6">
                <div className="p-2 bg-purple-500/10 rounded-full w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <path d="M21 8.5c0 .83-.67 1.5-1.5 1.5S18 9.33 18 8.5s.67-1.5 1.5-1.5S21 7.67 21 8.5z" />
                    <path d="M3 8.5c0 .83.67 1.5 1.5 1.5S6 9.33 6 8.5 5.33 7 4.5 7 3 7.67 3 8.5z" />
                    <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                    <path d="M7.5 15h9" />
                    <path d="M7.5 18h9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mt-4">Respectful Integration</h3>
                <p className="text-muted-foreground mt-2">
                  We respectfully integrate knowledge from various spiritual traditions, ensuring cultural appreciation without appropriation.
                </p>
              </div>
              <div className="rounded-lg border bg-card/60 backdrop-blur-sm border-purple-500/20 p-6">
                <div className="p-2 bg-blue-500/10 rounded-full w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m16 6-4 4-4-4" />
                    <path d="M16 18a4 4 0 0 0-8 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mt-4">AI Enhancement</h3>
                <p className="text-muted-foreground mt-2">
                  Our advanced AI algorithms analyze patterns in palm images and birth data, providing insights that might be missed by human interpretation alone.
                </p>
              </div>
              <div className="rounded-lg border bg-card/60 backdrop-blur-sm border-purple-500/20 p-6">
                <div className="p-2 bg-indigo-500/10 rounded-full w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-500"
                  >
                    <path d="M2 12h10" />
                    <path d="M9 4v16" />
                    <path d="m3 9 3 3-3 3" />
                    <path d="M14 8V6c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mt-4">Personal Empowerment</h3>
                <p className="text-muted-foreground mt-2">
                  We believe in providing insights that empower individuals to make their own decisions, not prescriptive directions that limit free will.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Meet Our Team</h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                The experts behind Celestial Insights combine deep spiritual knowledge with technical expertise
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              {team.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-background bg-card/60 backdrop-blur-sm">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-purple-400">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-card/60 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold">Begin Your Spiritual Journey Today</h2>
              <p className="text-muted-foreground">
                Join thousands of seekers who have discovered their true path through our AI-powered spiritual insights.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}