export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your financial activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-t-4 border-t-orange-500">
          <div className="text-sm text-gray-400 mb-2">MONEY IN</div>
          <div className="text-3xl font-bold text-orange-500">
            EGP 0
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-t-4 border-t-orange-500">
          <div className="text-sm text-gray-400 mb-2">MONEY OUT</div>
          <div className="text-3xl font-bold text-orange-500">
            EGP 0
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 border-t-4 border-t-orange-500">
          <div className="text-sm text-gray-400 mb-2">NET</div>
          <div className="text-3xl font-bold text-green-500">
            EGP 0
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Total Orders</div>
            <div className="text-2xl font-bold mt-1">0</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Products</div>
            <div className="text-2xl font-bold mt-1">0</div>
          </div>
        </div>
      </div>
    </div>
  )
}
