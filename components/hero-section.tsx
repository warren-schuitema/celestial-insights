'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="container relative z-20 px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
                Discover Your Spiritual Path with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Unlock the secrets of your palm and the stars with our AI-powered spiritual guidance platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-purple-500/20 p-8 shadow-xl">
              <div className="space-y-4 text-center">
                <div className="inline-block rounded-full bg-purple-500/20 p-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Mystical Insights Await</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your palm lines and birth chart to reveal your hidden potential and guide your spiritual journey.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-1 rounded-full bg-purple-500" />
                    <p className="text-xs text-muted-foreground">Palm Reading Analysis</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                    <p className="text-xs text-muted-foreground">Birth Chart Interpretation</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-1 rounded-full bg-indigo-500" />
                    <p className="text-xs text-muted-foreground">Personalized Spiritual Guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}