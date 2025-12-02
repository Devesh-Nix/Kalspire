import { APP_NAME } from '@/lib/constants';
import { Instagram, Facebook, Mail, Heart, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-white to-muted/20">
      {/* Newsletter Section */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2 font-serif">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive offers and new arrivals
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-full"
              />
              <Button className="rounded-full px-6 shadow-md">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <h3 className="mb-4 text-xl font-bold font-serif flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              {APP_NAME}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Handcrafted crochet and resin products made with love. 
              Each piece is unique and tells its own story.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="/products?category=crochet" className="hover:text-primary transition-colors">
                  Crochet Collection
                </a>
              </li>
              <li>
                <a href="/products?category=resin" className="hover:text-primary transition-colors">
                  Resin Products (Coming Soon)
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">About</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">100% Handmade</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-secondary-foreground" />
              </div>
              <p className="text-sm font-medium">Free Shipping Over ₹1999</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm font-medium">Secure Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Made with ❤️</p>
            <p className="text-xs">Handcrafted Crochet & Resin Artisan Marketplace</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
