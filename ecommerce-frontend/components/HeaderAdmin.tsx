'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';

export default function HeaderAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('username'));

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

  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-md z-30" style={{height: '80px'}}>
  <div className="px-6 py-3 flex items-center justify-between">
    {/* Logo + Username + Logout */}

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-800 flex-shrink-0">
          Meoxingg
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
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
                  <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">Thông tin tài khoản</Link>
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
