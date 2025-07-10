'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '@/components/Sidebar';
import HeaderAdmin from '@/components/HeaderAdmin';

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5091/api/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editId !== null) {
      await axios.put(`http://localhost:5091/api/categories/${editId}`, { name, description });
    } else {
      await axios.post('http://localhost:5091/api/categories', { name, description });
    }
    setName('');
    setDescription('');
    setEditId(null);
    setShowDialog(false);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setDescription(cat.description);
    setEditId(cat.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      await axios.delete(`http://localhost:5091/api/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="flex bg-gray-100">
  <Sidebar />
  <div className="flex-1 ml-64 mt-16 p-6"> {/* <== CHỖ NÀY QUAN TRỌNG */}
    <HeaderAdmin />
    <main>
      <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý danh mục sản phẩm</h1>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setEditId(null);
                setName('');
                setDescription('');
                setShowDialog(true);
              }}
            >
              Thêm danh mục
            </button>
          </div>

          {/* Dialog */}
          {showDialog && (
            <div  className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                  {editId ? 'Cập nhật' : 'Thêm'} danh mục
                </h2>
                <input
                  type="text"
                  placeholder="Tên danh mục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={() => setShowDialog(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleSubmit}
                  >
                    {editId ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-purple-700">{cat.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(cat)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
    </main>
  </div>
</div>

  );
}
