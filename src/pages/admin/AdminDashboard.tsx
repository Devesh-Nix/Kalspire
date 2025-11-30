import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, FolderTree, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi } from '@/api/products';
import { ordersApi } from '@/api/orders';
import { categoriesApi } from '@/api/categories';

export function AdminDashboard() {
  const { data: productsData } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => ordersApi.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const stats = [
    {
      title: 'Total Products',
      value: productsData?.total || 0,
      icon: Package,
      description: 'Active products in store',
    },
    {
      title: 'Total Orders',
      value: ordersData?.total || 0,
      icon: ShoppingCart,
      description: 'Orders placed',
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: FolderTree,
      description: 'Product categories',
    },
    {
      title: 'Revenue',
      value: '₹0',
      icon: TrendingUp,
      description: 'Total sales',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin panel. Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersData?.orders && ordersData.orders.length > 0 ? (
              <div className="space-y-4">
                {ordersData.orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.totalAmount}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsData?.products ? (
              <div className="space-y-4">
                {productsData.products
                  .filter(p => p.stock < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} units
                        </p>
                      </div>
                    </div>
                  ))}
                {productsData.products.filter(p => p.stock < 10).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    All products are well-stocked
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No products yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
