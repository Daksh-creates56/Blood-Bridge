'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse, Droplets, ShieldCheck, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const lightBg =
    placeholderImages.find((img) => img.id === 'landing-light')?.imageUrl || '';
  const darkBg =
    placeholderImages.find((img) => img.id === 'landing-dark')?.imageUrl || '';

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src={lightBg}
          alt="Abstract red and white flowing lines"
          fill
          className="object-cover dark:hidden animate-background-zoom"
          priority
          data-ai-hint="abstract red white"
        />
        <Image
          src={darkBg}
          alt="Abstract dark red and blue flowing lines"
          fill
          className="hidden object-cover dark:block animate-background-zoom"
          priority
          data-ai-hint="abstract dark red"
        />
        <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
      </div>

      <div 
        className="z-10 flex flex-col items-center text-center animate-fade-in-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}
      >
        <div className="
          p-8 md:p-12 
          bg-card/60
          backdrop-blur-lg 
          rounded-3xl 
          border border-white/10 
          shadow-2xl shadow-primary/10
          relative overflow-hidden
        ">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-50"></div>
          <div className="relative z-10">
            <HeartPulse className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-slow" />
            <h1 className="font-headline text-6xl font-extrabold tracking-tighter text-foreground sm:text-7xl md:text-8xl">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="text-lg font-semibold bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300">
                    Our Mission
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="mx-auto max-w-5xl rounded-t-2xl border-t-2 border-primary/50 bg-background/90 backdrop-blur-xl p-8 md:p-12">
                  <SheetHeader className="text-center mb-8">
                    <SheetTitle className="text-4xl font-headline font-bold tracking-tight text-primary">Our Mission</SheetTitle>
                    <SheetDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      To create a seamless and efficient ecosystem that connects blood donors, hospitals, and those in need, leveraging technology to save lives.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
                    <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-muted/50 hover:scale-105">
                      <div className="p-4 bg-red-100/80 dark:bg-red-900/30 rounded-full mb-4">
                        <Droplets className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-headline font-semibold mb-2">Save Lives</h3>
                      <p className="max-w-xs text-muted-foreground">
                        Our platform directly connects those in need with willing
                        donors, minimizing wait times and saving precious lives.
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-muted/50 hover:scale-105">
                       <div className="p-4 bg-red-100/80 dark:bg-red-900/30 rounded-full mb-4">
                        <HeartPulse className="h-12 w-12 text-primary" />
                       </div>
                      <h3 className="text-2xl font-headline font-semibold mb-2">Build Community</h3>
                      <p className="max-w-xs text-muted-foreground">
                        We foster a strong community of donors and hospitals,
                        all working together to ensure a reliable blood supply.
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-muted/50 hover:scale-105">
                      <div className="p-4 bg-red-100/80 dark:bg-red-900/30 rounded-full mb-4">
                        <ShieldCheck className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-headline font-semibold mb-2">Ensure Safety</h3>
                      <p className="max-w-xs text-muted-foreground">
                        With AI-powered predictions and real-time tracking, we
                        proactively manage inventory to prevent shortages.
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
