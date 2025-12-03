import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Trash2, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsApi } from '@/api/products';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, convertGoogleDriveUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';

export function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const { data: productsData } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
  });

  const wishlistProducts = productsData?.products?.filter(p => items.includes(p.id)) || [];

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart!');
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-muted/20 to-white min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <h1 className="text-5xl font-bold font-serif">My Wishlist</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-3 font-serif">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Save your favorite handmade treasures here!
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" className="rounded-full px-8 shadow-md">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
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
                        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-0 shadow-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Handmade
                    </Badge>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(product.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                    
                    <h3 className="font-semibold line-clamp-2 hover:text-primary mb-2 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.category && (
                    <Badge variant="outline" className="mb-3 rounded-full text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                    {product.stock === 0 ? (
                      <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                    ) : product.stock < 10 ? (
                      <Badge variant="secondary" className="text-[10px] leading-none whitespace-nowrap rounded-md px-1.5 py-px">Only {product.stock} left</Badge>
                    ) : null}
                  </div>

                  <Button
                    className="w-full gap-2 rounded-full shadow-sm"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </MainLayout>
  );
}
