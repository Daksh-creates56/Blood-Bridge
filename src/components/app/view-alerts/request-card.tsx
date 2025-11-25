'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Hospital, Clock, MapPin, RadioTower, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UrgentRequest, Hospital as HospitalType } from '@/lib/types';
import { hospitals } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DonationDialog } from './donation-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LocationDialog } from '@/components/app/dashboard/location-dialog';


interface RequestCardProps {
  request: UrgentRequest;
  onFulfill: (requestId: string, donorLocation: string) => void;
}

export function RequestCard({ request, onFulfill }: RequestCardProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<HospitalType | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [request.createdAt]);
  
  const handleHospitalSelect = (hospitalName: string) => {
    const hospital = hospitals.find(h => h.name === hospitalName) || null;
    setSelectedHospital(hospital);
  };

  const urgencyColor = {
    Critical: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    High: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    Moderate: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  }[request.urgency];

  return (
    <>
      <Card className={cn('flex flex-col', urgencyColor)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{request.bloodType}</CardTitle>
              <CardDescription className="text-base">{request.urgency} Urgency</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{request.quantity}</div>
              <div className="text-sm text-muted-foreground">units</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Hospital className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{request.hospitalName}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{request.location}</span>
          </div>
           <div className="flex items-center gap-3">
            <RadioTower className="h-5 w-5 text-muted-foreground" />
            <span>{request.broadcastRadius} broadcast radius</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{timeAgo}</span>
          </div>
          
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Check nearby hospitals</p>
            <Select onValueChange={handleHospitalSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a hospital to view location" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map(hospital => (
                  <SelectItem key={hospital.name} value={hospital.name}>
                    {hospital.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHospital && (
              <div className="p-3 bg-muted/50 rounded-md text-sm space-y-2">
                  <p className="font-semibold">{selectedHospital.name}</p>
                  <p className="text-muted-foreground">{selectedHospital.address}</p>
                  <Button variant="outline" size="sm" onClick={() => setIsMapOpen(true)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
              </div>
            )}
          </div>

        </CardContent>
        <CardFooter>
            <DonationDialog request={request} onFulfill={onFulfill} />
        </CardFooter>
      </Card>

      {selectedHospital && (
        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
          <DialogContent className="max-w-3xl">
             <LocationDialog hospital={selectedHospital} isOpen={isMapOpen} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
