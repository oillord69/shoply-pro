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
    <section className="space-y-6">
      {/* Header + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setUrl({ q: qInput });
          }}
          className="flex gap-2 w-full sm:w-auto"
        >
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Tìm sản phẩm…"
            className="h-10 w-full sm:w-64 rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-md bg-black text-white text-sm"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-red-500">
          Lỗi tải dữ liệu: {(error as Error)?.message}
        </p>
      )}

      {/* Empty */}
      {data && data.data.length === 0 && (
        <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      {/* Products */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            className="h-9 px-4 rounded-md border text-sm disabled:opacity-40"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            ← Trước
          </button>

          <span className="text-sm text-gray-600">
            Trang {data.page}
          </span>

          <button
            className="h-9 px-4 rounded-md border text-sm disabled:opacity-40"
            onClick={() => setUrl({ page: data.page + 1 })}
            disabled={!data.hasNext}
          >
            Sau →
          </button>
        </div>
      )}
    </section>
  );
}
