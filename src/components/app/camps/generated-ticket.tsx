'use client';

import { useRef } from 'react';
import type { DonationCamp } from '@/lib/types';
import * as z from 'zod';
import { campRegistrationSchema } from '@/lib/schemas';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import { format } from 'date-fns';
import { HeartPulse, Download, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from '@/components/ui/dialog';

interface GeneratedTicketProps {
  camp: DonationCamp;
  userData: z.infer<typeof campRegistrationSchema>;
  onBack: () => void;
}

export function GeneratedTicket({ camp, userData, onBack }: GeneratedTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!ticketRef.current) return;
    try {
        const canvas = await html2canvas(ticketRef.current, { 
            scale: 2,
            useCORS: true,
        });
        const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 1.0);

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `blood-donation-ticket-${camp.id}.png`;
            link.href = dataUrl;
            link.click();
        } else { // PDF
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(dataUrl, 'JPEG', 0, 0, canvas.width, canvas.height);
            pdf.save(`blood-donation-ticket-${camp.id}.pdf`);
        }
        toast({
            title: 'Download Successful',
            description: `Your ticket has been downloaded as a ${format.toUpperCase()} file.`,
        });

    } catch (error) {
        console.error('Failed to generate ticket image:', error);
        toast({
            variant: 'destructive',
            title: 'Download Failed',
            description: 'There was an error generating your ticket. Please try again.',
        });
    }
  };

  const ticketData = {
    campId: camp.id,
    participant: userData.fullName,
    date: new Date().toISOString()
  };

  return (
    <div className="space-y-4">
        <Card ref={ticketRef} className="bg-background p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-primary/10 rounded-tr-full"></div>
            <CardContent className="p-0 relative z-10">
                <div className="text-center mb-4">
                    <HeartPulse className="mx-auto h-10 w-10 text-primary" />
                    <h2 className="text-xl font-bold font-headline mt-2 text-primary">Donation E-Ticket</h2>
                    <p className="text-sm text-muted-foreground">Thank you for your contribution!</p>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4 my-4">
                    <div className="col-span-2 space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Participant</p>
                            <p className="font-semibold">{userData.fullName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Camp</p>
                            <p className="font-semibold">{camp.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Date & Time</p>
                            <p className="font-semibold">{format(new Date(camp.date), 'PPP')} @ {camp.timings}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-semibold text-sm">{camp.location}</p>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col items-center justify-between space-y-2">
                        <div className="w-24 h-24 rounded-md overflow-hidden border-2 border-primary">
                            <Image src={userData.photo} alt="Participant photo" width={96} height={96} className="object-cover"/>
                        </div>
                        <div className="p-1 bg-white rounded-sm">
                            <QRCode value={JSON.stringify(ticketData)} size={80} level="H" />
                        </div>
                    </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground text-center mt-3">
                    Please present this ticket and your original ID proof at the camp.
                </p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
             <Button onClick={() => handleDownload('png')} variant="outline">
                <ImageIcon className="mr-2 h-4 w-4" />
                Download PNG
            </Button>
            <Button onClick={() => handleDownload('pdf')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>

        <DialogFooter>
            <Button onClick={onBack} variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Camera
            </Button>
        </DialogFooter>
    </div>
  );
}
