"use client";

import OfflineBanner from "@/components/layout/OfflineBanner";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/providers/CustomCursor";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { DeliveryPincodeProvider } from "@/context/DeliveryPincodeContext";
import { WaitlistProvider } from "@/context/WaitlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DeliveryPincodeProvider>
        <WishlistProvider>
          <CartProvider>
            <SmoothScrollProvider>
              <WaitlistProvider>{children}</WaitlistProvider>
              <OfflineBanner />
              <CustomCursor />
            </SmoothScrollProvider>
          </CartProvider>
        </WishlistProvider>
      </DeliveryPincodeProvider>
    </AuthProvider>
  );
}
