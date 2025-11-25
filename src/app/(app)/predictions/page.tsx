'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FlaskConical, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { predictBloodShortages, type PredictBloodShortagesOutput } from '@/app/actions/predict';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const historicalDataDefault = `date,blood_type,donated,used,location
2023-01-01,A+,10,8,Main Hospital
2023-01-01,O-,5,12,City Clinic
2023-01-02,B+,8,6,Main Hospital
2023-01-02,A+,12,10,City Clinic
2023-01-03,O-,3,15,Main Hospital`;

const realTimeInventoryDefault = `{
  "Main Hospital": {"A+": 25, "O-": 8, "B+": 30},
  "City Clinic": {"A+": 40, "O-": 15, "B+": 22}
}`;

const predictionSchema = z.object({
  historicalData: z.string().min(1, 'Historical data is required.'),
  realTimeInventory: z.string().min(1, 'Real-time inventory is required.'),
  alertThreshold: z.coerce.number().min(0).max(1),
});

const UrgencyIcon = ({ level }: { level: string }) => {
  switch (level) {
    case 'Critical':
      return <AlertTriangle className="h-6 w-6 text-red-500" />;
    case 'High':
      return <ShieldAlert className="h-6 w-6 text-orange-500" />;
    case 'Moderate':
      return <ShieldCheck className="h-6 w-6 text-yellow-500" />;
    default:
      return null;
  }
};

export default function PredictionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictBloodShortagesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      historicalData: historicalDataDefault,
      realTimeInventory: realTimeInventoryDefault,
      alertThreshold: 0.2,
    },
  });

  const onSubmit = async (values: z.infer<typeof predictionSchema>) => {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const result = await predictBloodShortages(values);
      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: 'Failed to generate predictions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Blood Shortage Prediction</CardTitle>
          <CardDescription>
            Use AI to analyze historical and real-time data to predict potential blood shortages.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="historicalData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Data (CSV)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} placeholder="date,blood_type,donated,used,location..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="realTimeInventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Real-time Inventory (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} placeholder={`{"Location": {"A+": 50, ...}}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="alertThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FlaskConical className="mr-2 h-4 w-4" /> Predict Shortages
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {predictionResult && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Prediction Results</h2>
          {predictionResult.predictedShortages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predictionResult.predictedShortages.map((shortage, index) => (
                <Card key={index} className={cn(
                  shortage.urgencyLevel === 'Critical' && 'border-red-500',
                  shortage.urgencyLevel === 'High' && 'border-orange-500',
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{shortage.bloodType}</CardTitle>
                      <UrgencyIcon level={shortage.urgencyLevel} />
                    </div>
                    <CardDescription>{shortage.urgencyLevel} Urgency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      Predicted Deficit: <span className="font-bold">{shortage.predictedDeficit} units</span>
                    </p>
                    <p>Affected Locations:</p>
                    <ul className="list-disc pl-5">
                      {shortage.affectedLocations.map((loc, i) => (
                        <li key={i}>{loc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
              <ShieldCheck className="h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Shortages Predicted</h3>
              <p className="mt-2 text-muted-foreground">Based on the provided data, the blood supply appears stable.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
