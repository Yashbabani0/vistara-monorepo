// app/account/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Address from "./_components/Address";
import Orders from "./_components/Orders";

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-sm border p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="relative z-10 flex items-center space-x-6">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10">
              <AvatarImage
                src={user?.imageUrl || ""}
                alt={user?.fullName || ""}
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                {user?.firstName?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName ?? "User"}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your orders and account settings
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white h-14 p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="orders"
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg"
            >
              <Package size={20} />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg"
            >
              <MapPin size={20} />
              <span>Addresses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Orders />
          </TabsContent>
          <TabsContent value="addresses" className="space-y-6">
            <Address />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
