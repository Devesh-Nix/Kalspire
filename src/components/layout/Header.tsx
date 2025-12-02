import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { APP_NAME, ROUTES } from '@/lib/constants';

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
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-2.5 text-center text-sm font-medium">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Free Shipping on Orders Over ₹1999 | Handcrafted with Love ❤️</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                K
              </div>
              <span className="text-2xl font-bold font-serif text-foreground group-hover:text-primary transition-colors hidden sm:inline">
                {APP_NAME}
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search handmade products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 rounded-full border-muted-foreground/20 focus:border-primary"
                />
              </form>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.WISHLIST} className="relative">
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link to={ROUTES.CART} className="relative">
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <div className="flex items-center space-x-2 ml-2">
                    <Link to={user?.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.PROFILE}>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full hidden sm:inline-flex">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Login
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button size="sm" className="rounded-full shadow-sm">Sign Up</Button>
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
