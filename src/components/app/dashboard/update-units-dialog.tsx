'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { Edit } from 'lucide-react';

import type { Resource } from '@/lib/types';
import { updateUnitsSchema } from '@/lib/schemas';
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

interface UpdateUnitsDialogProps {
  resource: Resource;
  onUpdate: (updatedResource: Resource) => void;
}

type Step = 'login' | 'update';

export function UpdateUnitsDialog({ resource, onUpdate }: UpdateUnitsDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('login');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateUnitsSchema>>({
    resolver: zodResolver(updateUnitsSchema),
    defaultValues: {
      username: 'admin',
      password: '',
      quantity: resource.quantity,
    },
  });

  const onSubmit = (values: z.infer<typeof updateUnitsSchema>) => {
    if (step === 'login') {
      // Mock login check
      if (values.username === 'admin' && values.password === 'password') {
        setStep('update');
      } else {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid credentials. Hint: password is "password".',
        });
      }
    } else {
      let status: Resource['status'] = 'Available';
      if (values.quantity < 10) status = 'Critical';
      else if (values.quantity < 30) status = 'Low';
      
      const updatedResource = {
        ...resource,
        quantity: values.quantity,
        status: status,
      };
      onUpdate(updatedResource);
      toast({
        title: 'Success',
        description: `Units for ${resource.bloodType} at ${resource.location} updated to ${values.quantity}.`,
      });
      setOpen(false);
      // Reset form for next time
      setTimeout(() => {
        setStep('login');
        form.reset({
          username: 'admin',
          password: '',
          quantity: values.quantity
        });
      }, 500);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset to login step when dialog is closed
      setTimeout(() => {
        setStep('login');
        form.reset({
          username: 'admin',
          password: '',
          quantity: resource.quantity
        });
      }, 500);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Update Units
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'login' ? 'Admin Login' : `Update ${resource.bloodType} Units`}
          </DialogTitle>
          <DialogDescription>
            {step === 'login'
              ? `Enter credentials for ${resource.location}.`
              : `Current units: ${resource.quantity}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 'login' ? (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit">
                {step === 'login' ? 'Login' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}