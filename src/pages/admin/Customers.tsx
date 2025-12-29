import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Search, User, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

const Customers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Customer, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('customers').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer added successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to add customer', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Customer) => {
      const { error } = await supabase.from('customers').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update customer', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete customer', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      notes: customer.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      notes: formData.notes || null,
    };

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, created_at: editingCustomer.created_at, ...customerData });
    } else {
      createMutation.mutate(customerData);
    }
  };

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">Manage your customer database</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-secondary border-border"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" className="flex-1">
                    {editingCustomer ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Since {format(new Date(customer.created_at), 'MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                  {customer.notes && (
                    <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                      {customer.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No customers found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
