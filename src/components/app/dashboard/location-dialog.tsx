'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Hospital } from '@/lib/types';

interface LocationDialogProps {
  hospital?: Hospital;
}

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export function LocationDialog({ hospital }: LocationDialogProps) {
  const [open, setOpen] = useState(false);

  if (!hospital) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 justify-start w-full text-left">
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="mt-1 h-5 w-5 shrink-0" />
              <span className="text-sm text-wrap">{hospital.name}</span>
            </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{hospital.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{hospital.address}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold text-lg">{hospital.rating.toFixed(1)}</span>
                </div>
            </div>
            <div className="h-[400px] w-full rounded-md overflow-hidden border">
                {open && <MapView hospital={hospital} />}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
