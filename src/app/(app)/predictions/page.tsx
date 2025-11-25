'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FlaskConical, AlertTriangle, ShieldCheck, ShieldAlert, Lightbulb } from 'lucide-react';
import { predictBloodShortages, type PredictBloodShortagesOutput } from '@/ai/flows/predict-blood-shortages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { bloodTypes } from '@/lib/schemas';

const predictionPeriods = ['Next 1 Week', 'Next 1 Month', 'Next 1 Year'] as const;

const predictionSchema = z.object({
  bloodType: z.enum(bloodTypes, { required_error: 'Please select a blood type.' }),
  predictionPeriod: z.enum(predictionPeriods, { required_error: 'Please select a prediction period.' }),
});

const UrgencyIcon = ({ level }: { level: string }) => {
  switch (level) {
    case 'Critical':
      return <AlertTriangle className="h-6 w-6 text-destructive" />;
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
      bloodType: 'A+',
      predictionPeriod: 'Next 1 Month',
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
            Select a blood type and a time period to predict potential blood shortages using AI analysis.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="predictionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prediction Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {predictionPeriods.map(period => (
                            <SelectItem key={period} value={period}>{period}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
          
           <Card className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
            <CardHeader className="flex flex-row items-start gap-4">
                <Lightbulb className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-300">AI Analysis Summary</CardTitle>
                  <CardDescription asChild>
                     <ul className="mt-2 list-disc pl-5 space-y-1 text-blue-800 dark:text-blue-400">
                      {predictionResult.analysisSummary.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </CardDescription>
                </div>
            </CardHeader>
          </Card>

          {predictionResult.predictedShortages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predictionResult.predictedShortages.map((shortage, index) => (
                <Card key={index} className={cn(
                  'border-2',
                  shortage.urgencyLevel === 'Critical' && 'border-destructive bg-red-50/50 dark:bg-red-900/20',
                  shortage.urgencyLevel === 'High' && 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20',
                  shortage.urgencyLevel === 'Moderate' && 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20'
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold">{shortage.bloodType}</CardTitle>
                      <UrgencyIcon level={shortage.urgencyLevel} />
                    </div>
                    <CardDescription className="font-semibold">{shortage.urgencyLevel} Urgency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">
                      Predicted Deficit: <span className="font-bold text-lg">{shortage.predictedDeficit} units</span>
                    </p>
                    <div>
                      <p className="text-sm font-medium">Affected Locations:</p>
                      <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                        {shortage.affectedLocations.map((loc, i) => (
                          <li key={i}>{loc}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20 text-center">
              <ShieldCheck className="h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Shortages Predicted</h3>
              {predictionResult.analysisSummary.length > 0 && 
                <p className="mt-2 text-muted-foreground">{predictionResult.analysisSummary[0]}</p>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
