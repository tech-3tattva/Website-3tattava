import Link from "next/link";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/admin/inventory" className="text-sm text-primary-green hover:underline">
          ← Back to inventory
        </Link>
        <h1 className="font-display text-4xl text-text-dark mt-2">Add product</h1>
        <p className="text-sm text-text-medium mt-1">
          New products appear on the shop as soon as you save (if marked active).
        </p>
      </div>
      <AdminProductForm />
    </div>
  );
}
