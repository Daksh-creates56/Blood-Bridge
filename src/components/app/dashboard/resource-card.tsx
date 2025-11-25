'use client';

import { Droplets, MapPin } from 'lucide-react';
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
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  resource: Resource;
  onUpdate: (updatedResource: Resource) => void;
}

export function ResourceCard({ resource, onUpdate }: ResourceCardProps) {
  const badgeVariant = {
    Available: 'outline',
    Low: 'secondary',
    Critical: 'destructive',
  }[resource.status];

  const badgeColor = {
    Available: 'border-green-600 text-green-600',
    Low: 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/50 dark:text-orange-400 dark:border-orange-800',
    Critical: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800',
  }[resource.status];

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-4xl font-bold">{resource.bloodType}</CardTitle>
          <Badge variant={badgeVariant as any} className={cn('text-xs font-semibold', badgeColor)}>
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
        {resource.hospital ? (
          <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-0 justify-start w-full text-left">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="mt-1 h-5 w-5 shrink-0" />
                    <span className="text-sm text-wrap hover:underline">{resource.hospital.name}</span>
                  </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <LocationDialog hospital={resource.hospital} />
            </DialogContent>
          </Dialog>
        ) : (
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="mt-1 h-5 w-5 shrink-0" />
              <span className="text-sm text-wrap">{resource.location}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <UpdateUnitsDialog resource={resource} onUpdate={onUpdate} />
      </CardFooter>
    </Card>
  );
}
