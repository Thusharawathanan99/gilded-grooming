import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GalleryImage {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  display_order: number;
}

const Gallery: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'haircut',
    is_featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<GalleryImage, 'id'>) => {
      const { error } = await supabase.from('gallery').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Image added successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to add image', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Image deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete image', variant: 'destructive' });
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from('gallery').update({ is_featured }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      category: 'haircut',
      is_featured: false,
    });
    setIsDialogOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ title: 'Please add an image', variant: 'destructive' });
      return;
    }
    createMutation.mutate({
      title: formData.title || null,
      image_url: formData.image_url,
      category: formData.category,
      is_featured: formData.is_featured,
      display_order: images?.length || 0,
    });
  };

  const categories = ['haircut', 'beard', 'styling', 'grooming', 'before-after'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Gallery</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio images</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Image</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Upload Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {formData.image_url ? (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="w-8 h-8" />
                          <span>{uploading ? 'Uploading...' : 'Click to upload'}</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Or Enter Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-secondary border-border"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Title (optional)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat.replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Featured</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" className="flex-1" disabled={uploading}>
                    Add Image
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading...</div>
          ) : images && images.length > 0 ? (
            images.map((image) => (
              <Card key={image.id} className="bg-card border-border overflow-hidden group">
                <CardContent className="p-0 relative">
                  <img
                    src={image.image_url}
                    alt={image.title || 'Gallery image'}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={image.is_featured ? 'text-primary' : 'text-foreground'}
                      onClick={() => toggleFeatureMutation.mutate({ id: image.id, is_featured: !image.is_featured })}
                    >
                      <Star className={`w-5 h-5 ${image.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(image.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  {image.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="w-5 h-5 text-primary fill-current" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                    <p className="text-sm text-foreground truncate">{image.title || image.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No images yet. Add your first image!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Gallery;
