import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/utils/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";

export type ProductCardProps = { product: Product };

const getDiscountedPrice = (product: Product) =>
  product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

export default function ProductCard({ product }: ProductCardProps) {
  const { title, price, slug, images, stock, brand, rating, discount } = product;
  const image = images?.[0] ?? "/placeholder.png";
  const outOfStock = (stock ?? 0) <= 0;
  const finalPrice = getDiscountedPrice(product);

  return (
    <div className="relative border rounded-xl overflow-hidden bg-white hover:shadow-md transition flex flex-col">
      {/* BADGE */}
      {discount && !outOfStock && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          -{discount}%
        </span>
      )}

      {outOfStock && (
        <span className="absolute top-2 left-2 z-10 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Hết hàng
        </span>
      )}

      {/* CLICK CHỈ DÙNG CHO PHẦN XEM CHI TIẾT */}
      <Link href={`/shop/${slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            width={512}
            height={512}
            className={`w-full h-full object-cover transition ${
              outOfStock ? "opacity-50 grayscale" : "hover:scale-105"
            }`}
          />
        </div>

        <div className="p-3">
          {/* 👉 TÊN SP: ĐẬM + DỄ NHÌN */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* 👉 GIÁ */}
          {discount && !outOfStock ? (
            <p className="mt-1">
              <span className="line-through text-gray-500 text-sm">
                {formatVND(price)}
              </span>
              <span className="text-red-600 font-semibold ml-2">
                {formatVND(finalPrice)}
              </span>
            </p>
          ) : (
            <p className="mt-1 font-semibold text-gray-900">
              {formatVND(price)}
            </p>
          )}

          {/* 👉 BRAND + RATING */}
          <div className="mt-1 text-xs text-gray-600 flex items-center gap-2">
            {brand && <span>{brand}</span>}
            {typeof rating === "number" && <span>★ {rating}</span>}
          </div>
        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="p-3 pt-0 mt-auto">
        <AddToCartButton product={product} disabled={outOfStock} />
      </div>
    </div>
  );
}
