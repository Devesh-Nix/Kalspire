import { Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

export function OrderSuccessPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 justify-center">
                <Package className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Your order is being processed</p>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when your order is shipped
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.PROFILE}>
              <Button size="lg" variant="outline">
                View Order History
              </Button>
            </Link>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
