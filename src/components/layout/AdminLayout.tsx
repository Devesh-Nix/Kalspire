import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { APP_NAME, ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { name: 'Products', href: ROUTES.ADMIN.PRODUCTS, icon: Package },
  { name: 'Categories', href: ROUTES.ADMIN.CATEGORIES, icon: FolderTree },
  { name: 'Orders', href: ROUTES.ADMIN.ORDERS, icon: ShoppingCart },
];

export function AdminLayout() {
  const location = useLocation();
  const { clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = ROUTES.LOGIN;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(target) &&
        menuButton &&
        !menuButton.contains(target)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          K
        </div>
        <div>
          <p className="text-sm font-semibold">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href} onClick={closeMobileMenu}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn('w-full justify-start gap-2', isActive && 'bg-primary')}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t p-4 space-y-2">
        <Link to={ROUTES.HOME} onClick={closeMobileMenu}>
          <Button variant="outline" className="w-full">
            View Store
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobileMenu} />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 border-r bg-muted/40">
        <div className="flex h-full flex-col w-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <aside
        id="mobile-sidebar"
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-40 w-64 border-r bg-background shadow-xl transform transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-6 pt-20 lg:pt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
