'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionService } from '@/services/sessionService';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { toast } from 'react-hot-toast';

export default function CreateSessionPage() {
  const router = useRouter();

  useEffect(() => {
    const create = async () => {
      try {
        const session = await sessionService.create();
        router.push(`/sessions/edit/${session._id}`);
      } catch (error) {
        toast.error('Failed to initialize new session');
        router.push('/dashboard');
      }
    };
    create();
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Initializing your new wellness session...</p>
      </div>
    </DashboardLayout>
  );
}
