'use client';

import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { BloodCompatibilityMatrix } from './blood-compatibility-matrix';

export function CompatibilityDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-xs font-normal mt-2">
          <Droplets className="mr-1 h-3 w-3 text-primary" />
          Blood Compatibility Matrix
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="text-primary" />
            Blood Compatibility Matrix
          </DialogTitle>
          <DialogDescription>
            Select a donor blood type to see compatible recipients.
          </DialogDescription>
        </DialogHeader>
        <BloodCompatibilityMatrix />
      </DialogContent>
    </Dialog>
  );
}
