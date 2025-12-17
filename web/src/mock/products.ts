import type { Product } from "@/utils/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

export const PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    _id: `p${n}`,
    title: `Sản phẩm #${n}`,
    slug: `san-pham-${n}`,
    price: 99000 + n * 1000000,
    images: [`/images/sp${n}.jpg`],
    stock: n % 7 === 0 ? 0 : ((n * 3) % 21) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [{ color: COLORS[n % COLORS.length], size: SIZES[n % SIZES.length] }],
    description: "Mô tả ngắn cho sản phẩm.",
    category: n % 2 ? "fashion" : "accessories",  
    discount: n === 6 ? 25 : undefined,
  } satisfies Product;
});