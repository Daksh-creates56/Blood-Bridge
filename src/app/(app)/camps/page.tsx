'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { Map, Calendar, Clock, MapPin, Building } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialDonationCamps } from '@/lib/data';
import type { DonationCamp } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface CampDialogProps {
  camp: DonationCamp;
  isOpen: boolean;
}

const CampMapView = dynamic(() => import('@/components/app/camps/camp-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

function CampLocationDialog({ camp, isOpen }: CampDialogProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{camp.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-muted-foreground">{camp.address}</p>
        <div className="h-[400px] w-full overflow-hidden rounded-md border">
          {isOpen && <CampMapView key={camp.id} camp={camp} />}
        </div>
      </div>
    </>
  );
}


function CampCard({ camp, onSelectCamp }: { camp: DonationCamp; onSelectCamp: (camp: DonationCamp) => void; }) {
  const campDate = new Date(camp.date);

  return (
    <Card className="flex flex-col">
      <CardHeader>
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
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onSelectCamp(camp)}>
          <MapPin className="mr-2 h-4 w-4" />
          View on Map
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DonationCampsPage() {
  const [camps] = useLocalStorage<DonationCamp[]>('donationCamps', initialDonationCamps);
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(null);

  const sortedCamps = useMemo(() => {
    return [...camps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [camps]);

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <Map className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Upcoming Donation Camps</h1>
          <p className="mt-2 text-muted-foreground">Find a camp near you and save a life.</p>
        </div>
        
        {sortedCamps.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedCamps.map(camp => (
              <CampCard key={camp.id} camp={camp} onSelectCamp={setSelectedCamp} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20 text-center">
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Upcoming Camps</h3>
            <p className="mt-2 text-muted-foreground">Please check back later for new donation camp announcements.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedCamp} onOpenChange={(isOpen) => !isOpen && setSelectedCamp(null)}>
        <DialogContent className="max-w-3xl">
          {selectedCamp && <CampLocationDialog camp={selectedCamp} isOpen={!!selectedCamp} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
