'use client';

import { useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialUrgentRequests } from '@/lib/data';
import type { UrgentRequest } from '@/lib/types';
import { RequestCard } from '@/components/app/view-alerts/request-card';
import { BellRing } from 'lucide-react';

export default function ViewAlertsPage() {
  const [requests, setRequests] = useLocalStorage<UrgentRequest[]>('urgentRequests', initialUrgentRequests);

  const activeRequests = useMemo(() => {
    return requests.filter(req => req.status === 'Active').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests]);
  
  const handleFulfillRequest = (requestId: string, donorLocation: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'Fulfilled', fulfilledBy: donorLocation } 
        : req
    ));
  };

  return (
    <div className="space-y-8">
      {activeRequests.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activeRequests.map(request => (
            <RequestCard key={request.id} request={request} onFulfill={handleFulfillRequest} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
            <BellRing className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Active Requests</h3>
            <p className="mt-2 text-muted-foreground">Everything is quiet for now. We'll update you when a new request comes in.</p>
        </div>
      )}
    </div>
  );
}
