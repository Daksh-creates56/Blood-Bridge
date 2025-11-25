'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Package, AlertTriangle, ShieldAlert } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialResources } from '@/lib/data';
import type { Resource, ResourceStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceCard } from '@/components/app/dashboard/resource-card';
import { Button } from '@/components/ui/button';
import { CompatibilityDialog } from '@/components/app/dashboard/compatibility-dialog';

export default function DashboardPage() {
  const [resources, setResources] = useLocalStorage<Resource[]>('resources', initialResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'All'>('All');

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch =
        resource.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || resource.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [resources, searchTerm, statusFilter]);

  const criticalCount = useMemo(() => resources.filter(r => r.status === 'Critical').length, [resources]);
  const lowCount = useMemo(() => resources.filter(r => r.status === 'Low').length, [resources]);
  
  const handleUpdateResource = (updatedResource: Resource) => {
    setResources(prevResources =>
      prevResources.map(r => (r.id === updatedResource.id ? updatedResource : r))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                    <p className="text-xs text-muted-foreground">Blood units across all locations</p>
                </div>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{resources.reduce((sum, r) => sum + r.quantity, 0)}</div>
                <CompatibilityDialog />
            </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Units with critical stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowCount}</div>
            <p className="text-xs text-muted-foreground">Units with low stock</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
            <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Filter by blood type or location..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={(value: ResourceStatus | 'All') => setStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Available">Sufficient</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
      </div>
      {filteredResources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} onUpdate={handleUpdateResource} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-24 text-center">
            <h3 className="text-2xl font-semibold tracking-tight">No resources found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setStatusFilter('All');}}>
            Clear Filters
            </Button>
        </div>
      )}
    </div>
  );
}
