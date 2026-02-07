import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, Heart, Star, Sparkles, Quote, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { useRef } from 'react';

export function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

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

  const scrollCategories = (direction: 'left' | 'right') => {
    const element = categoriesScrollRef.current;
    if (!element) return;
    
    // Use requestAnimationFrame to batch DOM reads and writes
    requestAnimationFrame(() => {
      const scrollAmount = 300;
      const currentScroll = element.scrollLeft;
      const newScrollLeft = direction === 'left' 
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
      
      // Perform all writes in the next frame
      element.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    });
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
      {/* Hero Section - Mesmerizing with Parallax & Animations */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(237,137,107,0.15),transparent_50%)] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(145,160,130,0.15),transparent_50%)] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center -mt-28">
            <Badge className=" -mt-12 mb-6 px-6 py-2.5 text-sm font-medium border-0 shadow-glow animate-fade-in-down bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-pointer">
              <Sparkles className="h-4 w-4 mr-2 inline animate-pulse" />
              Handcrafted with Love
            </Badge>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 font-serif text-foreground animate-fade-in-up">
              <span className="inline-block hover:scale-110 transition-transform duration-300">K</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>a</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>l</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '150ms' }}>s</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '200ms' }}>p</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '250ms' }}>i</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '300ms' }}>r</span>
              <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '350ms' }}>e</span>
            </h1>
            <p className="text-2xl sm:text-3xl gradient-text font-semibold mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Artisan Crochet & Resin Creations
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              Discover unique, handmade treasures crafted with passion. Each piece tells a story of creativity, 
              care, and artisan excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="group gap-2 px-10 py-7 text-lg rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                  Shop Crochet Collection 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="outline" className="gap-2 px-10 py-7 text-lg rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  Explore All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Categories Section - Enhanced with 3D Effects */}
      {!categoriesLoading && categories && categories.length > 0 && (
        <section className="py-12 pt-24 bg-gradient-to-b from-white to-muted/20 overflow-x-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-5xl font-bold mb-4 font-serif">Shop by Category</h2>
              <p className="text-muted-foreground text-xl">Explore our handcrafted collections</p>
            </div>
            <div className="relative pb-8">
              {/* Left Arrow - Enhanced */}
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-4 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 -ml-4 md:-ml-6"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Scrollable Categories Container */}
              <div
                ref={categoriesScrollRef}
                className="flex gap-10 md:gap-12 overflow-x-auto scrollbar-hide px-8 md:px-12 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.filter(cat => cat.isActive).map((category, index) => (
                  <Link
                    key={category.id}
                    to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                    className="group flex flex-col items-center flex-shrink-0 animate-scale-in pt-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative mb-6 transition-all duration-500 hover:-translate-y-2">
                      <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden relative shadow-soft group-hover:shadow-glow-lg transition-all duration-500 border-4 border-white group-hover:border-primary/30 group-hover:rotate-6">
                        {category.image ? (
                          <>
                            <img
                              src={convertGoogleDriveUrl(category.image)}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <ShoppingBag className="h-20 w-20 text-primary/60 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors duration-300 group-hover:scale-110 inline-block">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm md:text-base text-muted-foreground mt-2 line-clamp-2 max-w-[220px]">{category.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Arrow - Enhanced */}
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-4 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 -mr-4 md:-mr-6"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section - Mesmerizing Cards */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-white to-muted/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
            <div className="animate-fade-in-up">
              <h2 className="text-5xl font-bold font-serif mb-3">Featured Collection</h2>
              <p className="text-muted-foreground text-lg">Handpicked favorites crafted with care</p>
            </div>
            <Link to={ROUTES.PRODUCTS} className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Button variant="outline" size="lg" className="gap-2 rounded-full hover:shadow-glow hover:scale-105 transition-all duration-300">
                View All Products <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 shimmer" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2 shimmer" />
                    <div className="h-6 bg-muted rounded shimmer" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsData?.products?.slice(0, 8).map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden border-0 shadow-soft hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-2 bg-white backdrop-blur-sm animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 relative">
                      {product.images?.[0] ? (
                        <>
                          <img
                            src={convertGoogleDriveUrl(product.images[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                          />
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-muted-foreground group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}
                      
                      {/* Enhanced Handmade Badge */}
                      <Badge className="absolute top-3 left-3 glass border-0 shadow-soft backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                        Handmade
                      </Badge>

                      {/* Enhanced Wishlist Button */}
                      <Button
                        variant={isInWishlist(product.id) ? "default" : "secondary"}
                        size="icon"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-glow rounded-full h-10 w-10 hover:scale-110"
                        onClick={(e) => handleToggleWishlist(e, product.id)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current animate-pulse' : ''}`} />
                      </Button>

                      {/* Enhanced Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                          className="w-full rounded-full shadow-glow hover:scale-105 transition-transform duration-300"
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
                  <CardContent className="p-5">
                    <Link to={`/products/${product.id}`}>
                      {/* Enhanced Rating Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1 font-medium">(12)</span>
                      </div>
                      
                      <h3 className="font-bold text-base line-clamp-1 hover:text-primary transition-colors mb-2 group-hover:scale-105 origin-left duration-300">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary group-hover:scale-110 inline-block transition-transform">{formatCurrency(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.stock === 0 ? (
                        <Badge variant="destructive" className="text-xs animate-pulse">Out of Stock</Badge>
                      ) : product.stock < 10 ? (
                        <Badge variant="secondary" className="text-[10px] leading-none whitespace-nowrap rounded-md px-1.5 py-px ml-1 animate-pulse">Only {product.stock} left</Badge>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Enhanced with Hover Effects */}
      <section className="py-24 bg-gradient-to-b from-white to-muted/10 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500 shadow-soft group-hover:shadow-glow group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold mb-4 text-xl font-serif group-hover:text-primary transition-colors duration-300">Handcrafted Quality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every piece is lovingly handmade with premium materials and attention to detail
              </p>
            </div>
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary/40 to-secondary/10 group-hover:from-secondary group-hover:to-secondary/80 transition-all duration-500 shadow-soft group-hover:shadow-glow group-hover:scale-110 group-hover:rotate-6">
                <ShoppingBag className="h-10 w-10 text-secondary-foreground group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold mb-4 text-xl font-serif group-hover:text-primary transition-colors duration-300">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quick and reliable shipping to bring your handmade treasures to your doorstep
              </p>
            </div>
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 group-hover:from-accent group-hover:to-accent/80 transition-all duration-500 shadow-soft group-hover:shadow-glow group-hover:scale-110 group-hover:rotate-6">
                <Heart className="h-10 w-10 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold mb-4 text-xl font-serif group-hover:text-primary transition-colors duration-300">Made with Love</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each creation carries the artisan's passion and dedication to craft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - Enhanced Cards */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-primary/5 to-white"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4 font-serif">What Our Customers Say</h2>
            <p className="text-muted-foreground text-xl">Real reviews from happy customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-soft hover:shadow-glow-lg transition-all duration-500 bg-white/80 backdrop-blur-sm hover:-translate-y-2 group animate-scale-in overflow-hidden relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500"></div>
                
                <CardContent className="p-8 relative z-10">
                  <Quote className="h-10 w-10 text-primary/30 mb-6 group-hover:scale-110 group-hover:text-primary/50 transition-all duration-300" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-base">{testimonial.text}</p>
                  <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-300">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon - Resin Collection - Enhanced */}
      <section className="py-24 relative overflow-hidden">
        {/* Stunning gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-white to-accent/5"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 px-6 py-3 text-base font-semibold border-0 shadow-glow  bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors duration-300 cursor-pointer">
              Coming Soon
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 font-serif animate-fade-in-up">
              <span className="gradient-text">Resin Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Beautiful handcrafted resin keychains, coasters, and decorative pieces are on their way! 
              Stay tuned for unique designs that blend art and functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="group gap-3 rounded-full border-2 hover:border-accent hover:bg-accent/10 hover:scale-105 transition-all duration-300 px-10 py-7 text-lg shadow-soft hover:shadow-glow">
                  <Instagram className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Follow on Instagram for Updates
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/Instagram Section - Dramatic Dark Section */}
      <section className="py-24 bg-gradient-to-br from-foreground via-foreground/95 to-foreground text-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-background rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-background rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 inline-block animate-bounce-smooth">
              <Instagram className="h-16 w-16 mx-auto opacity-90" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-serif animate-fade-in-up">Join Our Artisan Community</h2>
            <p className="text-background/80 mb-12 text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Follow us on Instagram for behind-the-scenes content, new arrivals, and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button size="lg" variant="secondary" className="group gap-3 rounded-full px-10 py-7 text-lg shadow-glow hover:shadow-glow-lg hover:scale-110 transition-all duration-300">
                  <Instagram className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
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
