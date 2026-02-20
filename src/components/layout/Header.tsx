import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import kalspireMark from '@/assets/kalspire-mark.svg';
import kalspireLogo from '@/assets/kalspire-logo.svg';
import { ShoppingCart, Heart, User, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ROUTES } from '@/lib/constants';

export function Header() {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  // Sync search input with URL parameter
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Clear search results by navigating to products page without search param
      navigate(ROUTES.PRODUCTS);
    }
  };

  return (
    <>
      {/* Announcement Bar - Enhanced with Animation */}
      <div className="gradient-animate text-primary-foreground py-3 text-center text-sm font-medium overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 relative z-10">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="font-semibold">Free Shipping on Orders Over ₹1999 | Handcrafted with Love ❤️</span>
        </div>
      </div>

      {/* Main Header - Glassmorphism Enhanced */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo - Enhanced with Hover Effect */}
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 group flex-shrink-0">
              {/* Show emblem on mobile only */}
              <div className="relative">
                <img
                  src={kalspireMark}
                  alt="Kalspire"
                  className="h-11 w-11 rounded-xl shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 sm:hidden"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden"></div>
              </div>
              {/* Show wordmark on tablet/desktop */}
              <div className="relative hidden sm:block">
                <img
                  src={kalspireLogo}
                  alt="Kalspire Artisan Crochet & Resin"
                  className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Search Bar - Desktop - Enhanced */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  type="search"
                  placeholder="Search handmade products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-11 rounded-full border-border/50 focus:border-primary/50 glass hover:shadow-soft focus:shadow-glow transition-all duration-300"
                  aria-label="Search products"
                />
              </form>
            </div>

            {/* Search Bar - Mobile - Enhanced */}
            <div className="md:hidden flex-1 mx-2">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 h-10 rounded-full border-border/50 focus:border-primary/50 text-sm glass hover:shadow-soft focus:shadow-glow transition-all duration-300"
                  aria-label="Search products"
                />
              </form>
            </div>

            {/* Navigation - Enhanced with Animations */}
            <nav className="flex items-center space-x-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.WISHLIST} className="relative group" aria-label="View Wishlist">
                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300" aria-label={`Wishlist with ${wishlistCount} items`}>
                      <Heart className="h-5 w-5 group-hover:fill-primary group-hover:text-primary transition-all duration-300" />
                      {wishlistCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary animate-pulse shadow-glow">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link to={ROUTES.CART} className="relative group" aria-label="View Shopping Cart">
                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300" aria-label={`Shopping cart with ${totalItems} items`}>
                      <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary animate-pulse shadow-glow">
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <div className="flex items-center space-x-2 ml-2">
                    <Link to={user?.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.PROFILE} aria-label="View Profile">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300" aria-label="Profile">
                        <User className="h-5 w-5 hover:text-primary transition-colors duration-300" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="rounded-full hidden sm:inline-flex hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300 hover:scale-105"
                      aria-label="Logout"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105" aria-label="Login">
                      Login
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button size="sm" className="rounded-full shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105" aria-label="Sign Up">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
