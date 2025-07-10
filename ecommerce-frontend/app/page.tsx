'use client';

import React, { useEffect, useState } from 'react';
import { addToCart, fetchProducts } from './services/api';
import Link from 'next/link';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import { FiShoppingCart, FiInfo } from 'react-icons/fi';

const BANNERS = [
  '/images/banner1.png',
  '/images/banner2.png',
  '/images/banner3.png',
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
  }, []);

  // Auto-slide banner mỗi 5s
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentBanner(i => (i + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleAddToCart = async (id: number) => {
    try {
      await addToCart({ productId: id, quantity: 1 });
      alert('Đã thêm sản phẩm vào giỏ.');
    } catch {
      alert('Lỗi khi thêm sản phẩm!');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner Carousel */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        {BANNERS.map((src, i) => (
          <img key={i}
            src={src}
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-1000
              ${i === currentBanner ? 'opacity-100' : 'opacity-0'}
            `}
            alt={`banner${i}`}
          />
        ))}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            Chào mừng đến MeoXingg Shop
          </h1>
          <p className="text-lg md:text-2xl mb-4 drop-shadow">
            Sản phẩm dành cho các “sen mèo” chuyên nghiệp
          </p>
          <Link href="#products"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
         <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
            Video nổi bật
          </h2>

          <div className="max-w-4xl mx-auto aspect-video mb-10">
            <iframe
              className="w-full h-full rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/DzEUdMFMKig"
              title="Video nổi bật Meoxingg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>




        </div>
      </section>

      {/* Cart Link */}
      {/* <div className="text-center mt-6">
        <Link href="/cart"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow transition"
        >
          Xem giỏ hàng
        </Link>
      </div> */}

      {/* Footer */}
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
              <li><Link href="/shop" className="hover:text-purple-600">Cửa hàng</Link></li>
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

      {/* Modal Chi tiết */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl overflow-auto w-full max-w-3xl max-h-[90vh] p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setModalProduct(null)}
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <img
                  src={modalProduct.imageUrl || '/images/placeholder.png'}
                  alt={modalProduct.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{modalProduct.name}</h2>
                <p className="text-gray-600">{modalProduct.description}</p>
                <div className="text-purple-600 font-bold text-2xl">
                  {Number(modalProduct.price).toLocaleString()} ₫
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(modalProduct.id);
                    setModalProduct(null);
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition"
                >
                  <FiShoppingCart className="inline-block mr-2" /> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
