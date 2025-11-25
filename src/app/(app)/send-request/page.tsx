'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { Send } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialUrgentRequests } from '@/lib/data';
import type { UrgentRequest } from '@/lib/types';
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

export default function SendRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useLocalStorage<UrgentRequest[]>('urgentRequests', initialUrgentRequests);

  const form = useForm<z.infer<typeof urgentRequestSchema>>({
    resolver: zodResolver(urgentRequestSchema),
    defaultValues: {
      quantity: 1,
      broadcastRadius: '5km',
    },
  });

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
                      <Input type="number" min="1" {...field} />
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
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl><Input placeholder="e.g., City General Hospital" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Location</FormLabel>
                  <FormControl><Input placeholder="e.g., 123 Main St, Anytown" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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