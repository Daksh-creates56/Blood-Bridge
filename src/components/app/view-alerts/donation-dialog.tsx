'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UrgentRequest, Hospital } from '@/lib/types';
import { hospitals } from '@/lib/data';
import { LocationDialog } from '@/components/app/dashboard/location-dialog';

interface DonationDialogProps {
  request: UrgentRequest;
  onFulfill: (requestId: string, donorLocation: string) => void;
}

const donationSchema = z.object({
  donorLocation: z.string().min(1, { message: "Please select your location/blood bank." }),
});

export function DonationDialog({ request, onFulfill }: DonationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorLocation: '',
    },
  });

  const onSubmit = (values: z.infer<typeof donationSchema>) => {
    setIsLoading(true);
    
    // Simulate a network request
    setTimeout(() => {
      onFulfill(request.id, values.donorLocation);
      toast({
        title: 'Thank You!',
        description: `Your pledge to donate has been recorded. Please proceed to ${request.hospitalName}.`,
      });
      setIsLoading(false);
      setOpen(false);
      form.reset();
      setSelectedHospital(null);
    }, 1500);
  };
  
  const handleHospitalSelect = (hospitalName: string) => {
    const hospital = hospitals.find(h => h.name === hospitalName) || null;
    setSelectedHospital(hospital);
    form.setValue('donorLocation', hospitalName);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form on close
      form.reset();
      setSelectedHospital(null);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Fulfill This Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fulfill Request for {request.bloodType}</DialogTitle>
            <DialogDescription>
              Confirm your pledge for {request.quantity} units for {request.hospitalName}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="donorLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location / Blood Bank</FormLabel>
                     <Select onValueChange={handleHospitalSelect} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your blood bank..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hospitals.map(hospital => (
                            <SelectItem key={hospital.name} value={hospital.name}>
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <DialogFooter>
                <Button type="submit" disabled={isLoading || !selectedHospital}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Confirm Fulfillment'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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
