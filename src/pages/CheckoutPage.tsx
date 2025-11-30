import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { ordersApi } from '@/api/orders';
import { usersApi } from '@/api/users';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Address } from '@/types';

export function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: usersApi.getAddresses,
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Address>();

  const selectedAddress = addressesData?.addresses.find(a => a.id === selectedAddressId);

  const onSubmit = async (data: Address) => {
    setIsProcessing(true);
    
    try {
      let shippingAddress: Address;
      
      if (selectedAddressId && !useNewAddress) {
        shippingAddress = selectedAddress!;
      } else {
        shippingAddress = data;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      await ordersApi.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(ROUTES.ORDER_SUCCESS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate(ROUTES.CART);
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saved Addresses */}
            {addressesData?.addresses && addressesData.addresses.length > 0 && !useNewAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {addressesData.addresses.map((address) => (
                    <Card 
                      key={address.id}
                      className={`cursor-pointer transition-colors ${
                        selectedAddressId === address.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedAddressId(address.id!)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{address.fullName}</h4>
                          {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.phone}<br />
                          {address.addressLine1}
                          {address.addressLine2 && <><br />{address.addressLine2}</>}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setUseNewAddress(true)}
                  >
                    Use a different address
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* New Address Form */}
            {(useNewAddress || !addressesData?.addresses || addressesData.addresses.length === 0) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Shipping Information</CardTitle>
                  {addressesData?.addresses && addressesData.addresses.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setUseNewAddress(false);
                        setSelectedAddressId(addressesData.addresses[0].id!);
                      }}
                    >
                      Use saved address
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        {...register('fullName', { required: 'Full name is required' })}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="addressLine1" className="text-sm font-medium">
                      Address Line 1 *
                    </label>
                    <Input
                      id="addressLine1"
                      {...register('addressLine1', { required: 'Address is required' })}
                    />
                    {errors.addressLine1 && (
                      <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="addressLine2" className="text-sm font-medium">
                      Address Line 2
                    </label>
                    <Input id="addressLine2" {...register('addressLine2')} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        City *
                      </label>
                      <Input
                        id="city"
                        {...register('city', { required: 'City is required' })}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">
                        State *
                      </label>
                      <Input
                        id="state"
                        {...register('state', { required: 'State is required' })}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="pincode" className="text-sm font-medium">
                        Pincode *
                      </label>
                      <Input
                        id="pincode"
                        {...register('pincode', { 
                          required: 'Pincode is required',
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Invalid pincode'
                          }
                        })}
                      />
                      {errors.pincode && (
                        <p className="text-sm text-destructive">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || (!selectedAddressId && !useNewAddress)}
                  onClick={(e) => {
                    if (selectedAddressId && !useNewAddress) {
                      e.preventDefault();
                      onSubmit(selectedAddress!);
                    }
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
