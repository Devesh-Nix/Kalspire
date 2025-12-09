import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Gift, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, convertGoogleDriveUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 mx-auto">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-3 font-serif">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Discover our handcrafted treasures and start shopping!
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" className="gap-2 rounded-full px-8 shadow-md">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 1999 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-muted/20 to-white min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 font-serif">Shopping Cart</h1>
          <p className="text-muted-foreground mb-8 text-lg">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.productId} className="border-0 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Link to={`/products/${item.product.id}`} className="shrink-0">
                        <div className="h-28 w-28 overflow-hidden rounded-lg bg-muted/30 group">
                          {item.product.images?.[0] ? (
                            <img
                              src={convertGoogleDriveUrl(item.product.images[0])}
                              alt={item.product.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link
                                to={`/products/${item.product.id}`}
                                className="font-semibold hover:text-primary transition-colors text-lg"
                              >
                                {item.product.name}
                              </Link>
                              <Badge className="mt-2 bg-secondary text-secondary-foreground border-0">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Handmade
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.productId, item.selectedColor?.id)}
                              className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {formatCurrency(item.product.price)} each
                          </p>
                          {item.selectedColor && (
                            <div className="mt-3 flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.selectedColor.hexCode }}
                                title={item.selectedColor.hexCode}
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                {item.selectedColor.name}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border-2 border-border rounded-full overflow-hidden">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-none px-4 hover:bg-muted"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor?.id)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </Button>
                            <span className="px-5 py-2 min-w-[3rem] text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-none px-4 hover:bg-muted"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor?.id)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </Button>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-xl text-primary">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24 border-0 shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold">{formatCurrency(shipping)}</span>
                    )}
                  </div>
                  {subtotal < 1999 && (
                    <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
                      Add {formatCurrency(1999 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="text-2xl font-bold text-primary font-serif">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Gift Wrapping Available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Link to={ROUTES.CHECKOUT} className="w-full">
                    <Button className="w-full rounded-full shadow-md hover:shadow-lg" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link to={ROUTES.PRODUCTS} className="w-full">
                    <Button variant="outline" className="w-full rounded-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
