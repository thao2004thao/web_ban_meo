'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeaderAdmin from '@/components/HeaderAdmin';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedUser = {
      id: Number(localStorage.getItem('id')),
      username: localStorage.getItem('username') || '',
      fullName: localStorage.getItem('fullName') || '',
      role: localStorage.getItem('role') || '',
      phone: localStorage.getItem('phone') || '',
      address: "quận 5, tp.hcm"
    };
    setUser(storedUser);
    setEditUser({ ...storedUser });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      const { name, value } = e.target;
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleSave = () => {
    if (editUser) {
      setUser(editUser);
      localStorage.setItem('fullName', editUser.fullName);
      localStorage.setItem('phone', editUser.phone);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!user) return <div className="mt-24 text-center text-gray-500">Đang tải...</div>;

  return (
    <>
      <HeaderAdmin />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6 text-gray-800  mt-20">Thông tin tài khoản</h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Tên đăng nhập</label>
              <input
                type="text"
                name='username'
                value={editUser?.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={editUser?.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={editUser?.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={editUser?.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            Lưu thay đổi
          </button>

          {showSuccess && (
            <p className="text-green-600 mt-2">✅ Cập nhật thông tin thành công!</p>
          )}
        </div>
      </div>

      <footer className="py-8 bg-gray-800 text-center text-gray-200 mt-20">
        &copy; {new Date().getFullYear()} Meoxingg. All rights reserved.
      </footer>
    </>
  );
}
