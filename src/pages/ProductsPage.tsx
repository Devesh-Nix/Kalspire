import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter, Heart, Star, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/categories';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, optimizeImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const priceMinParam = searchParams.get('priceMin');
  const priceMaxParam = searchParams.get('priceMax');
  const sortParam = searchParams.get('sort');
  const priceMin = priceMinParam ? Number(priceMinParam) : undefined;
  const priceMax = priceMaxParam ? Number(priceMaxParam) : undefined;
  const sort = sortParam || undefined;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products', categoryId, searchQuery, priceMin, priceMax, sort],
    queryFn: ({ pageParam = 1 }) => productsApi.getAll({
      categoryId: categoryId || undefined,
      search: searchQuery || undefined,
      priceMin,
      priceMax,
      sort,
      limit: 20,
      page: pageParam,
    }),
    getNextPageParam: (lastPage, pages) => {
      const currentPage = pages.length;
      const totalPages = Math.ceil(lastPage.total / 20);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single products array
  const productsData = data?.pages.flatMap((page) => page.products) || [];
  const totalProducts = data?.pages[0]?.total || 0;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Loading next page...', { hasNextPage, isFetchingNextPage });
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCategoryChange = (catId: string | null) => {
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    // Auto-close filters on mobile
    if (window.innerWidth < 1024) {
      setMobileFiltersOpen(false);
    }
  };

  const handlePriceChange = (min?: number, max?: number) => {
    if (min !== undefined) {
      searchParams.set('priceMin', String(min));
    } else {
      searchParams.delete('priceMin');
    }
    if (max !== undefined) {
      searchParams.set('priceMax', String(max));
    } else {
      searchParams.delete('priceMax');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (value: 'price:asc' | 'price:desc' | '') => {
    if (value) {
      searchParams.set('sort', value);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  // Close mobile filters when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileFiltersOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
        <div className="mb-8 flex items-center justify-between gap-3 animate-fade-in-down">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-serif gradient-text mb-2">All Products</h1>
            <p className="text-muted-foreground text-base sm:text-xl font-medium">
              <span className="text-primary font-bold">{totalProducts || 0}</span> handcrafted treasures available
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full gap-2 lg:hidden glass hover:shadow-glow hover:scale-110 transition-all duration-300"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filters"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar - Enhanced */}
          <aside className="w-full lg:w-72 shrink-0 relative animate-slide-in-left">
            <Card className={`border-0 shadow-soft glass backdrop-blur-md bg-white/80 ${mobileFiltersOpen ? 'z-50' : 'hidden'} lg:block sticky top-24 hover:shadow-glow transition-all duration-500`} id="mobile-filters">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-xl font-serif">Filters</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">Categories</h3>
                    <Select
                      label="Select Category"
                      value={categoryId || 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value === 'all' ? null : e.target.value)}
                    >
                      <option value="all">All Products</option>
                      {categories?.filter(cat => cat.isActive).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">Price Range</h3>
                    <div className="space-y-3">
                      <div className="px-1">
                        <div className="relative h-8">
                          {/* Track */}
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full" />
                          {/* Selected range highlight (optional visual) */}
                          {/* Sliders: min and max */}
                          <input
                            type="range"
                            min={0}
                            max={10000}
                            step={10}
                            value={priceMin ?? 0}
                            className="absolute w-full appearance-none bg-transparent h-8"
                            onChange={(e) => {
                              const newMin = Number(e.target.value);
                              const clampedMin = Math.min(newMin, priceMax ?? 10000);
                              handlePriceChange(clampedMin, priceMax);
                            }}
                            aria-label="Minimum price"
                          />
                          <input
                            type="range"
                            min={0}
                            max={10000}
                            step={10}
                            value={priceMax ?? 10000}
                            className="absolute w-full appearance-none bg-transparent h-8"
                            onChange={(e) => {
                              const newMax = Number(e.target.value);
                              const clampedMax = Math.max(newMax, priceMin ?? 0);
                              handlePriceChange(priceMin, clampedMax);
                            }}
                            aria-label="Maximum price"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{priceMin !== undefined ? `₹${priceMin}` : '₹0'}</span>
                        <span>{priceMax !== undefined ? `₹${priceMax}` : '₹10000'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Drag left handle for min</span>
                        <span>Drag right handle for max</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">Sort By</h3>
                    <Select
                      value={sort || 'default'}
                      onChange={(e) => handleSortChange((e.target.value === 'default' ? '' : e.target.value) as 'price:asc' | 'price:desc' | '')}
                    >
                      <option value="default">Default</option>
                      <option value="price:asc">Price: Low to High</option>
                      <option value="price:desc">Price: High to Low</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Mobile overlay to close when clicking outside */}
            {mobileFiltersOpen && (
              <button
                aria-hidden="true"
                className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-0 overflow-hidden shadow-soft">
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 shimmer" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2 shimmer" />
                      <div className="h-6 bg-muted rounded shimmer" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productsData && productsData.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productsData.map((product, index) => (
                    <Card key={product.id} className="group overflow-hidden border-0 shadow-soft hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-3 bg-white backdrop-blur-sm animate-scale-in hover:rotate-1" style={{ animationDelay: `${(index % 9) * 80}ms` }}>
                      <Link to={`/products/${product.id}`}>
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 relative">
                          {product.images?.[0] ? (
                            <>
                              <img
                                src={optimizeImageUrl(product.images[0], 400, 400)}
                                alt={product.name}
                                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
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
                              className="w-full rounded-full"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              disabled={product.stock === 0}
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Quick Add
                            </Button>
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-4">
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
                            {product.originalPrice && (
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

                {/* Infinite Scroll Trigger & Loading Indicator */}
                <div ref={observerTarget} className="flex justify-center py-12">
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-3 text-muted-foreground animate-fade-in">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary shadow-glow"></div>
                      <span className="text-lg font-medium">Loading more products...</span>
                    </div>
                  ) : hasNextPage ? (
                    <div className="text-base text-muted-foreground font-medium">Scroll for more ✨</div>
                  ) : (
                    <div className="text-base text-muted-foreground font-medium">
                      You've reached the end • <span className="text-primary font-bold">{totalProducts}</span> products total 🎉
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-24 animate-fade-in-up">
                <div className="inline-block p-6 rounded-full bg-muted/30 mb-6 animate-bounce-smooth">
                  <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-serif">No products found</h3>
                <p className="text-muted-foreground text-lg mb-8">Try adjusting your filters or browse all categories</p>
                <Button onClick={() => handleCategoryChange(null)} variant="outline" className="rounded-full hover:shadow-glow hover:scale-110 transition-all duration-300 px-8 py-6 text-base">
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
