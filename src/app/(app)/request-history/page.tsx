'use client';

import { useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialUrgentRequests } from '@/lib/data';
import type { UrgentRequest } from '@/lib/types';
import { History, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

function HistoryCard({ request }: { request: UrgentRequest }) {
  const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });

  const statusInfo = {
    Fulfilled: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      badge: 'success' as const,
      borderColor: 'border-green-200 dark:border-green-800'
    },
    Expired: {
      icon: <XCircle className="h-5 w-5 text-gray-500" />,
      badge: 'secondary' as const,
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    Active: {
      icon: <History className="h-5 w-5 text-yellow-500" />,
      badge: 'warning' as const,
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    }
  }[request.status];

  return (
    <Card className={cn("bg-card", statusInfo.borderColor)}>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          {statusInfo.icon}
          <CardTitle className="text-xl">{request.bloodType}</CardTitle>
        </div>
        <Badge variant={statusInfo.badge}>{request.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Requested {timeAgo} for {request.hospitalName}</p>
        <p className="mt-2 text-sm">Quantity: <span className="font-semibold">{request.quantity} units</span></p>
        {request.status === 'Fulfilled' && request.fulfilledBy && (
           <p className="mt-1 text-sm">Fulfilled by: <span className="font-semibold">{request.fulfilledBy}</span></p>
        )}
      </CardContent>
    </Card>
  );
}

export default function RequestHistoryPage() {
  const [requests] = useLocalStorage<UrgentRequest[]>('urgentRequests', initialUrgentRequests);

  const historicalRequests = useMemo(() => {
    return requests
      .filter(req => req.status === 'Fulfilled' || req.status === 'Expired')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <History className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Request History</h1>
        <p className="mt-2 text-muted-foreground">A log of all past urgent requests.</p>
      </div>

      {historicalRequests.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {historicalRequests.map(request => (
            <HistoryCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20 text-center">
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">No Historical Requests</h3>
          <p className="mt-2 text-muted-foreground">Past requests will appear here once they are fulfilled or expire.</p>
        </div>
      )}
    </div>
  );
}
