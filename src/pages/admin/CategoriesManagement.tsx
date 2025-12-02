import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FolderTree, Eye, EyeOff, Upload, X, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { categoriesApi } from '@/api/categories';
import type { Category } from '@/types';
import apiClient from '@/api/client';

export function CategoriesManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Category>>();

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setIsFormOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setIsFormOpen(false);
      setEditingCategory(null);
      reset();
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      categoriesApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category status updated');
    },
    onError: () => toast.error('Failed to update category status'),
  });

  const onSubmit = (data: any) => {
    const categoryData = {
      ...data,
      image: uploadedImage || data.image || '',
      isActive: editingCategory ? editingCategory.isActive : true,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: categoryData });
    } else {
      createMutation.mutate(categoryData as any);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maxSize', '50'); // 50KB limit for categories

    try {
      const response = await apiClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'}${response.data.url}`;
      
      setUploadedImage(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage('');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setUploadedImage(category.image || '');
    setUseUrlInput(false);
    reset(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This may affect associated products.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (category: Category) => {
    toggleActiveMutation.mutate({ id: category.id, isActive: !category.isActive });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setUploadedImage('');
    setUseUrlInput(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">Categories Management</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Organize your products into categories
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2 rounded-full shadow-sm w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Category Form */}
      {isFormOpen && (
        <Card className="shadow-md">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name *</label>
                <Input
                  {...register('name', { required: 'Category name is required' })}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Category Image</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={useUrlInput ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => setUseUrlInput(false)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={useUrlInput ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUseUrlInput(true)}
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      URL
                    </Button>
                  </div>
                </div>

                {!useUrlInput ? (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="category-image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="category-image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {isUploading ? 'Uploading...' : 'Click to upload category image'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Image will be automatically resized to under 150KB
                        </p>
                      </label>
                    </div>

                    {uploadedImage && (
                      <div className="relative inline-block">
                        <img
                          src={uploadedImage}
                          alt="Category preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={removeUploadedImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    {...register('image')}
                    placeholder="https://example.com/category-image.jpg"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="rounded-full">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="rounded-full">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
          ) : categories && categories.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-10 w-10 rounded-md object-cover border"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <FolderTree className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{category.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description || 'No description'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? 'success' : 'secondary'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(category)}
                              title={category.isActive ? 'Make Inactive' : 'Make Active'}
                            >
                              {category.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y">
                {categories.map((category) => (
                  <div key={category.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-16 w-16 rounded-lg object-cover border flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <FolderTree className="h-7 w-7 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base">{category.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {category.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant={category.isActive ? 'default' : 'secondary'} className="text-xs">
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(category)}
                              className="h-8 w-8 p-0"
                              title={category.isActive ? 'Make Inactive' : 'Make Active'}
                            >
                              {category.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <FolderTree className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No categories found. Create your first category!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
