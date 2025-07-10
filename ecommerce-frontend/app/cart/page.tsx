'use client';

import React, { useEffect, useState } from "react";   
import { fetchCart, updateCartItem, createOrder, deleteCartItem } from "../services/api";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function CartPage(){
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const router = useRouter();


  // Load giỏ hàng
  useEffect(() => {
    setLoading(true);
    fetchCart()
      .then(res => {
        const items = res.data;
        setCartItems(items);
        const sum = items.reduce((s: number, it: any) => s + it.product.price * it.quantity, 0);
        setTotal(sum);
      })
      .catch(() => setError("Lỗi khi tải giỏ hàng."))
      .finally(() => setLoading(false));
  }, []);



  // Cập nhật số lượng
  const handleUpdateQuantity = async (itemId: number, productId:number, quantity: number) => {
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }
    try {
      await updateCartItem(productId, quantity);
      const updated = cartItems.map(item =>
        item.productId === productId ? {...item, quantity} : item
      );
      setCartItems(updated);
      setTotal(updated.reduce((s, it) => s + it.product.price * it.quantity, 0));
    } catch {
      alert("Lỗi khi cập nhật số lượng.");
    }
  };

  // Xử lý checkout
  const handleConfirmCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      // Chuẩn bị payload: giả sử API nhận { details: [ { productId, quantity, unitPrice } ] }
      const details = cartItems.map(it => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.product.price
      }));
      await createOrder({
        userId: Number(localStorage.getItem("userId")),
        totalAmount: total,
        details
      });
      alert("Đặt hàng thành công!");
      setShowCheckout(false);
      // Bạn có thể clear giỏ và reload page:
      setCartItems([]);
      setTotal(0);
    } catch (err: any) {
      setCheckoutError(err.response?.data || "Lỗi khi đặt hàng.");
    } finally {
      setCheckoutLoading(false);
    }
  };



  //xóa sản phẩm trong giỏ
const handleRemove = async (productId: number) => {
  if (confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
    try {
      await deleteCartItem(productId);
      const updated = cartItems.filter(item => item.productId !== productId);
      setCartItems(updated);
      setTotal(updated.reduce((s, it) => s + it.product.price * it.quantity, 0));
    } catch {
      alert("Lỗi khi xoá sản phẩm.");
    }
  }
};



  

  if (loading) return <div className="text-center py-10">Đang tải giỏ hàng...</div>;
  if (error)   return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-2xl font-bold mb-6 mt-20">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Giỏ hàng của bạn hiện đang trống.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Sản phẩm</th>
                <th className="px-4 py-2 text-left">Số lượng</th>
                <th className="px-4 py-2 text-right">Giá</th>
                <th className="px-4 py-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {/* {cartItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      min="1" 
                      className="w-16 border rounded px-2 py-1 text-center"
                      onChange={e => handleUpdateQuantity(item.id, item.productId, +e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {(item.product.price * item.quantity).toLocaleString()} đ
                  </td>
                </tr>
              ))} */}


              {cartItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      min="1" 
                      className="w-16 border rounded px-2 py-1 text-center"
                      onChange={e => handleUpdateQuantity(item.id, item.productId, +e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {(item.product.price * item.quantity).toLocaleString()} đ
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>


          </table>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="font-bold text-xl">
            Tổng tiền: <span className="text-blue-600">{total.toLocaleString()} đ</span>
          </div>
          {cartItems.length > 0 && (
            // <button



            // //SỬA Ở ĐÂY
            //   //onClick={() => setShowCheckout(true)}
            //  //onClick={() => router.push("/orders/checkout")}
            


            //   className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            // >
            //   Check Out
            // </button>


            <button
              onClick={() => router.push('/checkout')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Đặt hàng
            </button>



          )}
        </div>
      </div>

      {/* Modal Checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Xác nhận đặt hàng</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {cartItems.map(it => (
                <div key={it.productId} className="flex justify-between">
                  <span>{it.product.name} x{it.quantity}</span>
                  <span>{(it.product.price * it.quantity).toLocaleString()} đ</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold mb-4">
              <span>Tổng:</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            {checkoutError && (
              <p className="text-red-500 mb-2 text-sm">{checkoutError}</p>
            )}
            <button
              onClick={handleConfirmCheckout}
              disabled={checkoutLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {checkoutLoading ? "Đang xử lý..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
