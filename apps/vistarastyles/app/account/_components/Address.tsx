"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Edit, Home, MapPin, Phone, Plus, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";

export default function Address() {
  const { user } = useUser();

  const addresses = useQuery(api.addresses.getAddresses, {
    authId: user?.id || "",
  });
  const addAddress = useMutation(api.addresses.addAddress);
  const deleteAddress = useMutation(api.addresses.deleteAddress);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    line3: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleAddAddress = async () => {
    if (!user) return;

    setIsAddingAddress(true);
    try {
      await addAddress({
        authId: user.id,
        ...newAddress,
      });
      setNewAddress({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        line3: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsAddingAddress(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-0 bg-white rounded-xl">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                Saved Addresses
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Manage your shipping and billing addresses
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="gap-2 px-6"
            >
              <Plus size={18} />
              Add New Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses === undefined ? (
            <div className="text-center py-12">
              <div className="animate-pulse grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 h-40 rounded-xl"></div>
                ))}
              </div>
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {addresses.map((addr: any) => (
                <Card
                  key={addr._id}
                  className="border-2 hover:border-primary/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-xl relative overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                          <Home className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {addr.fullName}
                          </h4>
                          {addr.isDefault && (
                            <Badge className="text-xs mt-1 bg-gradient-to-r from-primary to-primary/80">
                              <Star className="h-3 w-3 mr-1" />
                              Default Address
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-primary hover:bg-primary/10"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAddress({ addressId: addr._id })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="font-semibold text-gray-900">
                        {addr.line1}
                      </p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      {addr.line3 && <p>{addr.line3}</p>}
                      {addr.landmark && (
                        <p className="text-gray-500 italic">
                          Near {addr.landmark}
                        </p>
                      )}
                      <p className="font-semibold text-gray-900 text-base">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">{addr.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-16 w-16 text-primary/60" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No addresses saved
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add your first address to make checkout faster and delivery
                seamless
              </p>
              <Button
                onClick={() => setShowAddressForm(true)}
                className="px-8 py-3 text-base"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Address
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Add New Address Form */}
      {showAddressForm && (
        <Card className="shadow-lg border-0 bg-white rounded-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              Add New Address
            </CardTitle>
            <CardDescription>
              Fill in the details for your new address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-700"
                >
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="line1"
                className="text-sm font-semibold text-gray-700"
              >
                Address Line 1 *
              </Label>
              <Input
                id="line1"
                value={newAddress.line1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, line1: e.target.value })
                }
                placeholder="House/Flat/Office No., Building Name"
                className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="line2"
                  className="text-sm font-semibold text-gray-700"
                >
                  Address Line 2
                </Label>
                <Input
                  id="line2"
                  value={newAddress.line2}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      line2: e.target.value,
                    })
                  }
                  placeholder="Street, Area"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="landmark"
                  className="text-sm font-semibold text-gray-700"
                >
                  Landmark
                </Label>
                <Input
                  id="landmark"
                  value={newAddress.landmark}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      landmark: e.target.value,
                    })
                  }
                  placeholder="Near landmark"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <Label
                  htmlFor="city"
                  className="text-sm font-semibold text-gray-700"
                >
                  City *
                </Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  placeholder="Enter city"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="state"
                  className="text-sm font-semibold text-gray-700"
                >
                  State *
                </Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      state: e.target.value,
                    })
                  }
                  placeholder="Enter state"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="pincode"
                  className="text-sm font-semibold text-gray-700"
                >
                  PIN Code *
                </Label>
                <Input
                  id="pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      pincode: e.target.value,
                    })
                  }
                  placeholder="Enter PIN code"
                  className="h-12 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Checkbox
                id="isDefault"
                checked={newAddress.isDefault}
                onCheckedChange={(checked) =>
                  setNewAddress({
                    ...newAddress,
                    isDefault: Boolean(checked),
                  })
                }
              />
              <Label
                htmlFor="isDefault"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Set as default address for faster checkout
              </Label>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleAddAddress}
                disabled={isAddingAddress}
                className="flex-1 h-12 text-base"
              >
                {isAddingAddress ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving Address...
                  </>
                ) : (
                  "Save Address"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddressForm(false)}
                className="flex-1 h-12 text-base"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
