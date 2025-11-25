'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, HandHeart } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UrgentRequest } from '@/lib/types';

interface DonationDialogProps {
  request: UrgentRequest;
  onFulfill: (requestId: string, donorLocation: string) => void;
}

const donationSchema = z.object({
  donorLocation: z.string().min(1, { message: "Your location or blood bank name is required." }),
});

export function DonationDialog({ request, onFulfill }: DonationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <HandHeart className="mr-2 h-4 w-4" />
          Pledge to Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pledge for {request.bloodType} Donation</DialogTitle>
          <DialogDescription>
            You are about to fulfill the request for {request.quantity} units of {request.bloodType} blood for {request.hospitalName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="donorLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Location / Blood Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Blood Bank or your area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Confirm Donation Pledge'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
