
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { Map, Calendar, Clock, Building, LocateFixed, Loader2, FilePlus, AlertTriangle } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialDonationCamps } from '@/lib/data';
import type { DonationCamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getDistance } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CampRegistrationDialog } from '@/components/app/camps/camp-registration-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CampMapView = dynamic(() => import('@/components/app/camps/camp-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

function CampCard({ camp, onSelectCamp, isNearest, isSelected, onRegister }: { camp: DonationCamp; onSelectCamp: (camp: DonationCamp) => void; isNearest: boolean; isSelected: boolean; onRegister: (camp: DonationCamp) => void; }) {
  const campDate = new Date(camp.date);

  return (
    <Card 
      className={cn(
        "flex flex-col transition-all duration-200", 
        isNearest && "border-primary border-2",
        isSelected ? "shadow-xl scale-105 border-primary" : "hover:shadow-lg"
      )}
    >
      <div className="cursor-pointer" onClick={() => onSelectCamp(camp)}>
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
      </div>
      <CardFooter>
          <Button className="w-full" onClick={() => onRegister(camp)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Register for this Camp
          </Button>
      </CardFooter>
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
  const [registrationCamp, setRegistrationCamp] = useState<DonationCamp | null>(null);
  
  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [camps]);

  const handleSelectCamp = useCallback((camp: DonationCamp) => {
    setSelectedCamp(camp);
  }, []);

  const handleRegister = (camp: DonationCamp) => {
    setRegistrationCamp(camp);
  };

  const findNearestCamp = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    
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
        // Do not auto-select, just highlight. Let user click.
        setIsLocating(false);
      },
      (error) => {
        let message = "An unknown error occurred.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable it in browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "The request to get your location timed out.";
            break;
        }
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [sortedCamps]);
  
  useEffect(() => {
    if(sortedCamps.length > 0 && !selectedCamp) {
      setSelectedCamp(sortedCamps[0]);
    }
  }, [sortedCamps, selectedCamp]);


  return (
    <>
      <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] gap-6">
        <div className="w-full h-[40vh] rounded-lg overflow-hidden border flex-shrink-0">
            <CampMapView 
                camps={sortedCamps}
                selectedCamp={selectedCamp}
                userLocation={userLocation}
                onSelectCamp={handleSelectCamp}
            />
        </div>

        <div className="flex-shrink-0 px-1 flex flex-col gap-4">
             <Button onClick={findNearestCamp} disabled={isLocating} className="w-full max-w-sm mx-auto">
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
              <Alert variant="destructive" className="max-w-sm mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>
                  {locationError}
                </AlertDescription>
              </Alert>
            )}
        </div>
        
        <ScrollArea className="flex-grow">
          {sortedCamps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
              {sortedCamps.map(camp => (
              <CampCard 
                  key={camp.id} 
                  camp={camp} 
                  onSelectCamp={handleSelectCamp} 
                  isNearest={nearestCamp?.id === camp.id} 
                  isSelected={selectedCamp?.id === camp.id}
                  onRegister={handleRegister}
              />
              ))}
          </div>
          ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20 text-center h-full">
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Upcoming Camps</h3>
              <p className="mt-2 text-muted-foreground">Please check back later.</p>
          </div>
          )}
        </ScrollArea>
      </div>

      {registrationCamp && (
        <CampRegistrationDialog 
          camp={registrationCamp}
          isOpen={!!registrationCamp}
          onOpenChange={(isOpen) => !isOpen && setRegistrationCamp(null)}
        />
      )}
    </>
  );
}
