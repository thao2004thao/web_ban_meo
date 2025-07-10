'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getOrdersByUser } from '../services/api';
import Link from 'next/link';

interface OrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderDto {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  details: OrderDetail[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // đánh dấu đã mounted

    const userId = localStorage.getItem('userId');
    console.log("User ID:", userId); 
    if (!userId) {
      setError('Bạn chưa đăng nhập');
      setLoading(false);
      return;
    }

    getOrdersByUser(Number(userId))
      .then(res => {
        setOrders(res.data);
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Không thể tải đơn hàng');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center">Đang tải đơn hàng...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center text-red-600">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12" style={{minHeight: '65vh'}}>
        <h1 className="text-3xl font-bold mb-6 mt-10">Đơn hàng của tôi</h1>
        {orders.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white shadow rounded-lg">
                <div className="flex justify-between items-center px-6 py-4">
                  <div>
                    <p className="font-semibold"># {order.orderId}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="font-bold text-blue-600">
                    {order.totalAmount.toLocaleString()} ₫
                  </div>
                  <button
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)
                    }
                    className="text-purple-600 hover:underline"
                  >
                    {expandedOrder === order.orderId ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>

                {expandedOrder === order.orderId && (
                  <div className="border-t px-6 py-4 bg-gray-50">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2">Sản phẩm</th>
                          <th className="py-2">Số lượng</th>
                          <th className="py-2 text-right">Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.details.map((d, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="py-2">{d.productName}</td>
                            <td className="py-2">{d.quantity}</td>
                            <td className="py-2 text-right">
                              {(d.unitPrice * d.quantity).toLocaleString()} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="bg-white border-t pt-10 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-2 text-purple-700">Về Meoxingg</h4>
            <p className="text-gray-600 text-sm">
              Meoxingg – nơi bạn tìm thấy mọi thứ cho “boss” yêu quý của mình.
            </p>
          </div>
          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-2 text-purple-700">Liên kết nhanh</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link href="/" className="hover:text-purple-600">Trang chủ</Link></li>
              <li><Link href="/shop" className="hover:text-purple-600">Mua sắm</Link></li>
              <li><Link href="/blog" className="hover:text-purple-600">Bài viết</Link></li>
              <li><Link href="/about" className="hover:text-purple-600">Chúng tôi</Link></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-lg mb-2 text-purple-700">Liên hệ</h4>
            <p className="text-gray-600 text-sm">Email: support@meoxingg.vn</p>
            <p className="text-gray-600 text-sm">Hotline: 1900 1234</p>
            <p className="text-gray-600 text-sm">Địa chỉ: 123 Phố Mèo, Quận Pet, HN</p>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} Meoxingg. All rights reserved.
        </div>
      </footer>
    </>
  );
}
