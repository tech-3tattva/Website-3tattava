import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | 3tattava",
  description: "Wishlist page for saved 3tattava products.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
