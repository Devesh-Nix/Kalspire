import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, ArrowLeft, Star, Sparkles, Package, Shield, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { productsApi } from '@/api/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency, convertGoogleDriveUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';
import type { ColorVariant } from '@/types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;

    if (product.colorVariants && product.colorVariants.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addItem(product, quantity, selectedColor || undefined);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to={ROUTES.PRODUCTS}>
            <Button>Back to Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-muted/20 to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Products</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Sticky Image Gallery */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <Card className="overflow-hidden border-0 shadow-soft bg-white">
                <div className="aspect-square bg-muted/20 relative group overflow-hidden rounded-2xl">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={convertGoogleDriveUrl(images[selectedImage])}
                        alt={product.name}
                        className="h-full w-full object-cover cursor-zoom-in transition-all duration-700 group-hover:scale-110 animate-fade-in"
                        onError={(e) => {
                          console.error('Image failed to load:', images[selectedImage]);
                          e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
                        }}
                      />
                      {/* Handmade Badge */}
                      <Badge className="absolute top-4 left-4 glass border-0 shadow-glow animate-bounce-smooth">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Handmade
                      </Badge>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingCart className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                        ? 'border-primary shadow-md scale-105'
                        : 'border-transparent hover:border-muted-foreground/30'
                        }`}
                    >
                      <img
                        src={convertGoogleDriveUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('Thumbnail failed to load:', image);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-4xl font-bold font-serif leading-tight">{product.name}</h1>
                  <Button
                    variant={isWishlisted ? "default" : "outline"}
                    size="icon"
                    onClick={handleToggleWishlist}
                    className="shrink-0 rounded-full h-11 w-11"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(24 reviews)</span>
                </div>

                {product.category && (
                  <Link to={`${ROUTES.PRODUCTS}?category=${product.categoryId}`}>
                    <Badge variant="secondary" className="mb-4 hover:bg-secondary/80 transition-colors">
                      {product.category.name}
                    </Badge>
                  </Link>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-border">
                <span className="text-5xl font-bold text-primary font-serif">{formatCurrency(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="text-sm px-3 py-1">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex flex-wrap gap-3">
                {product.stock === 0 ? (
                  <Badge variant="destructive" className="text-base px-6 py-2.5 rounded-full shadow-soft animate-pulse">Out of Stock</Badge>
                ) : product.stock < 10 ? (
                  <Badge variant="secondary" className="text-base px-6 py-2.5 rounded-full bg-pink/20 text-primary border-pink/30 shadow-soft animate-bounce-smooth">
                    Only {product.stock} left in stock - Order soon!
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-base px-6 py-2.5 rounded-full bg-mint/30 text-accent border-mint/50 shadow-soft">
                    <Package className="h-4 w-4 mr-2" />
                    In Stock & Ready to Ship
                  </Badge>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-muted/30 to-white">
                <CardContent className="p-6 space-y-5">
                  {/* Color Selector */}
                  {product.colorVariants && product.colorVariants.length > 0 && (
                    <div>
                      <label className="font-semibold text-lg mb-3 block">Choose Color:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {product.colorVariants.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => color.stock > 0 && setSelectedColor(color)}
                            disabled={color.stock === 0}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${selectedColor?.id === color.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-200 hover:border-primary'
                              } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div
                              className="h-6 w-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color.hexCode }}
                              title={color.hexCode}
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium">{color.name}</p>
                              {color.stock === 0 && <p className="text-xs text-destructive">Out of Stock</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-lg">Quantity:</label>
                    <div className="flex items-center border-2 border-border rounded-full overflow-hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none px-4 hover:bg-muted"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={product.stock === 0}
                      >
                        −
                      </Button>
                      <span className="px-6 py-2 min-w-[4rem] text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-none px-4 hover:bg-muted"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={product.stock === 0}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2 text-base h-12 rounded-full shadow-md hover:shadow-lg"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || !product.isAvailable}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">100% Secure Payments</p>
                      <p className="text-sm text-muted-foreground">Safe and encrypted transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Free Shipping on orders over ₹1999</p>
                      <p className="text-sm text-muted-foreground">Delivered within 5-7 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    {/* <div>
                      <p className="font-medium">Easy Returns within 7 days</p>
                      <p className="text-sm text-muted-foreground">Hassle-free return policy</p>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {/* Description */}
                <Card className="border-0 shadow-sm bg-white overflow-hidden">
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="font-semibold text-lg font-serif">Description</h3>
                    {expandedSection === 'description' ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSection === 'description' && (
                    <CardContent className="px-5 pb-5">
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </CardContent>
                  )}
                </Card>

                {/* Materials & Care */}
                <Card className="border-0 shadow-sm bg-white overflow-hidden">
                  <button
                    onClick={() => toggleSection('materials')}
                    className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="font-semibold text-lg font-serif">Materials & Care</h3>
                    {expandedSection === 'materials' ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSection === 'materials' && (
                    <CardContent className="px-5 pb-5 space-y-3">
                      <div>
                        <p className="font-medium mb-2">Materials:</p>
                        <p className="text-muted-foreground">Premium quality crochet yarn, soft and durable</p>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Care Instructions:</p>
                        <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Hand wash with mild detergent</li>
                          <li>Dry flat in shade</li>
                          <li>Do not wring or twist</li>
                          <li>Store in a cool, dry place</li>
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Artisan Story */}
                <Card className="border-0 shadow-sm bg-white overflow-hidden">
                  <button
                    onClick={() => toggleSection('artisan')}
                    className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="font-semibold text-lg font-serif">Artisan Story</h3>
                    {expandedSection === 'artisan' ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSection === 'artisan' && (
                    <CardContent className="px-5 pb-5">
                      <p className="text-muted-foreground leading-relaxed">
                        Each piece is lovingly handcrafted by skilled artisans who pour their creativity and
                        passion into every stitch. Your purchase supports local craftsmanship and helps keep
                        traditional handmade art alive.
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg font-serif mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
