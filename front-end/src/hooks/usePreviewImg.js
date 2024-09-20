import { useState } from "react";
import useShowToast from "./useShowToast";
export const usePreviewImgs = () => {
	const [imgUrls, setImgUrls] = useState([]);  // Lưu trữ mảng URL
	const showToast = useShowToast();

	const handleImageChange = (e) => {
		const files = e.target.files;
		const promises = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file && file.type.startsWith("image/")) {
				const promise = new Promise((resolve, reject) => {
					const reader = new FileReader();

					reader.onloadend = () => {
						resolve(reader.result);  // Trả về URL sau khi đọc thành công
					};

					reader.onerror = () => {
						reject("Failed to read file");
					};

					reader.readAsDataURL(file);
				});

				promises.push(promise);
			} else {
				showToast("Invalid file type", "Please select image files", "error");
			}
		}

		// Khi tất cả các file đã được xử lý, cập nhật state
		Promise.all(promises)
			.then((urls) => {
				setImgUrls((prevUrls) => [...prevUrls, ...urls]); 
				console.log("promise",imgUrls);
				 // Thêm các URL mới vào mảng
			})
			.catch((err) => {
				console.error(err);
				showToast("Error", "Failed to process some images", "error");
			});
	};

	const removeImage = (index) => {
		setImgUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
	};

	return { handleImageChange, imgUrls, setImgUrls, removeImage };
};
export const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			showToast("Invalid file type", " Please select an image file", "error");
			setImgUrl(null);
		}
	};
	return { handleImageChange, imgUrl, setImgUrl };
};
export default usePreviewImg;

