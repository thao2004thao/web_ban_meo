'use client';

import Header from '@/components/Header';
import Image from 'next/image';
import React from 'react';

export default function BlogPage() {
  return (
    <div>
        <Header/>
        <div className="min-h-screen bg-orange-50 text-gray-800 py-10 px-4 md:px-16">
        <div className="max-w-6xl mx-auto text-center mt-15">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">Về Chúng Tôi</h1>
            <p className="text-lg md:text-xl mb-10">
            Chào mừng bạn đến với <strong>MeoXingg</strong> – nơi yêu thương và chăm sóc mèo được đặt lên hàng đầu!
            </p>

            <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
                <Image
                src="/images/cute-kitten.jpg"
                alt="About us"
                width={600}
                height={400}
                className="rounded-3xl shadow-lg object-cover"
                />
            </div>
            <div className="text-left">
                <h2 className="text-2xl font-semibold mb-4 text-orange-500">Sứ Mệnh Của Chúng Tôi</h2>
                <p className="mb-4">
                Tại MeoXingg, chúng tôi không chỉ bán mèo, chúng tôi kết nối những người yêu mèo với những người bạn lông xù dễ thương, khỏe mạnh và được chăm sóc chu đáo.
                </p>
                <p>
                Mỗi chú mèo đều được kiểm tra sức khỏe, tiêm chủng đầy đủ và sống trong môi trường sạch sẽ, thân thiện.
                </p>
            </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl text-left">
            <h2 className="text-2xl font-semibold mb-4 text-orange-500">Tại sao chọn MeoXingg?</h2>
            <ul className="list-disc pl-5 space-y-2 text-lg">
                <li>Chăm sóc y tế chuyên nghiệp cho từng bé mèo</li>
                <li>Chính sách bảo hành sức khỏe rõ ràng</li>
                <li>Hỗ trợ tư vấn nuôi mèo 24/7</li>
                <li>Đa dạng giống mèo: Ba Tư, Anh lông ngắn, Scottish, Munchkin...</li>
            </ul>
            </div>

            <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-orange-500">Đội ngũ của chúng tôi</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                {
                    name: 'Lê Thảo',
                    role: 'Founder & CEO',
                    img: '/images/cute-kitten.jpg',
                },
                {
                    name: 'Tô Thảo',
                    role: 'Bác sĩ thú y trưởng',
                    img: '/images/cute-kitten.jpg',
                },
                {
                    name: 'Phương Yến',
                    role: 'Chăm sóc thú cưng',
                    img: '/images/cute-kitten.jpg',
                },
                ].map((member, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition"
                >
                    <Image
                    src={member.img}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};
