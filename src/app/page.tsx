'use client';

import Link from 'next/link';
import { HeartPulse, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { MissionDialog } from '@/components/app/home/mission-dialog';

export default function Home() {
  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 z-0">
        <video
          src="https://cdn.pixabay.com/video/2019/09/12/26799-359604172_large.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      <div 
        className="z-10 flex flex-col items-center text-center animate-fade-in-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}
      >
        <HeartPulse className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-slow" />
        <h1 className="font-headline text-8xl font-extrabold tracking-wider text-foreground sm:text-9xl md:text-[10rem]">
          Blood Bridge
        </h1>
        <p className="mt-4 text-lg font-medium text-muted-foreground md:text-xl">
          Bridging the gap between need & donor.
        </p>

        <div 
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}
        >
          <Button asChild size="lg" className="text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1">
            <Link href="/dashboard">
              <Zap className="mr-2 h-5 w-5" />
              Launch Dashboard
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="text-lg font-semibold bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300">
                Our Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] md:h-auto md:max-h-[80vh] flex flex-col p-0">
              <MissionDialog />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
