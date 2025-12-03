import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, FolderTree, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi } from '@/api/products';
import { ordersApi } from '@/api/orders';
import { categoriesApi } from '@/api/categories';

export function AdminDashboard() {
  const { data: productsData } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
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
        <h1 className="text-3xl sm:text-4xl font-bold font-serif">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Welcome to your admin panel. Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersData?.orders && ordersData.orders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {ordersData.orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm sm:text-base">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">₹{order.totalAmount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize">{order.status}</p>
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

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsData?.products ? (
              <div className="space-y-3 sm:space-y-4">
                {productsData.products
                  .filter(p => p.stock < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 mr-2">
                        <p className="font-medium text-sm sm:text-base line-clamp-1">{product.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
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
