import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Clock, Phone, MapPin, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SiteSettings {
  general: {
    shopName: string;
    tagline: string;
    description: string;
    logoUrl: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  hero: {
    heading: string;
    subheading: string;
    backgroundUrl: string;
  };
  about: {
    title: string;
    description: string;
    imageUrl: string;
    experience: string;
    customers: string;
    awards: string;
  };
}

const defaultSettings: SiteSettings = {
  general: {
    shopName: 'Old Thai Barber',
    tagline: 'Classic Cuts. Modern Style.',
    description: 'Premium men\'s grooming experience',
    logoUrl: '',
  },
  contact: {
    phone: '+66 123 456 789',
    email: 'info@oldthaibarber.com',
    address: '123 Barber Street, Bangkok, Thailand',
  },
  hours: {
    weekdays: '9:00 AM - 8:00 PM',
    saturday: '9:00 AM - 6:00 PM',
    sunday: 'Closed',
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  hero: {
    heading: 'Classic Cuts. Modern Style.',
    subheading: 'Premium Men\'s Barber Experience',
    backgroundUrl: '',
  },
  about: {
    title: 'Traditional Barbering with a Modern Touch',
    description: 'With over two decades of experience, we combine timeless techniques with contemporary style to give you the perfect look.',
    imageUrl: '',
    experience: '20+',
    customers: '10K+',
    awards: '15+',
  },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value;
      });
      
      return {
        general: settingsMap.general || defaultSettings.general,
        contact: settingsMap.contact || defaultSettings.contact,
        hours: settingsMap.hours || defaultSettings.hours,
        social: settingsMap.social || defaultSettings.social,
        hero: settingsMap.hero || defaultSettings.hero,
        about: settingsMap.about || defaultSettings.about,
      } as SiteSettings;
    },
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      const entries = Object.entries(data);
      
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const updateSettings = <K extends keyof SiteSettings>(
    section: K,
    field: keyof SiteSettings[K],
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground mt-1">Customize your website content</p>
          </div>
          <Button variant="gold" onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About Section</TabsTrigger>
            <TabsTrigger value="contact">Contact & Hours</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  General Information
                </CardTitle>
                <CardDescription>Basic information about your barbershop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Shop Name</Label>
                    <Input
                      value={settings.general.shopName}
                      onChange={(e) => updateSettings('general', 'shopName', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tagline</Label>
                    <Input
                      value={settings.general.tagline}
                      onChange={(e) => updateSettings('general', 'tagline', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Textarea
                    value={settings.general.description}
                    onChange={(e) => updateSettings('general', 'description', e.target.value)}
                    className="bg-secondary border-border"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Logo URL</Label>
                  <Input
                    value={settings.general.logoUrl}
                    onChange={(e) => updateSettings('general', 'logoUrl', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Hero Section</CardTitle>
                <CardDescription>Customize the main hero section of your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Main Heading</Label>
                  <Input
                    value={settings.hero.heading}
                    onChange={(e) => updateSettings('hero', 'heading', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Subheading</Label>
                  <Input
                    value={settings.hero.subheading}
                    onChange={(e) => updateSettings('hero', 'subheading', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Background Image URL</Label>
                  <Input
                    value={settings.hero.backgroundUrl}
                    onChange={(e) => updateSettings('hero', 'backgroundUrl', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">About Section</CardTitle>
                <CardDescription>Tell your story and showcase your achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Section Title</Label>
                  <Input
                    value={settings.about.title}
                    onChange={(e) => updateSettings('about', 'title', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Textarea
                    value={settings.about.description}
                    onChange={(e) => updateSettings('about', 'description', e.target.value)}
                    className="bg-secondary border-border"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Image URL</Label>
                  <Input
                    value={settings.about.imageUrl}
                    onChange={(e) => updateSettings('about', 'imageUrl', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Years Experience</Label>
                    <Input
                      value={settings.about.experience}
                      onChange={(e) => updateSettings('about', 'experience', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Happy Customers</Label>
                    <Input
                      value={settings.about.customers}
                      onChange={(e) => updateSettings('about', 'customers', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Awards</Label>
                    <Input
                      value={settings.about.awards}
                      onChange={(e) => updateSettings('about', 'awards', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </Label>
                    <Input
                      value={settings.contact.phone}
                      onChange={(e) => updateSettings('contact', 'phone', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Label>
                    <Input
                      value={settings.contact.email}
                      onChange={(e) => updateSettings('contact', 'email', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Address
                    </Label>
                    <Textarea
                      value={settings.contact.address}
                      onChange={(e) => updateSettings('contact', 'address', e.target.value)}
                      className="bg-secondary border-border"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Monday - Friday</Label>
                    <Input
                      value={settings.hours.weekdays}
                      onChange={(e) => updateSettings('hours', 'weekdays', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Saturday</Label>
                    <Input
                      value={settings.hours.saturday}
                      onChange={(e) => updateSettings('hours', 'saturday', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Sunday</Label>
                    <Input
                      value={settings.hours.sunday}
                      onChange={(e) => updateSettings('hours', 'sunday', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Social Media Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Facebook className="w-4 h-4" /> Facebook
                  </Label>
                  <Input
                    value={settings.social.facebook}
                    onChange={(e) => updateSettings('social', 'facebook', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Instagram className="w-4 h-4" /> Instagram
                  </Label>
                  <Input
                    value={settings.social.instagram}
                    onChange={(e) => updateSettings('social', 'instagram', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Twitter className="w-4 h-4" /> Twitter
                  </Label>
                  <Input
                    value={settings.social.twitter}
                    onChange={(e) => updateSettings('social', 'twitter', e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
