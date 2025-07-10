'use client';

import React, { useEffect, useState } from 'react';
import { fetchCart, createOrder } from '../services/api';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart()
      .then(res => {
        const items = res.data;
        setCartItems(items);
        const sum = items.reduce((s: number, it: any) => s + it.product.price * it.quantity, 0);
        setTotal(sum);
      })
      .catch(() => setError('Lỗi khi tải giỏ hàng'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    if (!form.fullName || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setConfirming(true);
    try {
      const details = cartItems.map(it => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.product.price
      }));

      await createOrder({
        userId: Number(localStorage.getItem('userId')),
        totalAmount: total,
        details
      });

      alert('Đặt hàng thành công!');
      router.push('/orders');
    } catch {
      alert('Đặt hàng thất bại!');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 px-4 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded shadow p-6">
          
          {/* Form giao hàng */}
          <div>
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
            <input
              name="fullName"
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded mb-3 p-2"
            />
            <input
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded mb-3 p-2"
            />
            <input
              name="address"
              placeholder="Địa chỉ nhận hàng"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded mb-3 p-2"
            />
            <textarea
name="note"
              placeholder="Ghi chú cho đơn hàng..."
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div>
            <h2 className="text-xl font-bold mb-4">Sản phẩm đặt mua</h2>
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between border-b py-2">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>{(item.product.price * item.quantity).toLocaleString()} đ</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-bold text-lg">
                  Tổng tiền: {total.toLocaleString()} đ
                </div>
                <button
                  onClick={handleConfirmOrder}
                  disabled={confirming}
                  className="mt-4 bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {confirming ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
