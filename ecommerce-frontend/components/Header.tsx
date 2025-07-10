// Header.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiShoppingCart } from 'react-icons/fi';  // thêm FiShoppingCart
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('username'));
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0', 10));

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    alert('Đã đăng xuất!');
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop/?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-black hover:text-gray-800 flex-shrink-0" style={{display: 'flex', flexDirection: 'row'}}>
          <Image
                                  src="/images/logo.png"
                                  alt="Logo"
                                  width={50}
                                  height={50}
                                  className="w-full object-cover"
                              />
          <span style={{marginTop: '15px'}}>MeoXingg</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden md:block mx-6 flex-shrink-0" style={{ width: '280px' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </form>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-purple-600">Trang chủ</Link>
          <Link href="/shop" className="text-gray-700 hover:text-purple-600">Cửa hàng</Link>
          <Link href="/blog" className="text-gray-700 hover:text-purple-600">Bài viết</Link>
          <Link href="/about" className="text-gray-700 hover:text-purple-600">Chúng tôi</Link>
          <Link href="/contact" className="text-gray-700 hover:text-purple-600">Liên hệ</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Icon giỏ hàng */}
          <Link href="/cart" className="relative text-gray-700 hover:text-purple-600">
            <FiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(prev => !prev)} className="flex items-center space-x-2">
                <FiUser size={24} className="text-gray-700 hover:text-purple-600" />
                <span className="hidden md:inline text-gray-700">
                  {localStorage.getItem('username')}
                </span>
              </button>
              {showMenu && (
                <div className="absolute top-8 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Thông tin tài khoản</Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">Đơn hàng của tôi</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Đăng xuất</button>
                </div>
              )}

            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
