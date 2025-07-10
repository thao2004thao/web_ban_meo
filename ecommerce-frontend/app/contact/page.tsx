'use client';

import Header from '@/components/Header';
import React from 'react';

const ContactPage = () => {
  return (
    <div>
        <Header/>
        <div className="min-h-screen bg-orange-50 text-gray-800 py-12 px-4 md:px-16">
      <div className="max-w-5xl mx-auto mt-15">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-600 mb-8">Liên hệ với chúng tôi</h1>

        <p className="text-center text-lg mb-12">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn! Hãy gửi tin nhắn nếu bạn có thắc mắc về mèo, dịch vụ hoặc cần tư vấn.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* FORM */}
          <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div>
              <label className="block mb-2 font-medium">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="abc@gmail.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Nội dung</label>
              <textarea
                rows={5}
                placeholder="Bạn muốn hỏi gì?"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Gửi liên hệ
            </button>
          </form>

          {/* CONTACT INFO */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-orange-500 mb-4">Thông tin liên hệ</h2>
            <p>
              <strong>Địa chỉ:</strong> 123 Phố Mèo, Quận Pet, HN
            </p>
            <p>
              <strong>Điện thoại:</strong> <a href="tel:0909123456" className="text-orange-600">0909 123 456</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:contact@meohouse.vn" className="text-orange-600">MeoxingShop@gmail.com</a>
            </p>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.16607408448!2d106.65513887480566!3d10.79789825883369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cd3450c8e5%3A0xc31ff20a93eaa94b!2zQ-G7rWEgUGjhu6cgdGjDtG5nIFBo4buRIFRow6FpIC0gVGjhuqFuaCBQaMO6IFRoYW5n!5e0!3m2!1sen!2s!4v1617013130307!5m2!1sen!2s"
              width="100%"
              height="250"
              className="rounded-xl border-none"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
