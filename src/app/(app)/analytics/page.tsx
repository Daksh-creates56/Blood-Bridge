'use client';

import { useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Resource, UrgentRequest, Donor } from '@/lib/types';
import { initialResources, initialUrgentRequests, initialDonors } from '@/lib/data';
import { BarChart, PieChart, LineChart, Users, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4dff4d', '#4d4dff'];

export default function AnalyticsPage() {
  const [resources] = useLocalStorage<Resource[]>('resources', initialResources);
  const [requests] = useLocalStorage<UrgentRequest[]>('urgentRequests', initialUrgentRequests);
  const [donors] = useLocalStorage<Donor[]>('donors', initialDonors);

  const inventoryByBloodType = useMemo(() => {
    return resources.reduce((acc, resource) => {
      acc[resource.bloodType] = (acc[resource.bloodType] || 0) + resource.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [resources]);

  const inventoryChartData = Object.entries(inventoryByBloodType).map(([name, value]) => ({ name, value }));

  const requestsByStatus = useMemo(() => {
    return requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [requests]);
  
  const requestStatusChartData = Object.entries(requestsByStatus).map(([name, value]) => ({ name, value }));
  
  const donorsByBloodType = useMemo(() => {
    return donors.reduce((acc, donor) => {
      acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [donors]);

  const donorDistributionData = Object.entries(donorsByBloodType).map(([name, value]) => ({ name, value }));
  
  const requestTrendData = useMemo(() => {
    const sortedRequests = [...requests].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const trends = sortedRequests.reduce((acc, req) => {
        const date = new Date(req.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(trends).map(([date, count]) => ({ date, count })).slice(-30); // Last 30 days
  }, [requests]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blood Units</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.reduce((sum, r) => sum + r.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all hospitals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestsByStatus['Active'] || 0}</div>
            <p className="text-xs text-muted-foreground">Currently needing fulfillment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donors.length}</div>
            <p className="text-xs text-muted-foreground">Ready to save lives</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Inventory by Blood Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsBarChart data={inventoryChartData} layout="vertical" margin={{ left: -10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" name="Units" fill="hsl(var(--primary))" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Donor Blood Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[300px] w-full flex items-center justify-center">
              <RechartsPieChart>
                <Pie
                  data={donorDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {donorDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Urgent Request Trends (Last 30 entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsLineChart data={requestTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line type="monotone" dataKey="count" name="Requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
