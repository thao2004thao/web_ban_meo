import React from "react";
export default function Modal({ isOpen, onClose, children }: 
            { isOpen: boolean; onClose: () => 
                void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] text-gray-900">
        {children}
        <div className="text-right mt-4">
          <button onClick={onClose} className="px-4 py-2 
                bg-gray-400 text-white rounded hover:bg-gray-500">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}