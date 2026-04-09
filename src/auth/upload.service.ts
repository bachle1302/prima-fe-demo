import api from "@/api/axios";

export const uploadAvatar = async (file: File) => {
  // 1. Tạo đối tượng FormData
  const formData = new FormData();

  formData.append("file", file); 

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        // Axios sẽ tự động set 'multipart/form-data' và boundary khi thấy FormData
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};