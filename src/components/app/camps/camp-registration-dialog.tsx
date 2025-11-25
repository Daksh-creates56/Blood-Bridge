
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Camera, CheckCircle, FileUp, X, User, Cake, VenetianMask } from 'lucide-react';
import { campRegistrationStep1Schema, campRegistrationSchema } from '@/lib/schemas';
import type { DonationCamp } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GeneratedTicket } from './generated-ticket';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type Step = 'details' | 'camera' | 'ticket';

const FileInput = () => {
    const { name, onBlur, onChange } = useFormField();
    const [fileName, setFileName] = useState('');

    return (
        <div className="relative">
            <Input
                type="file"
                id={name}
                name={name}
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onBlur={onBlur}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setFileName(file.name);
                    } else {
                        setFileName('');
                    }
                    if (onChange) {
                      onChange(e.target.files);
                    }
                }}
            />
            <Label 
                htmlFor={name}
                className={cn(
                    "flex items-center w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "cursor-pointer"
                )}
            >
                <FileUp className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="truncate text-muted-foreground">
                    {fileName || 'Select a PDF file...'}
                </span>
            </Label>
        </div>
    );
};


export function CampRegistrationDialog({ camp, isOpen, onOpenChange }: { camp: DonationCamp; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<Step>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [formData, setFormData] = useState<z.infer<typeof campRegistrationSchema> | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const step1Form = useForm<z.infer<typeof campRegistrationStep1Schema>>({
    resolver: zodResolver(campRegistrationStep1Schema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      age: undefined,
      idProof: undefined
    }
  });

  const getCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to continue.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (step === 'camera') {
      getCameraPermission();
    } else {
      // Stop camera stream when leaving camera step
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [step, getCameraPermission]);


  const onStep1Submit = (data: z.infer<typeof campRegistrationStep1Schema>) => {
    setFormData({ ...formData, ...data, photo: '' }); // photo will be added later
    setStep('camera');
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoDataUrl = canvas.toDataURL('image/png');
        setFormData(prev => prev ? { ...prev, photo: photoDataUrl } : null);
        setIsLoading(true);
        // Simulate processing
        setTimeout(() => {
          setStep('ticket');
          setIsLoading(false);
        }, 1000);
      }
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing dialog
      setTimeout(() => {
         setStep('details');
         setFormData(null);
         step1Form.reset();
      }, 300);
    }
    onOpenChange(open);
  }

  const progressValue = step === 'details' ? 33 : step === 'camera' ? 66 : 100;
  const progressText = step === 'details' ? 'Step 1 of 3: Your Details' : step === 'camera' ? 'Step 2 of 3: Capture Photo' : 'Step 3 of 3: Your E-Ticket';
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {camp.name}</DialogTitle>
          <DialogDescription>{camp.location}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
            <Progress value={progressValue} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">{progressText}</p>
        </div>

        {step === 'details' && (
          <FormProvider {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
              <FormField
                control={step1Form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. John Doe" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                     <FormControl>
                      <div className="relative">
                         <Cake className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="e.g. 25" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name="idProof"
                render={() => (
                  <FormItem>
                    <FormLabel>ID Proof (PDF only)</FormLabel>
                     <FormControl>
                        <FileInput />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Next</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
        
        {step === 'camera' && (
          <div className="space-y-4">
             <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden border">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {!hasCameraPermission && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                      <Camera className="h-10 w-10 text-destructive mb-2"/>
                      <p className="font-semibold text-destructive">Camera Not Available</p>
                      <p className="text-sm text-muted-foreground">Please enable camera permissions to proceed.</p>
                       <Button onClick={getCameraPermission} variant="outline" className="mt-4">Retry Camera Access</Button>
                  </div>
              )}
               {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button onClick={() => setStep('details')}>Back</Button>
              <Button onClick={handleCapture} disabled={!hasCameraPermission || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                Capture
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'ticket' && formData && (
          <GeneratedTicket camp={camp} userData={formData} onBack={() => setStep('camera')} />
        )}
      </DialogContent>
    </Dialog>
  );
}

    