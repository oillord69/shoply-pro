"use client";
import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { state, dispatch, subtotal, hydrated } = useCart();
  if (!hydrated) return null;

  const items = state.items;
  const shipping = items.length ? 15000 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-zinc-950 py-10 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            <p className="mb-4">Giỏ hàng của bạn đang trống</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2 rounded-md bg-white text-black hover:bg-zinc-200 transition"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <Image
                    src={it.image || "/placeholder.png"}
                    alt={it.title}
                    width={96}
                    height={96}
                    className="rounded-lg border border-zinc-700 object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/shop/${it.slug}`}
                      className="font-medium hover:underline"
                    >
                      {it.title}
                    </Link>

                    <div className="text-sm text-zinc-400 mt-1">
                      {formatVND(it.price)}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">SL</span>
                        <input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_QTY",
                              payload: {
                                productId: it.productId,
                                quantity: Number(e.target.value) || 1,
                              },
                            })
                          }
                          className="w-20 h-9 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-center text-white"
                        />
                      </div>

                      <button
                        onClick={() =>
                          dispatch({
                            type: "REMOVE",
                            payload: { productId: it.productId },
                          })
                        }
                        className="ml-auto text-sm text-red-400 hover:underline"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tóm tắt */}
            <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 h-fit">
              <h2 className="text-xl font-medium mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatVND(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-zinc-700 pt-3 text-white">
                  <span>Tổng cộng</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>

              <button className="mt-5 w-full h-11 rounded-md bg-white text-black font-medium hover:bg-zinc-200 transition">
                Thanh toán (mock)
              </button>

              <button
                onClick={() => dispatch({ type: "CLEAR" })}
                className="mt-3 w-full h-11 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
              >
                Xoá toàn bộ giỏ
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
