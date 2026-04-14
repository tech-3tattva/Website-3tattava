"use client";

import OfflineBanner from "@/components/layout/OfflineBanner";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { DeliveryPincodeProvider } from "@/context/DeliveryPincodeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DeliveryPincodeProvider>
        <WishlistProvider>
          <CartProvider>
            <SmoothScrollProvider>
              {children}
              <OfflineBanner />
            </SmoothScrollProvider>
          </CartProvider>
        </WishlistProvider>
      </DeliveryPincodeProvider>
    </AuthProvider>
  );
}
