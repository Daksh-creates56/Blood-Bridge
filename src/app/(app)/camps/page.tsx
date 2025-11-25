'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { Map, Calendar, Clock, Building, LocateFixed, Loader2, XCircle } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialDonationCamps } from '@/lib/data';
import type { DonationCamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getDistance } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const CampMapView = dynamic(() => import('@/components/app/camps/camp-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

function CampCard({ camp, onSelectCamp, isNearest, isSelected }: { camp: DonationCamp; onSelectCamp: (camp: DonationCamp) => void; isNearest: boolean; isSelected: boolean }) {
  const campDate = new Date(camp.date);

  return (
    <Card 
      onClick={() => onSelectCamp(camp)} 
      className={cn(
        "flex flex-col cursor-pointer transition-all duration-200", 
        isNearest && "border-primary border-2",
        isSelected ? "shadow-xl scale-105 border-primary" : "hover:shadow-lg"
      )}
    >
      <CardHeader>
        {isNearest && <div className="text-sm font-semibold text-primary mb-2">Nearest Camp</div>}
        <CardTitle>{camp.name}</CardTitle>
        <CardDescription>Organized by {camp.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{format(campDate, 'PPP')}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>{camp.timings}</span>
        </div>
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span>{camp.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DonationCampsPage() {
  const [camps] = useLocalStorage<DonationCamp[]>('donationCamps', initialDonationCamps);
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestCamp, setNearestCamp] = useState<DonationCamp | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [panToLocation, setPanToLocation] = useState<[number, number] | null>(null);

  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [camps]);

  const handleSelectCamp = useCallback((camp: DonationCamp) => {
    setSelectedCamp(camp);
    setPanToLocation(camp.coordinates);
  }, []);

  const findNearestCamp = () => {
    setIsLocating(true);
    setLocationError(null);
    setNearestCamp(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentUserLocation: [number, number] = [latitude, longitude];
        setUserLocation(currentUserLocation);
        setPanToLocation(currentUserLocation); // 1. Pan to user's location first.

        let closestCamp: DonationCamp | null = null;
        let minDistance = Infinity;

        sortedCamps.forEach(camp => {
          const distance = getDistance(
            currentUserLocation[0],
            currentUserLocation[1],
            camp.coordinates[0],
            camp.coordinates[1]
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCamp = camp;
          }
        });

        setNearestCamp(closestCamp);
        if (closestCamp) {
          // 2. Just select the camp to highlight it, but don't pan automatically.
          setSelectedCamp(closestCamp);
        }
        setIsLocating(false);
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("You denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
        setIsLocating(false);
      }
    );
  };
  
  useEffect(() => {
    if(!selectedCamp && sortedCamps.length > 0) {
      setSelectedCamp(sortedCamps[0]);
    }
  }, [sortedCamps, selectedCamp]);


  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-theme(spacing.24))]">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4">
                 <Button onClick={findNearestCamp} disabled={isLocating} className="w-full">
                  {isLocating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <LocateFixed className="mr-2 h-4 w-4" />
                      Find My Location & Nearest Camp
                    </>
                  )}
                </Button>
                {locationError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> {locationError}
                  </p>
                )}
            </div>

            <ScrollArea className="flex-grow h-0">
                {sortedCamps.length > 0 ? (
                <div className="space-y-4 pr-4">
                    {sortedCamps.map(camp => (
                    <CampCard 
                        key={camp.id} 
                        camp={camp} 
                        onSelectCamp={handleSelectCamp} 
                        isNearest={nearestCamp?.id === camp.id} 
                        isSelected={selectedCamp?.id === camp.id}
                    />
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20 text-center">
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Upcoming Camps</h3>
                    <p className="mt-2 text-muted-foreground">Please check back later.</p>
                </div>
                )}
            </ScrollArea>
        </div>
        <div className="w-full md:w-2/3 h-full rounded-lg overflow-hidden border">
            <CampMapView 
                camps={sortedCamps}
                selectedCamp={selectedCamp}
                userLocation={userLocation}
                panToLocation={panToLocation}
            />
        </div>
    </div>
  );
}
