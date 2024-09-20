



import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import  usePreviewImg from "../hooks/usePreviewImg";

import useShowToast from "../hooks/useShowToast";
import { clientRequest } from "../api/clientRequest";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const navigate = useNavigate();
	const showToast = useShowToast();

	// Use custom hook for image preview
	const { handleImageChange, imgUrls } = usePreviewImg();

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (updating) return; // prevent multiple submits
		setUpdating(true);

		try {
			// Update profile with the image URL if an image is selected
			const { data } = await clientRequest.put(
				`/api/users/update/${user._id}`, 
				{ ...inputs, profilePic: imgUrls[0] || user.profilePic }, // use the first image URL or the existing one
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			// Handle server errors if any
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			// Show success toast and update user state
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);

			// Save updated user data to localStorage
			localStorage.setItem("user-threads", JSON.stringify(data));

			// Redirect to the user's profile after successful update
			navigate(`/${data.username}`);
			
		} catch (error) {
			// Handle errors
			const errorMessage = error.response?.data?.message || "An unexpected error occurred";
			showToast("Error", errorMessage, "error");
		} finally {
			setUpdating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={6}
				>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						User Profile Edit
					</Heading>

					<FormControl id="userName">
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								{/* Display the first image from imgUrls or fallback to user's current profilePic */}
								<Avatar size="xl" boxShadow={"md"} src={imgUrls[0] || user.profilePic} />
							</Center>
							<Center w="full">
								<Button w="full" onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>

					<FormControl>
						<FormLabel>Full name</FormLabel>
						<Input
							placeholder="John Doe"
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="text"
						/>
					</FormControl>

					<FormControl>
						<FormLabel>User name</FormLabel>
						<Input
							placeholder="johndoe"
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="text"
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder="your-email@example.com"
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="email"
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder="Your bio."
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="text"
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder="password"
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type="password"
						/>
					</FormControl>

					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "red.500",
							}}
							onClick={() => navigate(`/${user.username}`)} // Redirect to profile when Cancel is clicked
						>
							Cancel
						</Button>

						<Button
							bg={"green.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "green.500",
							}}
							type="submit"
							isLoading={updating}
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
