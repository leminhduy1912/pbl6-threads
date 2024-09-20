import axios from "axios";

export const clientRequest = axios.create({
    baseURL: import.meta.env.VITE_BE_URL, // Sử dụng biến môi trường từ Vite
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});