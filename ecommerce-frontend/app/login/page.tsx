'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/api";

export default function LoginPage() {
  const router = useRouter();

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Register modal state
  const [showRegister, setShowRegister] = useState(false);
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "khachhang",
    phone: "",
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log(response)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("fullName", response.data.user.fullName);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("phone", response.data.user.phone);
      if(response.data.user.role == "admin")
        router.push("/admin/categories");
      else
        router.push("/");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(""); setRegSuccess("");
    try {
      await register(regData);
      setRegSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      // Optionally auto-close modal after delay
      setTimeout(() => setShowRegister(false), 1500);
    } catch (error: any) {
      setRegError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Login Box */}
      <div className="max-w-sm w-full space-y-6 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:underline"
          >
            Đăng ký
          </button>
        </p>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0  bg-gray-100 bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Đăng ký</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded"
                value={regData.username}
                onChange={e =>
                  setRegData({ ...regData, username: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full p-2 border rounded"
                value={regData.password}
                onChange={e =>
                  setRegData({ ...regData, password: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-2 border rounded"
                value={regData.fullName}
                onChange={e =>
                  setRegData({ ...regData, fullName: e.target.value })
                }
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full p-2 border rounded"
                value={regData.phone}
                onChange={e =>
                  setRegData({ ...regData, phone: e.target.value })
                }
              />
              {regError && (
                <p className="text-red-500 text-sm">{regError}</p>
              )}
              {regSuccess && (
                <p className="text-green-600 text-sm">{regSuccess}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
