import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/utils/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";

export type ProductCardProps = { product: Product };

// 👉 Hàm tính giá sau giảm (nếu có discount)
const getDiscountedPrice = (product: Product) => {
  return product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { title, price, slug, images, stock, brand, rating, discount } = product;
  const image = images?.[0] ?? "/placeholder.png";
  const outOfStock = (stock ?? 0) <= 0;
  const finalPrice = getDiscountedPrice(product);

  return (
    <div className="relative border rounded-xl overflow-hidden bg-white hover:shadow-sm transition">
      {/* 👇 Badge SALE khi có giảm giá */}
      {discount && !outOfStock && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
          -{discount}%
        </span>
      )}

      {/* 👇 Badge Hết hàng */}
      {outOfStock && (
        <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
          Hết hàng
        </span>
      )}

      <Link href={`/shop/${slug}`} className="block">
        {/* ✅ ĐÃ FIX phần ảnh */}
        <div className="aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={512}
            height={512}
            className={`w-full h-full object-cover transition ${
              outOfStock ? "opacity-50 grayscale" : ""
            }`} // 👈 Làm mờ & xám ảnh khi hết hàng
          />
        </div>

        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* 👇 Hiển thị giá: nếu có giảm giá thì hiện 2 giá */}
          {discount && !outOfStock ? (
            <p className="mt-1">
              <span className="line-through text-gray-400">
                {formatVND(price)}
              </span>
              <span className="text-red-600 font-semibold ml-2">
                {formatVND(finalPrice)}
              </span>
            </p>
          ) : (
            <p className="mt-1 font-semibold">{formatVND(price)}</p>
          )}

          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
            {brand && <span>{brand}</span>}
            {typeof rating === "number" && <span>★ {rating}</span>}
          </div>

          <AddToCartButton product={product} disabled={outOfStock} />
        </div>
      </Link>
    </div>
  );
}
