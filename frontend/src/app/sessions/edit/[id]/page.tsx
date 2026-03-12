'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Trash2, Plus, GripVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Session, SessionStep } from '@/types';
import { debounce } from 'lodash';

// Basic debounce implementation since lodash might not be fully installed/linked
function myDebounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function SessionEditPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Session>>({
    title: '',
    description: '',
    category: '',
    duration: 0,
    steps: [{ title: '', content: '' }],
  });

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionService.getById(id),
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Session>) => sessionService.update(id, data),
    onSuccess: () => {
      toast.success('Session saved manually');
    },
  });

  const autosaveMutation = useMutation({
    mutationFn: (data: Partial<Session>) => sessionService.autosave(id, data),
  });

  // Debounced autosave
  const debouncedAutosave = useCallback(
    myDebounce((data: Partial<Session>) => {
      autosaveMutation.mutate(data);
    }, 5000),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    debouncedAutosave(updated);
  };

  const handleStepChange = (index: number, field: keyof SessionStep, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    const updated = { ...formData, steps: newSteps };
    setFormData(updated);
    debouncedAutosave(updated);
  };

  const addStep = () => {
    const updated = {
      ...formData,
      steps: [...(formData.steps || []), { title: '', content: '' }],
    };
    setFormData(updated);
    debouncedAutosave(updated);
  };

  const removeStep = (index: number) => {
    const newSteps = (formData.steps || []).filter((_, i) => i !== index);
    const updated = { ...formData, steps: newSteps };
    setFormData(updated);
    debouncedAutosave(updated);
  };

  const handlePublish = async () => {
    try {
      await sessionService.update(id, { ...formData, status: 'published' });
      toast.success('Session published successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to publish session');
    }
  };

  if (isLoading) return <DashboardLayout>Loading editor...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Edit Session</h1>
          <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
            {formData.status}
          </Badge>
          {autosaveMutation.isPending && (
            <span className="text-xs text-muted-foreground animate-pulse">Autosaving...</span>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => saveMutation.mutate(formData)}>
            <Save className="mr-2" size={18} />
            Save Draft
          </Button>
          <Button onClick={handlePublish}>
            <Send className="mr-2" size={18} />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter session title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full min-h-[100px] border rounded-md p-2 bg-transparent"
                  placeholder="What is this session about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Meditation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Steps</h2>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="mr-2" size={16} />
                Add Step
              </Button>
            </div>
            
            {formData.steps?.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex gap-4">
                  <div className="pt-2">
                    <GripVertical className="text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <Input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                        className="font-medium bg-transparent border-none p-0 focus-visible:ring-0 text-lg"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStep(index)}
                        className="text-destructive"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <textarea
                      placeholder="Step content..."
                      value={step.content}
                      onChange={(e) => handleStepChange(index, 'content', e.target.value)}
                      className="w-full min-h-[80px] border-none bg-transparent p-0 focus:ring-0 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Steps</span>
                <span className="font-medium">{formData.steps?.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Time</span>
                <span className="font-medium">{formData.duration} mins</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted-foreground">Last Saved</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
