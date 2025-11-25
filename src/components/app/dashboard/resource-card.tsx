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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">{resource.bloodType}</CardTitle>
          <Badge variant={badgeVariant as any} className={cn('text-sm', badgeColor)}>
            {resource.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Droplets className="h-5 w-5" />
          <span className="text-lg font-medium text-foreground">
            {resource.quantity} units
          </span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-1 h-5 w-5 shrink-0" />
          <span>{resource.location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <UpdateUnitsDialog resource={resource} onUpdate={onUpdate} />
      </CardFooter>
    </Card>
  );
}
