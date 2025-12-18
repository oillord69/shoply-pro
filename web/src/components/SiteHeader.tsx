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

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

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
        "px-2 py-1 text-sm transition",
        pathname === href
          ? "text-white font-semibold border-b border-white"
          : "text-gray-300 hover:text-white"
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-4 text-white">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-wide">
          Shoply
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-4 ml-auto">
          <Nav href="/">Shop</Nav>
          <CartIndicator />
          <Nav href="/admin">Admin</Nav>
          <Nav href="/login">Login</Nav>
          <Nav href="/register">Register</Nav>
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 ml-4"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-9 px-3 rounded-md bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white"
            aria-label="Tìm kiếm sản phẩm"
          />
          <button
            type="submit"
            className="h-9 px-3 rounded-md bg-white text-black text-sm hover:bg-gray-200 transition"
          >
            Tìm
          </button>
        </form>
      </div>
    </header>
  );
}
