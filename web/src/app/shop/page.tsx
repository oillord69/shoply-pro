"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const qParam = searchParams.get("q") || "";

  const [qInput, setQInput] = useState(qParam);
  useEffect(() => setQInput(qParam), [qParam]);

  const queryArgs = useMemo(
    () => ({ page: pageParam, limit: LIMIT, q: qParam || undefined }),
    [pageParam, qParam]
  );
  const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

  function setUrl(next: { page?: number; q?: string | null }) {
    const sp = new URLSearchParams(searchParams.toString());
    if (typeof next.page === "number") sp.set("page", String(next.page));
    if (next.q !== undefined) {
      if (next.q && next.q.trim()) {
        sp.set("q", next.q.trim());
        sp.set("page", "1");
      } else {
        sp.delete("q");
        sp.set("page", "1");
      }
    }
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <main className="py-8 px-4 bg-black text-white min-h-screen">
      {/* ✅ Tiêu đề + thanh tìm kiếm ngang hàng */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Shop</h1>
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">

        <form
          className="flex gap-2 mt-3 md:mt-0"
          onSubmit={(e) => {
            e.preventDefault();
            setUrl({ q: qInput });
          }}
        >
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="🔍 Tìm sản phẩm..."
            className="h-10 px-3 rounded-md border border-gray-600 bg-transparent text-sm text-white placeholder-gray-400 w-full md:w-72 focus:outline-none focus:border-white"
            aria-label="Tìm kiếm sản phẩm"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-md border border-gray-600 hover:bg-gray-700 text-sm transition"
          >
            Tìm
          </button>
        </form>
                </div>
      </div>

      {/* ✅ Trạng thái loading / error */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-800 rounded-xl border border-gray-700" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-400 mt-6">
          Lỗi tải dữ liệu: {(error as Error)?.message}
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="mt-6 text-gray-400">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* ✅ Phân trang */}
      {data && (
        <div className="mt-8 flex items-center gap-3">
          <button
            className="h-9 px-3 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-40"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-400">Trang {data.page}</span>
          <button
            className="h-9 px-3 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-40"
            onClick={() => setUrl({ page: data.page + 1 })}
            disabled={!data.hasNext}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
