'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FlaskConical, AlertTriangle, ShieldCheck, ShieldAlert, Lightbulb, Download } from 'lucide-react';
import { predictBloodShortages, type PredictBloodShortagesOutput } from '@/ai/flows/predict-blood-shortages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { bloodTypes } from '@/lib/schemas';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const predictionPeriods = ['Next 1 Week', 'Next 1 Month', 'Next 1 Year'] as const;

const predictionSchema = z.object({
  bloodType: z.enum(bloodTypes, { required_error: 'Please select a blood type.' }),
  predictionPeriod: z.enum(predictionPeriods, { required_error: 'Please select a prediction period.' }),
});

const UrgencyIcon = ({ level, className }: { level: string, className?: string }) => {
  switch (level) {
    case 'Critical':
      return <AlertTriangle className={cn("h-6 w-6 text-destructive", className)} />;
    case 'High':
      return <ShieldAlert className={cn("h-6 w-6 text-orange-500", className)} />;
    case 'Moderate':
      return <ShieldCheck className={cn("h-6 w-6 text-yellow-500", className)} />;
    default:
      return null;
  }
};

export default function PredictionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictBloodShortagesOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof predictionSchema> | null>(null);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

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
    setFormValues(values);
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

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    toast({
      title: 'Preparing PDF...',
      description: 'Your download will start shortly.',
    });

    const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Blood-Shortage-Prediction-${formValues?.bloodType}-${formValues?.predictionPeriod.replace(' ', '-')}.pdf`);
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
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

      {predictionResult && formValues && (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Prediction Results</h2>
                <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
            
            <div ref={reportRef} className="p-8 border rounded-lg bg-background text-foreground">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Blood Shortage Prediction Report</h1>
                    <p className="text-muted-foreground text-sm">Generated on {new Date().toLocaleDateString()}</p>
                </header>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
                    <div><span className="font-semibold">Blood Type Analyzed:</span> {formValues.bloodType}</div>
                    <div><span className="font-semibold">Prediction Period:</span> {formValues.predictionPeriod}</div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Lightbulb className="text-blue-500"/> AI Analysis Summary</h3>
                    <div className="p-4 bg-muted rounded-md border">
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            {predictionResult.analysisSummary.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Predicted Shortages</h3>
                    {predictionResult.predictedShortages.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2">
                        {predictionResult.predictedShortages.map((shortage, index) => (
                            <div key={index} className={cn(
                                'border-2 rounded-lg p-4 space-y-3',
                                shortage.urgencyLevel === 'Critical' && 'border-destructive bg-red-50/50 dark:bg-red-900/20',
                                shortage.urgencyLevel === 'High' && 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20',
                                shortage.urgencyLevel === 'Moderate' && 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20'
                            )}>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-2xl font-bold">{shortage.bloodType}</h4>
                                    <UrgencyIcon level={shortage.urgencyLevel} className="h-8 w-8" />
                                </div>
                                <p className="font-semibold text-lg">{shortage.urgencyLevel} Urgency</p>
                                <p>
                                    Predicted Deficit: <span className="font-bold text-xl">{shortage.predictedDeficit} units</span>
                                </p>
                                <div>
                                    <p className="font-medium">Affected Locations:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
                                    {shortage.affectedLocations.map((loc, i) => (
                                        <li key={i}>{loc}</li>
                                    ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                            <ShieldCheck className="h-12 w-12 text-green-500" />
                            <h3 className="mt-4 text-xl font-semibold">No Shortages Predicted</h3>
                            <p className="mt-2 text-muted-foreground">Analysis indicates a stable supply for the selected period.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
