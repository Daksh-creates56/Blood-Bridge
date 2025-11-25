'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse, Droplets } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';

export default function Home() {
  const lightBg =
    placeholderImages.find((img) => img.id === 'landing-light')?.imageUrl || '';
  const darkBg =
    placeholderImages.find((img) => img.id === 'landing-dark')?.imageUrl || '';

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={lightBg}
          alt="Abstract red and white background"
          fill
          className="object-cover dark:hidden"
          priority
          data-ai-hint="abstract red"
        />
        <Image
          src={darkBg}
          alt="Abstract dark red background"
          fill
          className="hidden object-cover dark:block"
          priority
          data-ai-hint="abstract dark red"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/50" />
      </div>

      <div className="z-10 flex flex-col items-center text-center p-4">
        <div className="mb-6 flex items-center gap-4">
          <HeartPulse className="h-16 w-16 text-primary" />
          <div>
            <h1 className="font-headline text-6xl font-extrabold tracking-tighter text-foreground sm:text-7xl md:text-8xl">
              Blood Bridge
            </h1>
            <p className="mt-2 text-lg text-muted-foreground md:text-xl">
              Bridging the gap between need & donor.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button asChild size="lg" className="text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="text-lg font-semibold">
                About Us
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="mx-auto max-w-4xl rounded-t-lg">
              <SheetHeader className="text-center mb-8">
                <SheetTitle className="text-4xl font-bold tracking-tight">Our Mission</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2">
                <div className="flex flex-col items-center p-6 rounded-lg">
                  <Droplets className="mb-4 h-14 w-14 text-primary" />
                  <h3 className="text-2xl font-semibold mb-2">Save Lives</h3>
                  <p className="max-w-xs text-muted-foreground">
                    Our platform directly connects those in need with willing
                    donors, minimizing wait times and saving lives when every
                    second counts.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg">
                  <HeartPulse className="mb-4 h-14 w-14 text-primary" />
                  <h3 className="text-2xl font-semibold mb-2">Build Community</h3>
                  <p className="max-w-xs text-muted-foreground">
                    We foster a strong community of donors, hospitals, and volunteers,
                    all working together to ensure a stable and reliable blood supply
                    for everyone.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </main>
  );
}
