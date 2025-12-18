import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = { title: "Shop — Shoply" };

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "/shop";

  const isDetail =
    pathname.startsWith("/shop/") && pathname.split("/").length > 2;

  const isSearch = pathname === "/shop" && pathname.includes("?");

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">🛍 Shop</h1>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 flex items-center gap-1">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
            {isDetail && (
              <>
                <span>/</span>
                <span className="text-gray-700 font-medium">Chi tiết</span>
              </>
            )}
          </nav>
        </div>

        {/* Content */}
        {isDetail ? (
          children
        ) : (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            {children}
          </div>
        )}
      </div>
    </main>
  );
}
