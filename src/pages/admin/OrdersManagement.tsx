import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Package, ChevronDown, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/api/orders';
import type { Order } from '@/types';
import { toast } from 'sonner';

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrdersManagement() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => ordersApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      ordersApi.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const orders = ordersData?.orders || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{orders.length}</span>
          <span className="text-muted-foreground">Total Orders</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <>
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {typeof order.userId === 'object' && order.userId !== null
                                ? (order.userId as any).name
                                : order.user?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {typeof order.userId === 'object' && order.userId !== null
                                ? (order.userId as any).email
                                : order.user?.email || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order['status'])
                            }
                            className="px-3 py-1 rounded-md border bg-background capitalize text-sm"
                            disabled={updateStatusMutation.isPending}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.paymentStatus === 'completed'
                                ? 'default'
                                : order.paymentStatus === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="capitalize"
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                            <p className="text-muted-foreground">
                              {format(new Date(order.createdAt), 'hh:mm a')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                            <ChevronDown
                              className={`h-4 w-4 ml-1 transition-transform ${
                                expandedOrder === order.id ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/50">
                            <div className="p-4 space-y-4">
                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item, index) => {
                                    const product =
                                      typeof item.productId === 'object' && item.productId !== null
                                        ? (item.productId as any)
                                        : item.product;
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-background rounded-lg"
                                      >
                                        <div className="flex items-center gap-3">
                                          {product?.images?.[0] && (
                                            <img
                                              src={product.images[0]}
                                              alt={product.name || 'Product'}
                                              className="h-12 w-12 object-cover rounded"
                                            />
                                          )}
                                          <div>
                                            <p className="font-medium">
                                              {product?.name || 'Product'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Quantity: {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-semibold">
                                          ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div>
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <div className="p-3 bg-background rounded-lg">
                                  <p className="font-medium">
                                    {order.shippingAddress.fullName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.phone}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {order.shippingAddress.addressLine1}
                                    {order.shippingAddress.addressLine2 &&
                                      `, ${order.shippingAddress.addressLine2}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    - {order.shippingAddress.pincode}
                                  </p>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Summary</h4>
                                <div className="p-3 bg-background rounded-lg space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                  </div>
                                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                                    <span>Total:</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
