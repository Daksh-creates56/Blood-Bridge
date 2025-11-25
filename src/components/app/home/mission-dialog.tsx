
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  HeartPulse,
  Droplets,
  ShieldCheck,
  LayoutDashboard,
  FlaskConical,
  HeartHandshake,
  Send,
  BellRing,
  BarChart2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import placeholderData from '@/lib/placeholder-images.json';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


const features = [
    {
        icon: LayoutDashboard,
        title: "Real-Time Dashboard",
        description: "Monitor blood inventory levels across all connected hospitals at a glance. Our intuitive dashboard provides a live overview of available units, helping you make quick and informed decisions.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-dashboard'),
        videoUrl: "https://cdn.pixabay.com/video/2022/07/16/124333-730771399_large.mp4",
    },
    {
        icon: FlaskConical,
        title: "AI-Powered Predictions",
        description: "Leverage the power of artificial intelligence to forecast potential blood shortages. Our predictive analytics help you proactively manage inventory and anticipate future needs before they become critical.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-predictions')

    },
    {
        icon: HeartHandshake,
        title: "Donation Camp Coordination",
        description: "Easily find and register for nearby blood donation camps. Our map-based interface shows you all active camps, their timings, and allows for seamless online booking to save a spot.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-camps')
    },
    {
        icon: Send,
        title: "Urgent Request Broadcast",
        description: "When time is critical, send out urgent requests for specific blood types. The system instantly notifies all nearby blood banks and potential donors within a specified radius, mobilizing help fast.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-requests')
    },
    {
        icon: BellRing,
        title: "Active Request Alerts",
        description: "Stay informed with a live feed of all active urgent requests. Donors and blood banks can view details and immediately respond to fulfill critical needs in the community.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-alerts')
    },
    {
        icon: BarChart2,
        title: "Insightful Analytics",
        description: "Dive deep into historical data with our comprehensive analytics page. Track donation trends, request patterns, and inventory metrics to optimize supply chain management.",
        image: placeholderData.placeholderImages.find(img => img.id === 'feature-analytics')
    },
]

export function MissionDialog() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('mission');

  React.useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  return (
    <>
      <DialogHeader>
        <VisuallyHidden>
            <DialogTitle>Our Mission and Features</DialogTitle>
            <DialogDescription>
                Learn about the mission of Blood Bridge and explore its key features.
            </DialogDescription>
        </VisuallyHidden>
      </DialogHeader>
      <Tabs defaultValue="mission" value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full h-full">
        <TabsList className="grid w-full grid-cols-2 h-14 rounded-t-lg rounded-b-none bg-muted/30">
          <TabsTrigger value="mission" className="h-full text-base rounded-tl-lg rounded-b-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Our Mission</TabsTrigger>
          <TabsTrigger value="features" className="h-full text-base rounded-tr-lg rounded-b-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mission" className="flex-1 overflow-auto p-8 md:p-12 mt-0 rounded-b-lg">
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
              <h2 className="text-3xl font-headline font-bold tracking-tight text-primary mb-4">
                  OUR MISSION
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                  To create a seamless and efficient ecosystem that connects blood donors, hospitals, and those in need, leveraging technology to save lives.
              </p>
              <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
                  <div className="flex flex-col items-center p-6">
                      <div className="p-4 bg-primary/10 rounded-full mb-4">
                          <Droplets className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">SAVE LIVES</h3>
                      <p className="max-w-xs text-muted-foreground">
                          Our platform directly connects those in need with willing donors, minimizing wait times and saving precious lives.
                      </p>
                  </div>
                  <div className="flex flex-col items-center p-6">
                      <div className="p-4 bg-primary/10 rounded-full mb-4">
                          <HeartPulse className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">BUILD COMMUNITY</h3>
                      <p className="max-w-xs text-muted-foreground">
                          We foster a strong community of donors and hospitals, working together for a reliable blood supply.
                      </p>
                  </div>
                  <div className="flex flex-col items-center p-6">
                      <div className="p-4 bg-primary/10 rounded-full mb-4">
                          <ShieldCheck className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-2">ENSURE SAFETY</h3>
                      <p className="max-w-xs text-muted-foreground">
                          With AI-powered predictions and real-time tracking, we proactively manage inventory to prevent shortages.
                      </p>
                  </div>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="flex-1 overflow-auto p-4 md:p-8 mt-0 rounded-b-lg">
          <Carousel setApi={setApi} className="w-full h-full flex flex-col justify-center">
            <CarouselContent className="items-center">
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="overflow-hidden border-none shadow-none bg-transparent">
                      <CardContent className="grid md:grid-cols-2 gap-8 items-center p-6">
                          <div className="flex flex-col space-y-4 text-center md:text-left items-center md:items-start animate-fade-in-up">
                              <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                                  <feature.icon className="h-8 w-8 text-primary" />
                              </div>
                              <h3 className="text-3xl font-headline font-bold text-primary">{feature.title}</h3>
                              <p className="text-base text-muted-foreground">{feature.description}</p>
                          </div>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                              {feature.videoUrl ? (
                                <video
                                  src={feature.videoUrl}
                                  autoPlay
                                  loop
                                  muted
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : feature.image && (
                                  <Image
                                      src={feature.image.imageUrl}
                                      alt={feature.title}
                                      fill
                                      className="object-cover"
                                      data-ai-hint={feature.image.imageHint}
                                  />
                              )}
                          </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center p-4">
              <CarouselPrevious className="static -translate-x-2" />
              <div className="py-2 text-center text-sm text-muted-foreground">
                Feature {current} of {features.length}
              </div>
              <CarouselNext className="static translate-x-2" />
            </div>
          </Carousel>
        </TabsContent>
      </Tabs>
    </>
  );
}
