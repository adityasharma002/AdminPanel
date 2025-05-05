import StatCardsGrid from "../components/StatCardsGrid";

const recentOrders = [
  {
    id: "#ORD001",
    product: "Milk 2L",
    deliveryBoy: "Rahul",
    status: "Delivered",
    date: "2025-04-25",
  },
  {
    id: "#ORD002",
    product: "Tomatoes 5kg",
    deliveryBoy: "Amit",
    status: "Pending",
    date: "2025-04-26",
  },
  {
    id: "#ORD003",
    product: "Paneer 1kg",
    deliveryBoy: "Karan",
    status: "Delivered",
    date: "2025-04-27",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Stats Cards */}
      <StatCardsGrid />

      {/* Recent Orders Table */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="table table-striped table-hover min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm">
              <th className="p-3">Order ID</th>
              <th className="p-3">Product</th>
              <th className="p-3">Delivery Boy</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.product}</td>
                <td className="p-3">{order.deliveryBoy}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
