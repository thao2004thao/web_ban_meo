'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '@/components/Sidebar';
import HeaderAdmin from '@/components/HeaderAdmin';

interface OrderDetailDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderDto {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  details: OrderDetailDto[];
}

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:5091/api/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      await axios.delete(`http://localhost:5091/api/orders/${id}`);
      fetchOrders();
    }
  };

  const handleViewDetail = (order: OrderDto) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const handleFilter = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate).toISOString().slice(0, 10);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });
    return filtered;
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 mt-16 p-6">
        <HeaderAdmin />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          </div>

          {/* Bộ lọc theo ngày */}
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm mb-1">Từ ngày</label>
              <input
                type="date"
                className="px-3 py-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Đến ngày</label>
              <input
                type="date"
                className="px-3 py-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Danh sách hóa đơn */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handleFilter().map((order) => (
              <div key={order.orderId} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-purple-700">Mã đơn: #{order.orderId}</h3>
                <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.orderDate).toLocaleString()}</p>
                <p className="text-sm text-gray-800 font-semibold">Tổng tiền: {order.totalAmount.toLocaleString()}₫</p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewDetail(order)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(order.orderId)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dialog xem chi tiết đơn hàng */}
          {showDetailDialog && selectedOrder && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn #{selectedOrder.orderId}</h2>
                <p className="text-gray-600">Ngày đặt: {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                <p className="text-gray-600 mb-4">Tổng tiền: {selectedOrder.totalAmount.toLocaleString()}₫</p>

                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b font-semibold">
                      <th className="text-left py-2">Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.details.map((d, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{d.productName}</td>
                        <td className="text-center">{d.quantity}</td>
                        <td className="text-right">{d.unitPrice.toLocaleString()}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-right">
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={() => setShowDetailDialog(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
