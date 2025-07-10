'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  List
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Danh mục', href: '/admin/categories', icon: List },
    { label: 'Sản phẩm', href: '/admin/products', icon: Package },
    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Người dùng', href: '/admin/users', icon: Users },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg border-r z-20 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Admin Panel
        </h2>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
