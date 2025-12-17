"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import CartIndicator from "@/components/CartIndicator";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [q, setQ] = useState(qParam);

  // Cập nhật input khi thay đổi query param
  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  // Điều hướng đến /shop?q=...
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const keyword = q.trim();
    if (keyword) {
      router.push(`/shop?q=${encodeURIComponent(keyword)}`);
    } else {
      router.push(`/shop`);
    }
  }

  const Nav = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg hover:underline",
        pathname === href && "font-semibold underline"
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="font-bold">
          Shoply
        </Link>

        {/* Menu chính */}
        <nav className="flex gap-2 ml-auto">
          <Nav href="/shop">Shop</Nav>
          <CartIndicator />
          <Nav href="/admin">Admin</Nav>
          <Nav href="/login">Login</Nav>
          <Nav href="/register">Register</Nav>
        </nav>

        {/* Thanh tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 ml-4"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder=" Tìm sản phẩm..."
            className="h-9 px-3 rounded-md border text-sm w-48 focus:outline-none focus:ring focus:ring-gray-300"
            aria-label="Tìm kiếm sản phẩm"
          />
          <button
            type="submit"
            className="h-9 px-3 rounded-md border bg-gray-100 hover:bg-gray-200 text-sm transition"
          >
            Tìm
          </button>
        </form>
      </div>
    </header>
  );
}
