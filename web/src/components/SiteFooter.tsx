import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t mt-12 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        {/* BRAND */}
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-2">
            Shoply
          </h3>
          <p className="text-gray-500">
            Demo website bán hàng đơn giản dùng Next.js, Tailwind, Express.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Liên kết</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:underline">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Giỏ hàng
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Thông tin</h4>
          <ul className="space-y-1">
            <li>Hotline: 0123 456 789</li>
            <li>Email: support@shoply.demo</li>
            <li>Địa chỉ: Demo Street, Vietnam</li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Shoply — Demo for teaching
        </div>
      </div>
    </footer>
  );
}
