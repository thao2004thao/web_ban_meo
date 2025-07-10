// app/blog/page.tsx
"use client";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Cách chăm sóc mèo con cho người mới bắt đầu",
    excerpt: "Mèo con rất cần sự quan tâm và chăm sóc đặc biệt. Bài viết này sẽ hướng dẫn bạn cách tạo môi trường an toàn, chế độ ăn hợp lý và lịch khám định kỳ cho mèo cưng.",
    image: "/images/cute-kitten.jpg",
    slug: "cham-soc-meo-con",
  },
  {
    id: 2,
    title: "Top 5 loại thức ăn tốt nhất cho mèo năm 2025",
    excerpt: "Bạn đang phân vân không biết nên chọn loại thức ăn nào cho mèo? Dưới đây là danh sách 5 thương hiệu được đánh giá cao nhất hiện nay.",
    image: "/images/cat-food.jpg",
    slug: "top-thuc-an-meo",
  },
  {
    id: 3,
    title: "Làm sao để mèo không cào đồ nội thất?",
    excerpt: "Mèo cào sofa là nỗi ám ảnh với nhiều chủ nuôi. Bài viết này cung cấp giải pháp hiệu quả để mèo có thể xả stress mà không phá đồ.",
    image: "/images/cat-scratch.jpg",
    slug: "meo-cao-do",
  },
];

export default function BlogPage() {
  return (
    <div>
        <Header></Header>
        <main className="bg-gray-50 min-h-screen px-4 py-10">
            <div className="max-w-6xl mx-auto mt-15">
                <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
                Bài Viết Về Mèo
                </h1>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <div
                    key={article.id}
                    className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-pink-500 mb-2">
                        {article.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                        <Link
                        href={`/blog/${article.slug}`}
                        className="inline-block text-white bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                        Xem chi tiết
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </main>
    </div>
  );
}
