"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/mock/products";
import { calcTotals } from "@/lib/checkout";
import { getProductBySlug } from "@/services/products";
import { createOrder } from "@/services/orders";

type PM = "cod" | "banking" | "momo";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const itemsParam = sp.get("items") || "";
  const parsed = useMemo(() => {
    const list = itemsParam
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });

    return list
      .map((it) => {
        const p = PRODUCTS.find((x) => x.slug === it.slug);
        return p ? { ...it, product: p } : null;
      })
      .filter(Boolean) as any[];
  }, [itemsParam]);

  const totals = useMemo(() => {
    return calcTotals(parsed.map((x) => ({ price: x.product.price, quantity: x.quantity })), "");
  }, [parsed]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!parsed.length) return setError("Giỏ hàng trống.");
    if (!name || !addr) return setError("Vui lòng nhập Họ tên và Địa chỉ.");

    setSubmitting(true);
    try {
      const items = await Promise.all(
        parsed.map(async (x) => {
          const beProduct = await getProductBySlug(x.product.slug);
          return { productId: beProduct._id, quantity: x.quantity };
        })
      );

      const payload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: addr,
        paymentMethod: pm,
        note,
        items,
      };

      const j = await createOrder(payload);
      setResult(j.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">💳 Thanh toán</h1>

          {/* Cart summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Sản phẩm</h2>

            {parsed.length === 0 ? (
              <p className="text-gray-500">
                Chưa có sản phẩm.{" "}
                <button onClick={() => router.push("/shop")} className="underline">
                  Quay lại shop
                </button>
              </p>
            ) : (
              <ul className="divide-y">
                {parsed.map((x) => (
                  <li key={x.slug} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={x.product.images?.[0] || "/placeholder.png"}
                        className="w-14 h-14 rounded-lg border object-cover"
                      />
                      <div>
                        <p className="font-medium">{x.product.title}</p>
                        <p className="text-sm text-gray-500">SL: {x.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatVND(x.product.price * x.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold">Thông tin giao hàng</h2>

            <div>
              <label className="text-sm">Họ tên *</label>
              <input
                className="mt-1 w-full border rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Số điện thoại</label>
              <input
                className="mt-1 w-full border rounded-md p-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Địa chỉ *</label>
              <textarea
                className="mt-1 w-full border rounded-md p-2"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Thanh toán</label>
              <div className="mt-2 flex gap-4">
                {(["cod", "banking", "momo"] as PM[]).map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={pm === m}
                      onChange={() => setPM(m)}
                    />
                    {m.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm">Ghi chú</label>
              <textarea
                className="mt-1 w-full border rounded-md p-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                disabled={submitting}
                className="h-11 px-6 rounded-md bg-black text-white"
              >
                {submitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>

              <button
                type="button"
                className="h-11 px-6 rounded-md border"
                onClick={() => router.push("/cart")}
              >
                Quay lại giỏ
              </button>
            </div>
          </form>

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold mb-1">✅ Đặt hàng thành công</h3>
              <p className="text-sm">Mã đơn: <b>{result.id}</b></p>
              <p className="text-sm">Trạng thái: {result.status}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold mb-4">Tóm tắt thanh toán</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatVND(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển</span>
              <span>{formatVND(totals.shippingFee)}</span>
            </div>
          </div>

          <div className="border-t my-3" />

          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>{formatVND(totals.total)}</span>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            * Phí ship & khuyến mãi chỉ là giả lập.
          </p>
        </aside>
      </div>
    </main>
  );
}
