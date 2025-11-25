'use client';

import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <HeartPulse className="relative z-10 h-24 w-24 text-primary" />
        <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/50" />
        <div className="absolute h-40 w-40 animate-ping rounded-full bg-primary/30 [animation-delay:0.5s]" />
      </div>
      <div className="mt-8 text-center">
        <h1 className="font-headline text-5xl font-bold text-foreground">
          Blood Bridge
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bridging the gap between need & donor.
        </p>
      </div>