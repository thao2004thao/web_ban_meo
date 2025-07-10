'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/app/services/api';
import HeaderAdmin from '@/components/HeaderAdmin';
import { Sidebar } from '@/components/Sidebar';

type User = {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  role: string;
  phone: string;
  creatAt?: string;
  isActive: boolean;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState<Omit<User, 'id' | 'creatAt'>>({
    username: '',
    password: '',
    fullName: '',
    role: 'khachhang',
    phone: '',
    isActive: true
  });

  useEffect(() => {
    fetchUsers().then(res => setUsers(res.data));
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      username: '',
      password: '',
      fullName: '',
      role: 'khachhang',
      phone: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '',
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setForm({
        ...form,
        [name]: value
    });
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = await updateUser(editingUser.id, form);
      console.log(updated);
    //   setUsers(users.map(u => u.id === editingUser.id ? updated.data : u));
    window.location.href = "/admin/users";
    } else {
      const created = await createUser(form);
      setUsers([...users, created.data]);
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1" style={{marginLeft: '300px'}}>
        <HeaderAdmin />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            onClick={openAddModal}
          >
            Thêm người dùng
          </button>

          <table className="w-full bg-white border shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">ID</th>
                <th className="border p-2">Username</th>
                <th className="border p-2">Họ tên</th>
                <th className="border p-2">SĐT</th>
                <th className="border p-2">Vai trò</th>
                <th className="border p-2">Kích hoạt</th>
                <th className="border p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.fullName}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">{user.isActive ? '✔' : '✘'}</td>
                  <td className="border p-2 flex gap-2">
                    <button className="bg-yellow-400 px-3 py-1 rounded" onClick={() => openEditModal(user)}>Sửa</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(user.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Form */}
          <Modal isOpen={modalOpen} onClose={closeModal}>
            <form onSubmit={handleSave} className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">{editingUser ? "Sửa người dùng" : "Thêm mới người dùng"}</h2>
              <input name="username" value={form.username} onChange={handleChange} className="w-full border p-2" placeholder="Tên đăng nhập" required disabled={!!editingUser} />
              <input name="password" value={form.password} onChange={handleChange} className="w-full border p-2" placeholder="Mật khẩu" type="password" required={!editingUser} />
              <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full border p-2" placeholder="Họ tên" required />
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2" placeholder="Số điện thoại" />
              <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2">
                <option value="admin">Admin</option>
                <option value="khachhang">Khách hàng</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Kích hoạt
              </label>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
