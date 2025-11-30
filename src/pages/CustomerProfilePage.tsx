import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MapPin, Package, Edit2, Plus, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/api/orders';
import { usersApi } from '@/api/users';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import type { Address } from '@/types';

export function CustomerProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { data: ordersData } = useQuery({
    queryKey: ['orders', 'customer'],
    queryFn: ordersApi.getMyOrders,
  });

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: usersApi.getAddresses,
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(data.message);
      setIsEditingProfile(false);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const addAddressMutation = useMutation({
    mutationFn: usersApi.addAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(data.message);
      setIsAddingAddress(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    },
    onError: () => toast.error('Failed to add address'),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: Partial<Address> }) =>
      usersApi.updateAddress(addressId, address),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(data.message);
    },
    onError: () => toast.error('Failed to update address'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: usersApi.deleteAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(data.message);
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    addAddressMutation.mutate(newAddress as Omit<Address, 'id'>);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'outline',
      cancelled: 'destructive',
    };
    return colors[status] || 'default';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingProfile ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <Badge>{user?.role}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingAddress(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddingAddress && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold">New Address</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Input 
                          placeholder="Full Name *" 
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        />
                        <Input 
                          placeholder="Phone *" 
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                        <Input 
                          placeholder="Address Line 1 *" 
                          className="col-span-2"
                          value={newAddress.addressLine1}
                          onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        />
                        <Input 
                          placeholder="Address Line 2" 
                          className="col-span-2"
                          value={newAddress.addressLine2}
                          onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        />
                        <Input 
                          placeholder="City *" 
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                        <Input 
                          placeholder="State *" 
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                        <Input 
                          placeholder="PIN Code *" 
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        />
                        <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleAddAddress} 
                          size="sm" 
                          disabled={addAddressMutation.isPending}
                        >
                          {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                        </Button>
                        <Button onClick={() => setIsAddingAddress(false)} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {addressesData?.addresses && addressesData.addresses.length > 0 ? (
                  addressesData.addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{address.fullName}</h4>
                          {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.phone}
                          <br />
                          {address.addressLine1}
                          {address.addressLine2 && <><br />{address.addressLine2}</>}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateAddressMutation.mutate({ 
                              addressId: address.id!, 
                              address: { isDefault: true } 
                            })}
                            disabled={address.isDefault}
                          >
                            {address.isDefault ? 'Default' : 'Set as Default'}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id!)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  !isAddingAddress && (
                    <p className="text-center text-muted-foreground py-4">
                      No saved addresses. Add one to get started!
                    </p>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersData?.orders && ordersData.orders.length > 0 ? (
                  <div className="space-y-4">
                    {ordersData.orders.map((order) => (
                      <Card key={order.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={getStatusColor(order.status)}>
                                {order.status.toUpperCase()}
                              </Badge>
                              <p className="font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex gap-3 text-sm">
                                <div className="h-12 w-12 bg-background rounded flex-shrink-0">
                                  {item.product?.images?.[0] && (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="h-full w-full object-cover rounded"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.product?.name}</p>
                                  <p className="text-muted-foreground">
                                    Qty: {item.quantity} × {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items && order.items.length > 2 && (
                              <p className="text-sm text-muted-foreground">
                                +{order.items.length - 2} more item(s)
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
