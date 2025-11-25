'use client';

import { useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import type { BloodType } from '@/lib/types';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const compatibility: Record<BloodType, BloodType[]> = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['A+', 'B+', 'AB+', 'O+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
};

export function BloodCompatibilityMatrix() {
  const [selectedDonor, setSelectedDonor] = useState<BloodType | null>(null);

  const handleDonorSelect = (donor: BloodType) => {
    setSelectedDonor(prev => (prev === donor ? null : donor));
  };

  const getRecipientStatus = (recipient: BloodType) => {
    if (!selectedDonor) return 'neutral';
    if (compatibility[selectedDonor].includes(recipient)) return 'compatible';
    return 'incompatible';
  };

  return (
    <div className="space-y-6">
        <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center">SELECT DONOR</h3>
        <div className="grid grid-cols-4 gap-2">
            {bloodTypes.map(type => (
            <Button
                key={type}
                variant={selectedDonor === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDonorSelect(type)}
                className="transition-all duration-200"
            >
                {type}
            </Button>
            ))}
        </div>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-popover px-2 text-muted-foreground">
                Can Donate To
            </span>
        </div>
        </div>
        <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center">RECIPIENTS</h3>
        <div className="grid grid-cols-4 gap-2">
            {bloodTypes.map(type => {
            const status = getRecipientStatus(type);
            return (
                <div
                key={type}
                className={cn(
                    'relative p-2 flex flex-col items-center justify-center aspect-square rounded-lg border-2 transition-all duration-300',
                    status === 'neutral' && 'bg-muted/30 border-dashed',
                    status === 'compatible' && 'bg-green-100 dark:bg-green-900/40 border-green-500 scale-105 shadow-lg',
                    status === 'incompatible' && 'bg-red-100 dark:bg-red-900/40 border-red-500 opacity-50'
                )}
                >
                <span className="font-bold text-lg">{type}</span>
                {status !== 'neutral' && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-full bg-white dark:bg-card">
                    {status === 'compatible' ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-red-600" />}
                    </div>
                )}
                </div>
            );
            })}
        </div>
        </div>
    </div>
  );
}
