'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
              {isClient && <MapView hospital={hospital} />}
          </div>
      </div>
    </>
  );
}
