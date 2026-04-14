import Link from "next/link";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/admin/inventory" className="text-sm text-primary-green hover:underline">
          ← Back to inventory
        </Link>
        <h1 className="font-display text-4xl text-text-dark mt-2">Edit product</h1>
        <p className="text-sm text-text-medium mt-1">Upload more images to append to the gallery.</p>
      </div>
      <AdminProductForm productId={params.id} />
    </div>
  );
}
