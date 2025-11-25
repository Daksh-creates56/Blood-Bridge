'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { Send, MapPin } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialUrgentRequests, hospitals } from '@/lib/data';
import type { UrgentRequest, Hospital } from '@/lib/types';
import { urgentRequestSchema, bloodTypes, urgencyLevels, broadcastRadii } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LocationDialog } from '@/components/app/dashboard/location-dialog';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function SendRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useLocalStorage<UrgentRequest[]>('urgentRequests', initialUrgentRequests);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const form = useForm<z.infer<typeof urgentRequestSchema>>({
    resolver: zodResolver(urgentRequestSchema),
    defaultValues: {
      quantity: 1,
      broadcastRadius: '5km',
      hospitalName: '',
    },
  });

  const handleHospitalChange = (hospitalName: string) => {
    const hospital = hospitals.find(h => h.name === hospitalName) || null;
    setSelectedHospital(hospital);
    form.setValue('hospitalName', hospitalName);
    if (hospital) {
      form.setValue('location', hospital.address);
    } else {
      form.setValue('location', '');
    }
  };

  function onSubmit(values: z.infer<typeof urgentRequestSchema>) {
    const newRequest: UrgentRequest = {
      id: `req-${Date.now()}`,
      ...values,
      createdAt: new Date().toISOString(),
      status: 'Active',
    };
    setRequests([newRequest, ...requests]);
    toast({
      title: 'Request Sent!',
      description: `Urgent request for ${values.quantity} units of ${values.bloodType} has been broadcast.`,
    });
    router.push('/view-alerts');
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Broadcast Urgent Request</CardTitle>
        <CardDescription>Fill out the form below to send a new request for blood.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a blood type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (units)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select urgency level" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {urgencyLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital</FormLabel>
                  <Select onValueChange={handleHospitalChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a hospital" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hospitals.map(hospital => <SelectItem key={hospital.name} value={hospital.name}>{hospital.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedHospital && (
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Location</FormLabel>
                    <div className="flex items-center gap-2">
                       <FormControl>
                        <Input readOnly {...field} className="flex-1 bg-muted" />
                      </FormControl>
                      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                           <LocationDialog hospital={selectedHospital} isOpen={isMapOpen} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="broadcastRadius"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Broadcast Radius</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {broadcastRadii.map(radius => (
                        <FormItem key={radius} className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value={radius} /></FormControl>
                          <FormLabel className="font-normal">{radius}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Broadcast Request
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
