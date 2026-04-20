'use client';
import { useState, useEffect } from 'react';
import { fetchComics, updateComic, deleteComic } from '@/auth/comic.service';

interface Comic {
    id: number;
    title: string;
    image: string;
    createdAt: string;
}

export default function ComicManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [comics, setComics] = useState<Comic[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingComic, setEditingComic] = useState<Comic | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editFile, setEditFile] = useState<File | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const loadComics = async (search: string = '') => {
        setLoading(true);
        try {
            const result = await fetchComics(search);
            setComics(result.data);
        } catch (error) {
            console.error('Error loading comics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadComics(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleEdit = (comic: Comic) => {
        setEditingComic(comic);
        setEditTitle(comic.title);
        setEditFile(null);
        setEditPreview(comic.image);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditFile(file);
            setEditPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!editingComic || !editTitle.trim()) return;

        setEditLoading(true);
        try {
            await updateComic(
                editingComic.id,
                editTitle.trim(),
                editFile || undefined
            );
            await loadComics(searchTerm);
            setEditingComic(null);
            setEditTitle('');
            setEditFile(null);
            setEditPreview(null);
        } catch (error) {
            console.error('Error updating comic:', error);
            alert('Lỗi khi cập nhật comic');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa comic này?')) return;

        setDeleteLoading(id);
        try {
            await deleteComic(id);
            await loadComics(searchTerm);
        } catch (error) {
            console.error('Error deleting comic:', error);
            alert('Lỗi khi xóa comic');
        } finally {
            setDeleteLoading(null);
        }
    };

    const cancelEdit = () => {
        setEditingComic(null);
        setEditTitle('');
        setEditFile(null);
        setEditPreview(null);
    };

    return (
        <div className='max-w-6xl mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-6 text-center'>
                Quản lý Comic
            </h1>

            <div className='mb-6'>
                <input
                    type='text'
                    placeholder='Tìm tên truyện...'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && (
                <p className='text-center text-gray-500'>Đang tải...</p>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {comics.map((comic) => (
                    <div
                        key={comic.id}
                        className='bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden'
                    >
                        <img
                            src={comic.image}
                            alt={comic.title}
                            className='w-full h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h3 className='font-bold text-lg mb-2'>
                                {comic.title}
                            </h3>
                            <p className='text-sm text-gray-500 mb-4'>
                                Tạo:{' '}
                                {new Date(comic.createdAt).toLocaleDateString(
                                    'vi-VN'
                                )}
                            </p>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => handleEdit(comic)}
                                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition'
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(comic.id)}
                                    disabled={deleteLoading === comic.id}
                                    className='flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50'
                                >
                                    {deleteLoading === comic.id
                                        ? 'Đang xóa...'
                                        : 'Xóa'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {comics.length === 0 && !loading && (
                <p className='text-center text-gray-500 mt-8'>
                    Không có comic nào
                </p>
            )}

            {/* Modal Edit */}
            {editingComic && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
                    <div className='bg-white rounded-lg max-w-md w-full p-6'>
                        <h2 className='text-xl font-bold mb-4'>
                            Chỉnh sửa Comic
                        </h2>

                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Tiêu đề
                                </label>
                                <input
                                    type='text'
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập tiêu đề'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Ảnh mới (tùy chọn)
                                </label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                                />
                            </div>

                            {editPreview && (
                                <div className='relative w-full h-48 rounded-lg overflow-hidden border'>
                                    <img
                                        src={editPreview}
                                        alt='Preview'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            )}

                            <div className='flex gap-3'>
                                <button
                                    onClick={handleUpdate}
                                    disabled={editLoading || !editTitle.trim()}
                                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
                                >
                                    {editLoading
                                        ? 'Đang cập nhật...'
                                        : 'Cập nhật'}
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className='flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition'
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
