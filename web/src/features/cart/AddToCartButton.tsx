"use client";

import { useState } from "react";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/utils/product";
import { productToCartItem } from "@/types/cart";

export default function AddToCartButton({
  product,
  disabled,
  fullWidth = true,
  className = "",
}: {
  product: Product;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const base =
    "h-10 text-sm rounded-md border flex items-center justify-center gap-2 transition";
  const width = fullWidth ? "w-full" : "px-4";

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (disabled) return;

    dispatch({
      type: "ADD",
      payload: productToCartItem(product, 1),
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleAdd}
      aria-disabled={disabled}
      className={`
        ${base} ${width} ${className}
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-600 text-white border-green-600"
            : "bg-black text-white hover:bg-gray-800"
        }
      `}
    >
      {added ? "✓ Đã thêm" : disabled ? "Hết hàng" : "Thêm vào giỏ"}
    </button>
  );
}
