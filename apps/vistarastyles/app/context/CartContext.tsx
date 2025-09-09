// contexts/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

// Guest cart item (without database IDs)
export interface GuestCartItem {
  productId: Id<"products">;
  size?: string;
  color?: string;
  quantity: number;
  priceSnapshot: number;
  productName: string;
  productImage: string;
  realPrice: number;
  showPrice: number;
}

export interface CartItem extends GuestCartItem {
  _id: Id<"cart_items">;
  cartId: Id<"carts">;
}

export interface Cart {
  _id: Id<"carts">;
  userId: Id<"users">;
  status: string;
  updatedAt: number;
  items?: CartItem[];
}

export interface CartContextType {
  cart: Cart | null;
  items: (CartItem | GuestCartItem)[];
  isLoading: boolean;
  currentUser: any;
  addToCart: (
    item: Omit<GuestCartItem, "productId"> & { productId: Id<"products"> }
  ) => Promise<boolean>;
  updateQuantity: (
    itemId: Id<"cart_items"> | string,
    quantity: number
  ) => Promise<void>;
  removeItem: (itemId: Id<"cart_items"> | string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  mergeGuestCart: () => Promise<void>;
  isUserAuthenticated: boolean;
  isGuestMode: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const GUEST_CART_KEY = "guest_cart_items";

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [guestCartItems, setGuestCartItems] = useState<GuestCartItem[]>([]);

  // Get user from Convex
  const currentUser = useQuery(
    api.users.getByAuthId,
    user?.id ? { authId: user.id } : "skip"
  );

  // Fetch authenticated user's cart
  const cartData = useQuery(
    api.cartFunc.getByUser,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Load guest cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGuestCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedGuestCart) {
        try {
          setGuestCartItems(JSON.parse(savedGuestCart));
        } catch (error) {
          console.error("Error parsing guest cart:", error);
          localStorage.removeItem(GUEST_CART_KEY);
        }
      }
    }
  }, []);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCartItems));
    }
  }, [guestCartItems]);

  // Mutations
  const createUserMutation = useMutation(api.users.createOrUpdateUser);
  const createCartMutation = useMutation(api.cartFunc.createCart);
  const addOrUpdateItemMutation = useMutation(api.cartFunc.addOrUpdateCartItem);
  const updateQuantityMutation = useMutation(api.cartFunc.updateCartItemQty);
  const removeItemMutation = useMutation(api.cartFunc.removeCartItem);
  const clearCartMutation = useMutation(api.cartFunc.clearCart);
  const mergeGuestCartMutation = useMutation(api.cartFunc.mergeGuestCart);

  // Create user if doesn't exist
  useEffect(() => {
    if (user && isLoaded && currentUser === null && user.id) {
      createUserMutation({
        authId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || undefined,
        image: user.imageUrl || undefined,
      }).catch(console.error);
    }
  }, [user, isLoaded, currentUser, createUserMutation]);

  // Auto-merge guest cart when user logs in
  useEffect(() => {
    if (currentUser && guestCartItems.length > 0) {
      mergeGuestCart();
    }
  }, [currentUser]);

  const isUserAuthenticated = Boolean(user && currentUser);
  const isGuestMode = !isUserAuthenticated;

  // Get the appropriate cart items
  const cart = cartData || null;
  const items: (CartItem | GuestCartItem)[] = isUserAuthenticated
    ? cart?.items || []
    : guestCartItems;

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.priceSnapshot * item.quantity,
    0
  );

  // Generate unique ID for guest items
  const generateGuestItemId = (item: GuestCartItem): string => {
    return `guest_${item.productId}_${item.size || "nosize"}_${item.color || "nocolor"}`;
  };

  // Helper function to check if itemId is for guest cart
  const isGuestItemId = (itemId: string): boolean => {
    return itemId.startsWith("guest_");
  };

  // Create cart if user exists but no cart
  const ensureCart = async (): Promise<Id<"carts">> => {
    if (!currentUser?._id) {
      throw new Error("User not authenticated");
    }

    if (cart?._id) {
      return cart._id;
    }

    const now = Date.now();
    const cartId = await createCartMutation({
      userId: currentUser._id,
      status: "active",
      updatedAt: now,
    });

    return cartId;
  };

  // Add item to cart (works for both guest and authenticated users)
  const addToCart = async (
    item: Omit<GuestCartItem, "productId"> & { productId: Id<"products"> }
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const newItem: GuestCartItem = {
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        productName: item.productName,
        productImage: item.productImage,
        realPrice: item.realPrice,
        showPrice: item.showPrice,
      };

      if (isUserAuthenticated && currentUser) {
        // Add to database for authenticated users
        const cartId = await ensureCart();
        await addOrUpdateItemMutation({
          cartId,
          ...newItem,
        });
      } else {
        // Add to guest cart (localStorage)
        setGuestCartItems((prevItems) => {
          const existingIndex = prevItems.findIndex(
            (existing) =>
              existing.productId === newItem.productId &&
              existing.size === newItem.size &&
              existing.color === newItem.color
          );

          if (existingIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...prevItems];
            updatedItems[existingIndex].quantity += newItem.quantity;
            return updatedItems;
          } else {
            // Add new item
            return [...prevItems, newItem];
          }
        });
      }

      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity (works for both guest and authenticated users)
  const updateQuantity = async (
    itemId: Id<"cart_items"> | string,
    quantity: number
  ) => {
    setIsLoading(true);
    try {
      // FIXED: Check if itemId starts with "guest_" instead of checking typeof
      if (isGuestItemId(itemId as string)) {
        // Guest mode: update localStorage
        setGuestCartItems((prev) =>
          prev
            .map((item) => {
              const guestId = generateGuestItemId(item);
              return guestId === itemId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item;
            })
            .filter((item) => item.quantity > 0)
        );
      } else {
        // Authenticated user: call DB mutation with proper type casting
        await updateQuantityMutation({
          cartItemId: itemId as Id<"cart_items">,
          quantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: Id<"cart_items"> | string) => {
    setIsLoading(true);
    try {
      // FIXED: Check if itemId starts with "guest_" instead of checking typeof
      if (isGuestItemId(itemId as string)) {
        // Guest mode
        setGuestCartItems((prev) =>
          prev.filter((item) => generateGuestItemId(item) !== itemId)
        );
      } else {
        // Authenticated user with proper type casting
        await removeItemMutation({ cartItemId: itemId as Id<"cart_items"> });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);

    try {
      if (isUserAuthenticated && cart?._id) {
        await clearCartMutation({
          cartId: cart._id,
        });
      } else {
        // Clear guest cart
        setGuestCartItems([]);
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Merge guest cart when user logs in
  const mergeGuestCart = async () => {
    if (!currentUser?._id || guestCartItems.length === 0) return;

    setIsLoading(true);
    try {
      await mergeGuestCartMutation({
        userId: currentUser._id,
        guestItems: guestCartItems,
      });

      // Clear guest cart after successful merge
      setGuestCartItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error("Error merging guest cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: CartContextType = {
    cart,
    items,
    isLoading,
    currentUser,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    mergeGuestCart,
    isUserAuthenticated,
    isGuestMode,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
