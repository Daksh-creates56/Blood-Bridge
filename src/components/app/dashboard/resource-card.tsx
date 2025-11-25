'use client';

import { useState } from 'react';
import { Droplets, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Resource } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UpdateUnitsDialog } from './update-units-dialog';
import { LocationDialog } from './location-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ResourceCardProps {
  resource: Resource;
  onUpdate: (updatedResource: Resource) => void;
}

export function ResourceCard({ resource, onUpdate }: ResourceCardProps) {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const badgeVariant = {
    Available: 'success',
    Low: 'warning',
    Critical: 'destructive',
  }[resource.status];

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-4xl font-bold text-primary">{resource.bloodType}</CardTitle>
          <Badge variant={badgeVariant as any} className="text-xs font-semibold">
            {resource.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-3">
          <Droplets className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-xl font-medium text-foreground">
              {resource.quantity}
            </span>
             <span className="text-sm text-muted-foreground"> units</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin className="mt-1 h-5 w-5 shrink-0" />
            {resource.hospital ? (
              <>
                <button 
                  onClick={() => setIsLocationDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-left text-wrap hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm text-blue-500 hover:text-blue-400"
                >
                  <span>{resource.hospital.name}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
                <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                  <DialogContent className="max-w-3xl">
                    <LocationDialog hospital={resource.hospital} />
                  </DialogContent>
                </Dialog>
              </>
            ) : (
                <span className="text-sm text-wrap">{resource.location}</span>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <UpdateUnitsDialog resource={resource} onUpdate={onUpdate} />
      </CardFooter>
    </Card>
  );
}
