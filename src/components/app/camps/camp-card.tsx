'use client';

import { PersonStanding, Clock } from 'lucide-react';
import type { DonationCamp, Coordinates } from '@/lib/types';
import { getDistance } from '@/lib/utils';

interface CampCardProps {
  camp: DonationCamp;
  userLocation: Coordinates | null;
  onSelect: () => void;
}

export function CampCard({ camp, userLocation, onSelect }: CampCardProps) {
  const distance = userLocation 
    ? getDistance(userLocation[0], userLocation[1], camp.coordinates[0], camp.coordinates[1]).toFixed(1) 
    : null;

  return (
    <button onClick={onSelect} className="w-full text-left p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-base">{camp.name}</h3>
                <p className="text-sm text-muted-foreground">{camp.address}</p>
            </div>
             {distance && (
                <div className="flex items-center gap-1 text-sm font-medium text-primary whitespace-nowrap">
                    <PersonStanding className="h-4 w-4" />
                    <span>{distance} km</span>
                </div>
            )}
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{camp.timings}</span>
        </div>
    </button>
  );
}
