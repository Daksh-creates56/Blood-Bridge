'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

import { campRegistrationSchema } from '@/lib/schemas';
import type { DonationCamp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, Download } from 'lucide-react';

interface CampRegistrationDialogProps {
  camp: DonationCamp;
}

type FormValues = z.infer<typeof campRegistrationSchema>;

export function CampRegistrationDialog({ camp }: CampRegistrationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [ticketData, setTicketData] = React.useState<FormValues | null>(null);
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(campRegistrationSchema),
    defaultValues: {
        name: '',
        email: '',
        idProof: undefined,
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      form.setValue('idProof', e.target.files[0]);
    }
  };

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTicketData(values);
      setIsLoading(false);
      toast({
        title: 'Registration Successful!',
        description: 'Your slot has been booked. You can now download your ticket.',
      });
    }, 1500);
  };
  
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Donation-Ticket-${camp.name.replace(/ /g, '-')}.pdf`);
  };

  const resetAndClose = () => {
    setOpen(false);
    // Delay reset to allow dialog to close smoothly
    setTimeout(() => {
        form.reset();
        setTicketData(null);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">Book a Slot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {ticketData ? 'Your E-Ticket' : `Book Slot at ${camp.name}`}
          </DialogTitle>
          <DialogDescription>
            {ticketData 
              ? 'Present this ticket at the donation camp.'
              : 'Please fill in your details to confirm your slot.'}
          </DialogDescription>
        </DialogHeader>

        {ticketData ? (
          <div>
            <div ref={ticketRef} className="bg-background p-6 border rounded-lg">
                <div className="text-center pb-4 border-b">
                    <h3 className="font-bold text-lg text-primary">Blood Donation E-Ticket</h3>
                    <p className="text-sm font-semibold">{camp.name}</p>
                    <p className="text-xs text-muted-foreground">{camp.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-b">
                    <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-semibold">{ticketData.name}</p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-semibold">{ticketData.email}</p>
                    </div>
                </div>
                 <div className="flex items-center justify-center pt-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Scan for verification</p>
                        <QRCode value={`DONOR:${ticketData.name}\nCAMP:${camp.name}`} size={96} />
                    </div>
                 </div>
            </div>
             <Button onClick={handleDownloadTicket} className="w-full mt-4">
                <Download className="mr-2 h-4 w-4" /> Download Ticket
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="idProof"
                render={() => (
                    <FormItem>
                        <FormLabel>ID Proof (PDF only)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="file:text-primary file:font-semibold"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Ticket className="mr-2 h-4 w-4" />
                  )}
                  Confirm Booking
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        
        {ticketData && (
             <DialogFooter className="sm:justify-center">
                <Button variant="outline" onClick={resetAndClose}>Close</Button>
            </DialogFooter>
        )}

      </DialogContent>
    </Dialog>
  );
}
