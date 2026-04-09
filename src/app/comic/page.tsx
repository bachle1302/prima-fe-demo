"use client"
import { useState, useEffect } from "react";
import { fetchComics } from "@/auth/comic.service";

export default function SearchComic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kỹ thuật Debounce: Chỉ gọi API sau khi người dùng ngừng gõ 500ms
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await fetchComics(searchTerm);
        setComics(result.data); // result.data chứa danh sách truyện từ Backend
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Tìm tên truyện..."
        className="border p-2 w-full rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Đang tìm kiếm...</p>}

      <div className="mt-4 grid grid-cols-2 gap-4">
        {comics.map((comic: any) => (
          <div key={comic.id} className="border p-2 rounded">
            <img src={comic.image} alt={comic.title} className="w-full h-40 object-cover" />
            <h3 className="font-bold mt-2">{comic.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}