import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/mock/products";

export default function ShopPage() {
  const items = PRODUCTS;

  if (items.length === 0) {
    return (
      <main className="py-8">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-gray-600 mt-2">Chưa có sản phẩm.</p>
      </main>
    );
  }

  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold">Shop</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}

