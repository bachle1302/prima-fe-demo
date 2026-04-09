'use client';
import { uploadAvatar } from '@/auth/upload.service';
import React, { useState } from 'react';

const UploadAvatar: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Xử lý khi chọn file từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Tạo đường dẫn tạm thời để xem trước ảnh
      setPreview(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  // Gọi API upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Vui lòng chọn một file ảnh!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await uploadAvatar(selectedFile);
      console.log("Upload thành công:", response);
      setMessage({ type: 'success', text: 'Upload ảnh thành công!' });
      // Bạn có thể cập nhật lại state của User ở đây nếu cần
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Lỗi khi upload: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center">Cập nhật ảnh đại diện</h2>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Khu vực xem trước ảnh */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-100">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chưa có ảnh</div>
          )}
        </div>

        {/* Nút chọn file ẩn */}
        <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-dashed border-gray-300 transition-all">
          <span>Chọn file ảnh</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>

        {selectedFile && <p className="text-sm text-gray-500 italic">{selectedFile.name}</p>}

        {/* Thông báo lỗi/thành công */}
        {message && (
          <div className={`text-sm p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Nút Upload */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95'}`}
        >
          {loading ? 'Đang upload...' : 'Xác nhận Upload'}
        </button>
      </div>
    </div>
  );
};

export default UploadAvatar;