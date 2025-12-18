export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Khu vực quản trị</h1>
          <p className="text-gray-600 mt-2">
            Quản lý sản phẩm, đơn hàng và hệ thống
          </p>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">📦 Quản lý sản phẩm</h2>
            <p className="text-gray-500 text-sm">
              Thêm, sửa, xoá sản phẩm trong cửa hàng
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">🧾 Quản lý đơn hàng</h2>
            <p className="text-gray-500 text-sm">
              Xem và xử lý đơn hàng của khách
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">👤 Người dùng</h2>
            <p className="text-gray-500 text-sm">
              Quản lý tài khoản và phân quyền
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
