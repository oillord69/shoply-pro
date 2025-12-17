// src/utils/price.ts
import type { Product } from "@/utils/product";

export const getDiscountedPrice = (product: Product): number => {
  return product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
};
