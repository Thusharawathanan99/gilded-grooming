import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Image, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [appointments, customers, gallery, services, todayAppts, pendingAppts] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        totalAppointments: appointments.count || 0,
        totalCustomers: customers.count || 0,
        galleryImages: gallery.count || 0,
        totalServices: services.count || 0,
        todayAppointments: todayAppts.count || 0,
        pendingAppointments: pendingAppts.count || 0,
      };
    },
  });

  const { data: recentAppointments } = useQuery({
    queryKey: ['recent-appointments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statCards = [
    { 
      title: "Today's Appointments", 
      value: stats?.todayAppointments || 0, 
      icon: Calendar, 
      color: 'text-primary' 
    },
    { 
      title: 'Pending Approvals', 
      value: stats?.pendingAppointments || 0, 
      icon: Clock, 
      color: 'text-yellow-500' 
    },
    { 
      title: 'Total Customers', 
      value: stats?.totalCustomers || 0, 
      icon: Users, 
      color: 'text-blue-500' 
    },
    { 
      title: 'Active Services', 
      value: stats?.totalServices || 0, 
      icon: DollarSign, 
      color: 'text-green-500' 
    },
    { 
      title: 'Gallery Images', 
      value: stats?.galleryImages || 0, 
      icon: Image, 
      color: 'text-purple-500' 
    },
    { 
      title: 'Total Appointments', 
      value: stats?.totalAppointments || 0, 
      icon: CheckCircle, 
      color: 'text-cyan-500' 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Old Thai Barber Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Appointments */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments && recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{appt.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appt.service_name} • {format(new Date(appt.appointment_date), 'MMM d, yyyy')} at {appt.appointment_time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No appointments yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
