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

export default function Home() {
  const lightBg =
    placeholderImages.find((img) => img.id === 'landing-light')?.imageUrl || '';
  const darkBg =
    placeholderImages.find((img) => img.id === 'landing-dark')?.imageUrl || '';

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={lightBg}
          alt="Daytime cityscape"
          fill
          className="object-cover dark:hidden"
          priority
          data-ai-hint="city daytime"
        />
        <Image
          src={darkBg}
          alt="Nighttime cityscape"
          fill
          className="hidden object-cover dark:block"
          priority
          data-ai-hint="city nighttime"
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70 backdrop-blur-sm" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-4">
          <HeartPulse className="h-16 w-16 text-primary" />
          <div>
            <h1 className="font-headline text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
              Blood Bridge
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              Bridging the gap between need & donor.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="text-lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="text-lg">
                About Us
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="mx-auto max-w-3xl">
              <SheetHeader className="text-center">
                <SheetTitle className="text-3xl font-bold">Our Mission</SheetTitle>
              </SheetHeader>
              <div className="mt-8 grid grid-cols-1 gap-8 text-center md:grid-cols-2">
                <div className="flex flex-col items-center">
                  <Droplets className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-semibold">Save Lives</h3>
                  <p className="mt-2 text-muted-foreground">
                    Our platform directly connects those in need with willing
                    donors, minimizing wait times and saving lives when every
                    second counts.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <HeartPulse className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-semibold">Build Community</h3>
                  <p className="mt-2 text-muted-foreground">
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