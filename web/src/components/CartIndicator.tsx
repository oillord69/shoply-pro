"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/cn";

export default function CartIndicator() {
  const pathname = usePathname();
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  const active = pathname === "/cart";

  return (
    <Link
      href="/cart"
      className={cn(
        "relative px-2 py-1 text-sm transition",
        active
          ? "text-white font-semibold border-b border-white"
          : "text-gray-300 hover:text-white"
      )}
    >
      Giỏ hàng
      {count > 0 && (
        <span className="ml-1 text-xs text-gray-400">({count})</span>
      )}
    </Link>
  );
}
