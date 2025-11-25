'use client';

import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Hospital } from '@/lib/types';
import { useMemo } from 'react';

interface LocationDialogProps {
  hospital?: Hospital;
  isOpen: boolean;
}

export function LocationDialog({ hospital, isOpen }: LocationDialogProps) {
  // We still dynamically import to avoid SSR issues with Leaflet.
  const MapView = useMemo(
    () =>
      dynamic(() => import('./map-view'), {
        ssr: false,
        loading: () => <Skeleton className="h-[400px] w-full" />,
      }),
    []
  );

  if (!hospital) {
    return null;
  }

  return (
    <>
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
           {/* 
             Conditionally render MapView based on isOpen.
             The key prop ensures that if the dialog is re-used for different hospitals,
             React treats it as a new component and it re-mounts correctly.
           */}
           {isOpen && <MapView key={hospital.name} hospital={hospital} />}
        </div>
      </div>
    </>
  );
}
