'use client';

import * as React from 'react';
import { Loader2, LocateFixed, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CampMapView } from '@/components/app/camps/camp-map-view';
import { CampCard } from '@/components/app/camps/camp-card';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialDonationCamps } from '@/lib/data';
import type { DonationCamp, Coordinates } from '@/lib/types';
import { getDistance, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CampRegistrationDialog } from '@/components/app/camps/camp-registration-dialog';

const DEFAULT_VIEW: { center: Coordinates; zoom: number } = {
  center: [19.0760, 72.8777], // Mumbai coordinates
  zoom: 11,
};

export default function DonationCampsPage() {
  const [camps] = useLocalStorage<DonationCamp[]>('donationCamps', initialDonationCamps);
  const [isLocating, setIsLocating] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState<Coordinates | null>(null);
  const [mapView, setMapView] = React.useState(DEFAULT_VIEW);
  const [selectedCamp, setSelectedCamp] = React.useState<DonationCamp | null>(null);
  const [showList, setShowList] = React.useState(false);
  const { toast } = useToast();

  const sortedCamps = React.useMemo(() => {
    if (!userLocation) {
      return camps;
    }
    return [...camps].sort((a, b) => {
      const distanceA = getDistance(userLocation[0], userLocation[1], a.coordinates[0], a.coordinates[1]);
      const distanceB = getDistance(userLocation[0], userLocation[1], b.coordinates[0], b.coordinates[1]);
      return distanceA - distanceB;
    });
  }, [camps, userLocation]);

  const findNearestCamp = () => {
    setIsLocating(true);
    setShowList(true);
    setSelectedCamp(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: Coordinates = [latitude, longitude];
        setUserLocation(newLocation);
        
        // Find closest camp
        const closestCamp = [...camps].sort((a, b) => {
            const distanceA = getDistance(newLocation[0], newLocation[1], a.coordinates[0], a.coordinates[1]);
            const distanceB = getDistance(newLocation[0], newLocation[1], b.coordinates[0], b.coordinates[1]);
            return distanceA - distanceB;
        })[0];
        
        if (closestCamp) {
            setMapView({ center: closestCamp.coordinates, zoom: 15 });
        } else {
             setMapView({ center: newLocation, zoom: 14 });
        }
        
        setIsLocating(false);
        toast({
          title: 'Location Found',
          description: 'Showing nearest donation camps.',
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not fetch your location. Please enable location services.',
        });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSelectCamp = (camp: DonationCamp) => {
    setSelectedCamp(camp);
    setMapView({ center: camp.coordinates, zoom: 16 });
  };
  
  const handleDeselect = () => {
    setSelectedCamp(null);
    if(userLocation) {
      setMapView({ center: userLocation, zoom: 13 });
    } else {
      setMapView(DEFAULT_VIEW);
    }
  }

  return (
    <div className="relative h-full w-full -m-4 md:-m-6">
      <div className="absolute inset-0 z-0">
          <CampMapView 
            camps={camps} 
            view={mapView} 
            userLocation={userLocation} 
            selectedCamp={selectedCamp}
            onSelectCamp={handleSelectCamp}
          />
      </div>
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Button onClick={findNearestCamp} disabled={isLocating} size="lg" className="shadow-lg">
          {isLocating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <LocateFixed className="mr-2 h-5 w-5" />
              Find Nearest Camps
            </>
          )}
        </Button>
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-10 transition-transform duration-500 ease-in-out",
        showList ? "translate-y-0" : "translate-y-full"
      )}>
        <Card className="m-4 max-h-[40vh] overflow-hidden rounded-xl shadow-2xl bg-background/80 backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7 z-20"
            onClick={() => setShowList(false)}
            aria-label="Close camp list"
          >
            <X className="h-4 w-4" />
          </Button>

          {selectedCamp ? (
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">{selectedCamp.name}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">{selectedCamp.address}</p>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleDeselect} className="flex-1">Back to List</Button>
                <CampRegistrationDialog camp={selectedCamp} />
              </div>
            </div>
          ) : (
            <CardContent className="p-0">
              <div className="border-b p-4">
                  <h2 className="text-lg font-semibold leading-none">Nearby Camps</h2>
                  <p className="text-sm text-muted-foreground">Click on a camp to view details or book.</p>
              </div>
              <ScrollArea className="h-[calc(40vh-68px)]">
                {isLocating ? (
                  <div className="space-y-2 p-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : userLocation ? (
                  <div className="divide-y">
                    {sortedCamps.map(camp => (
                      <CampCard 
                        key={camp.id} 
                        camp={camp} 
                        userLocation={userLocation} 
                        onSelect={() => handleSelectCamp(camp)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Click "Find Nearest Camps" to see a list of locations near you.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
