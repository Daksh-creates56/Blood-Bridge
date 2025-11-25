
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
      onClick={() => onSelectCamp(camp)}
      className={cn(
        "flex flex-col transition-all duration-200 cursor-pointer w-full", 
        isNearest && "border-primary border-2",
        isSelected ? "shadow-xl scale-105 border-primary" : "hover:shadow-lg"
      )}
    >
      <div>
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
          <Button className="w-full" onClick={(e) => { e.stopPropagation(); onRegister(camp); }}>
            <FilePlus className="mr-2 h-4 w-4" />
            Register for this Camp
          </Button>
      </CardFooter>
    </Card>
  );
}

const DEFAULT_CENTER: [number, number] = [19.0760, 72.8777];
const DEFAULT_ZOOM = 12;

export default function DonationCampsPage() {
  const [camps] = useLocalStorage<DonationCamp[]>('donationCamps', initialDonationCamps);
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestCamp, setNearestCamp] = useState<DonationCamp | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [registrationCamp, setRegistrationCamp] = useState<DonationCamp | null>(null);

  const initialCenter = useMemo(() => {
    if (camps.length > 0 && camps[0].coordinates) {
      return camps[0].coordinates;
    }
    return DEFAULT_CENTER;
  }, [camps]);

  const [mapView, setMapView] = useState({ center: initialCenter, zoom: DEFAULT_ZOOM });

  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [camps]);

  const handleSelectCamp = useCallback((camp: DonationCamp) => {
    if (camp && camp.coordinates && !isNaN(camp.coordinates[0]) && !isNaN(camp.coordinates[1])) {
        setSelectedCamp(camp);
        setMapView({ center: camp.coordinates, zoom: 15 });
    }
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
          if(camp.coordinates && !isNaN(camp.coordinates[0]) && !isNaN(camp.coordinates[1])) {
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
          }
        });

        setNearestCamp(closestCamp);
        if (closestCamp) {
          handleSelectCamp(closestCamp);
        } else {
           if (currentUserLocation && !isNaN(currentUserLocation[0]) && !isNaN(currentUserLocation[1])) {
              setMapView({ center: currentUserLocation, zoom: 14 });
           }
        }
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
  }, [sortedCamps, handleSelectCamp]);
  
  useEffect(() => {
    if(sortedCamps.length > 0 && !selectedCamp) {
      const firstCamp = sortedCamps[0];
       if (firstCamp && firstCamp.coordinates && !isNaN(firstCamp.coordinates[0]) && !isNaN(firstCamp.coordinates[1])) {
        handleSelectCamp(firstCamp);
       }
    }
  }, [sortedCamps, selectedCamp, handleSelectCamp]);

  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height,6rem)-2rem)] w-full gap-4">
        
        {/* Left Column: List of Camps */}
        <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 space-y-4 h-full">
            <div className="flex-shrink-0">
              <Button onClick={findNearestCamp} disabled={isLocating} className="w-full shadow-lg">
                {isLocating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Locating...</>
                ) : (
                  <><LocateFixed className="mr-2 h-4 w-4" />Find Nearest Camp</>
                )}
              </Button>
              {locationError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Location Error</AlertTitle>
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}
            </div>

            <ScrollArea className="flex-grow rounded-lg border">
              <div className="p-4 space-y-4">
                {sortedCamps.length > 0 ? (
                  sortedCamps.map(camp => (
                    <CampCard 
                      key={camp.id} 
                      camp={camp} 
                      onSelectCamp={handleSelectCamp} 
                      isNearest={nearestCamp?.id === camp.id} 
                      isSelected={selectedCamp?.id === camp.id}
                      onRegister={handleRegister}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-background/80 py-10 text-center h-full">
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Upcoming Camps</h3>
                    <p className="mt-2 text-muted-foreground">Please check back later.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
        </div>

        {/* Right Column: Map View */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-[400px] md:h-full">
           <div className="h-full w-full rounded-lg overflow-hidden border">
              <CampMapView 
                camps={sortedCamps}
                selectedCamp={selectedCamp}
                userLocation={userLocation}
                onSelectCamp={handleSelectCamp}
                view={mapView}
              />
            </div>
        </div>

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
