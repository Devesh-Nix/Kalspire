import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter, Heart, Star, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/categories';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, convertGoogleDriveUrl } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', categoryId, searchQuery],
    queryFn: () => productsApi.getAll({ 
      categoryId: categoryId || undefined,
      search: searchQuery || undefined 
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const handleCategoryChange = (catId: string | null) => {
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(productId);
      toast.success('Added to wishlist');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 font-serif">All Products</h1>
          <p className="text-muted-foreground text-lg">
            {productsData?.total || 0} handcrafted treasures available
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <Card className="border-0 shadow-sm bg-white sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg font-serif">Filters</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">Categories</h3>
                    <div className="space-y-2">
                      <Button
                        variant={!categoryId ? 'default' : 'ghost'}
                        className="w-full justify-start rounded-full"
                        size="sm"
                        onClick={() => handleCategoryChange(null)}
                      >
                        All Products
                      </Button>
                      {categories?.filter(cat => cat.isActive).map((category) => (
                        <Button
                          key={category.id}
                          variant={categoryId === category.id ? 'default' : 'ghost'}
                          className="w-full justify-start rounded-full"
                          size="sm"
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse border-0">
                    <div className="aspect-square bg-muted rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-6 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productsData?.products && productsData.products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productsData.products.map((product) => (
                  <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-white">
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-muted/30 relative">
                        {product.images?.[0] ? (
                          <img
                            src={convertGoogleDriveUrl(product.images[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        
                        {/* Handmade Badge */}
                        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-0 shadow-sm">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Handmade
                        </Badge>

                        {/* Wishlist Button */}
                        <Button
                          variant={isInWishlist(product.id) ? "default" : "secondary"}
                          size="icon"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md rounded-full h-9 w-9"
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </Button>

                        {/* Quick Add Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <Button
                            className="w-full rounded-full"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            disabled={product.stock === 0}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Quick Add
                          </Button>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/products/${product.id}`}>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(12)</span>
                        </div>
                        
                        <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.stock === 0 ? (
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        ) : product.stock < 10 ? (
                          <Badge variant="secondary" className="text-xs">Only {product.stock} left</Badge>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2 font-serif">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or browse all categories</p>
                <Button onClick={() => handleCategoryChange(null)} variant="outline" className="rounded-full">
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
