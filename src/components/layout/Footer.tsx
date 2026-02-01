import { APP_NAME } from '@/lib/constants';
import { Instagram, Facebook, Mail, Heart, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-white via-muted/10 to-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section - Enhanced */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 relative">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="inline-block p-4 rounded-full bg-primary/10 mb-6 animate-bounce-smooth">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-3 font-serif">Stay Updated</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Subscribe to our newsletter for exclusive offers and new arrivals
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-full h-12 glass backdrop-blur-sm hover:shadow-soft focus:shadow-glow transition-all duration-300"
              />
              <Button className="rounded-full px-8 shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Enhanced */}
      <div className="container mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand Section - Enhanced */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-6 text-2xl font-bold font-serif flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-primary fill-primary group-hover:scale-110 transition-transform" />
              {APP_NAME}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Handcrafted crochet and resin products made with love. 
              Each piece is unique and tells its own story.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/_kalspire_/" target="_blank" rel="noreferrer">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-glow transition-all duration-300">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-glow transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-glow transition-all duration-300">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/products" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  All Products
                </a>
              </li>
              <li>
                <a href="/products?category=crochet" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Crochet Collection
                </a>
              </li>
              <li>
                <a href="/products?category=resin" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Resin Products (Coming Soon)
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="mb-6 text-base font-bold uppercase tracking-wider">About</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          </div>

        {/* Trust Badges - Enhanced */}
        <div className="mt-16 pt-12 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3 group">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <Heart className="h-8 w-8 text-primary group-hover:fill-primary transition-all duration-300" />
              </div>
              <p className="text-base font-bold group-hover:text-primary transition-colors">100% Handmade</p>
              <p className="text-xs text-muted-foreground">Crafted with care</p>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary/40 to-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <Truck className="h-8 w-8 text-secondary-foreground transition-all duration-300" />
              </div>
              <p className="text-base font-bold group-hover:text-primary transition-colors">Free Shipping</p>
              <p className="text-xs text-muted-foreground">Orders over ₹1999</p>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <Shield className="h-8 w-8 text-accent transition-all duration-300" />
              </div>
              <p className="text-base font-bold group-hover:text-primary transition-colors">Secure Payments</p>
              <p className="text-xs text-muted-foreground">100% Protected</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className="border-t glass backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Made with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" />
            </p>
            <p className="text-xs font-medium">Handcrafted Crochet & Resin Artisan Marketplace ✨</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
