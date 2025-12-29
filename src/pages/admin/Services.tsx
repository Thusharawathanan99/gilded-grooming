import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

const Services: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '30',
    image_url: '',
    is_active: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Service, 'id'>) => {
      const { error } = await supabase.from('services').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: 'Service created successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create service', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Service) => {
      const { error } = await supabase.from('services').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: 'Service updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update service', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: 'Service deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete service', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration_minutes: '30',
      image_url: '',
      is_active: true,
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      image_url: service.image_url || '',
      is_active: service.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      duration_minutes: parseInt(formData.duration_minutes),
      image_url: formData.image_url || null,
      is_active: formData.is_active,
      display_order: editingService?.display_order || (services?.length || 0),
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, ...serviceData });
    } else {
      createMutation.mutate(serviceData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Services & Pricing</h1>
            <p className="text-muted-foreground mt-1">Manage your barber services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Service Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-secondary border-border"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Duration (min)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-secondary border-border"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Active</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" className="flex-1">
                    {editingService ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading...</div>
          ) : services && services.length > 0 ? (
            services.map((service) => (
              <Card key={service.id} className={`bg-card border-border ${!service.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                    <span className="text-primary font-bold">${service.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{service.duration_minutes} min</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {!service.is_active && (
                    <span className="inline-block mt-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No services yet. Add your first service!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Services;
