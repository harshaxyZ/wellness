'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check, X, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: adminService.getSessions,
  });

  const approveMutation = useMutation({
    mutationFn: adminService.approveSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast.success('Session approved');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adminService.rejectSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast.success('Session moved to draft');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast.success('Session deleted');
    },
  });

  if (isLoading) return <DashboardLayout>Loading sessions...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Session Moderation</h1>
        <p className="text-muted-foreground">Review and moderate all wellness sessions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions?.map((session) => (
                <TableRow key={session._id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>
                    {(session.userId as any)?.name || 'Unknown'}
                    <p className="text-xs text-muted-foreground">{(session.userId as any)?.email}</p>
                  </TableCell>
                  <TableCell>{session.category}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === 'published' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       {session.status === 'draft' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-500"
                          onClick={() => approveMutation.mutate(session._id)}
                          title="Approve"
                        >
                          <Check size={18} />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-orange-500"
                          onClick={() => rejectMutation.mutate(session._id)}
                          title="Reject to Draft"
                        >
                          <X size={18} />
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/sessions/edit/${session._id}`}>
                          <Eye size={18} />
                        </Link>
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => {
                          if (confirm('Delete this session permanently?')) {
                            deleteMutation.mutate(session._id);
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
