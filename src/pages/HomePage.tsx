import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, Heart, Star, Sparkles, Quote, Instagram } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/categories';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, convertGoogleDriveUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getAll({ limit: 8 }),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

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

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "The crochet quality is absolutely stunning! Each piece is crafted with so much love and attention to detail.",
      rating: 5
    },
    {
      name: "Anjali Verma",
      text: "Beautiful handmade products. The resin keychains are perfect gifts. Will definitely order again!",
      rating: 5
    },
    {
      name: "Meera Patel",
      text: "Loved my crochet bag! It's unique, durable, and gets compliments everywhere I go.",
      rating: 5
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section - Elegant Boutique Style */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(237,137,107,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(145,160,130,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground border-0 shadow-sm">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              Handcrafted with Love
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-serif text-foreground">
              Kalspire
            </h1>
            <p className="text-xl sm:text-2xl text-primary font-medium mb-4">
              Artisan Crochet & Resin Creations
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover unique, handmade treasures crafted with passion. Each piece tells a story of creativity, 
              care, and artisan excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="gap-2 px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl">
                  Shop Crochet Collection <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base rounded-full border-2">
                  Explore All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {!categoriesLoading && categories && categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 font-serif">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Explore our handcrafted collections</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4">
              {categories.filter(cat => cat.isActive).slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-soft border-0 bg-gradient-to-b from-white to-muted/30">
                    <div className="aspect-square bg-muted/50 flex items-center justify-center overflow-hidden relative">
                      {category.image ? (
                        <>
                          <img
                            src={convertGoogleDriveUrl(category.image)}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <ShoppingBag className="h-16 w-16 text-primary/60 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <CardContent className="p-4 text-center bg-white">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold font-serif mb-2">Featured Crochet Collection</h2>
              <p className="text-muted-foreground">Handpicked favorites crafted with care</p>
            </div>
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline" size="lg" className="gap-2 rounded-full">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-6 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsData?.products?.slice(0, 8).map((product) => (
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

                      {/* Wishlist Button - Enhanced */}
                      <Button
                        variant={isInWishlist(product.id) ? "default" : "secondary"}
                        size="icon"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md rounded-full h-9 w-9"
                        onClick={(e) => handleToggleWishlist(e, product.id)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>

                      {/* Quick Add to Cart Overlay */}
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
                      {/* Rating Stars Preview */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(12)</span>
                      </div>
                      
                      <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
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
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-3 text-lg font-serif">Handcrafted Quality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every piece is lovingly handmade with premium materials and attention to detail
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                <ShoppingBag className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-3 text-lg font-serif">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quick and reliable shipping to bring your handmade treasures to your doorstep
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-3 text-lg font-serif">Made with Love</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each creation carries the artisan's passion and dedication to craft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gradient-to-b from-secondary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-serif">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Real reviews from happy customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-soft transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.text}</p>
                  <p className="font-semibold text-foreground">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon - Resin Collection */}
      <section className="py-20 bg-gradient-to-br from-accent/5 via-white to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground">
              Coming Soon
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-serif">Resin Collection</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Beautiful handcrafted resin keychains, coasters, and decorative pieces are on their way! 
              Stay tuned for unique designs that blend art and functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="gap-2 rounded-full border-2">
                  <Instagram className="h-5 w-5" />
                  Follow on Instagram for Updates
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/Instagram Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Instagram className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-serif">Join Our Artisan Community</h2>
            <p className="text-background/80 mb-8 text-lg">
              Follow us on Instagram for behind-the-scenes content, new arrivals, and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button size="lg" variant="secondary" className="gap-2 rounded-full px-8">
                  <Instagram className="h-5 w-5" />
                  @_kalspire_
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
