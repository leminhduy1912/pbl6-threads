import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {usePreviewImgs} from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { clientRequest } from "../api/clientRequest";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const MAX_CHAR = 500;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const { handleImageChange, imgUrls, setImgUrls, removeImage } = usePreviewImgs();  // Lấy mảng imgUrls
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { username } = useParams();

	const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};

	const handleCreatePost = async () => {
		setLoading(true);
console.log("img urls",imgUrls)
		try {
			// Axios automatically handles the request as POST
			const { data } = await clientRequest.post("/api/posts/create", {
				postedBy: user._id,
				text: postText,
				img: imgUrls,  // Thay đổi thành mảng ảnh
			});

			// Check for server errors in response data
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			// Success: Show toast and update posts if necessary
			showToast("Success", "Post created successfully", "success");

			if (username === user.username) {
				setPosts([data, ...posts]);
			}

			// Reset fields and close modal/form
			onClose();
			setPostText("");
			setImgUrls([]);

		} catch (error) {
			// Handle and display any errors
			showToast("Error", error.response?.data?.message || error.message, "error");
		} finally {
			// Always stop the loading state
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position={"fixed"}
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				<AddIcon />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Input type='file' hidden ref={imageRef} onChange={handleImageChange} multiple />  

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrls.length > 0 && (
							<Swiper
								spaceBetween={10}
								slidesPerView={2}
								navigation
								pagination={{ clickable: true }}
								style={{ marginTop: "20px" }}
							>
								{imgUrls.map((url, index) => (
									<SwiperSlide key={index}>
										<div style={{ position: "relative" }}>
											<img src={url} alt={`Selected img ${index}`} style={{ width: "100%", height: "auto" }} />
											<CloseButton
												onClick={() => removeImage(index)}  // Xóa ảnh khi bấm nút
												bg={"gray.800"}
												position={"absolute"}
												top={2}
												right={2}
											/>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;

