'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Droplets, Hospital, Clock, MapPin, RadioTower } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UrgentRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DonationDialog } from './donation-dialog';

interface RequestCardProps {
  request: UrgentRequest;
  onFulfill: (requestId: string, donorLocation: string) => void;
}

export function RequestCard({ request, onFulfill }: RequestCardProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [request.createdAt]);

  const urgencyColor = {
    Critical: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    High: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    Moderate: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  }[request.urgency];

  return (
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
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Hospital className="h-5 w-5 text-muted-foreground" />
          <span>{request.hospitalName}</span>
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
      </CardContent>
      <CardFooter>
        <DonationDialog request={request} onFulfill={onFulfill} />
      </CardFooter>
    </Card>
  );
}
