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
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

import { clientRequest } from "../api/clientRequest";

export default function UpdateProfilePage() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [user, setUser] = useRecoilState(userAtom);
    console.log("user",user)
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
        
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);

	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();
console.log("img update ",imgUrl);
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (updating) return; // prevent multiple submits
		setUpdating(true);

		try {
			// Ensure clientRequest is properly configured
			const { data } = await clientRequest.put(
				`/api/users/update/${user._id}`,
				{ ...inputs,profilePic:imgUrl },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			// Handle potential server errors returned in the response
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			// If successful, show success toast and update user state
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);

			// Save the updated user object to localStorage
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			// Handle error from the request
			const errorMessage = error.response?.data?.message || "An unexpected error occurred";
			showToast("Error", errorMessage, "error");
		} finally {
			// Always reset updating flag
			setUpdating(false);
		}
	};

	return (
		<>
			<Button border="1px solid black" onClick={onOpen}>Edit Profile</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Your Profile</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={handleSubmit}>
						<ModalBody>
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
									{/* <FormControl id="userName">
										<Stack direction={["column", "row"]} spacing={6}>
											<Center>
												<Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
											</Center>
											<Center w="full">
												<Button w="full" onClick={() => fileRef.current.click()}>
													Change Avatar
												</Button>
												<Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
											</Center>
										</Stack>
									</FormControl> */}
                                    <FormControl id='userName'>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
							</Center>
							<Center w='full'>
								<Button w='full' onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
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
								</Stack>
							</Flex>
						</ModalBody>

						<ModalFooter>
							<Button
								bg={"red.400"}
								color={"white"}
								mr={3}
								onClick={onClose}
								_hover={{
									bg: "red.500",
								}}
							>
								Cancel
							</Button>
							<Button
								bg={"green.400"}
								color={"white"}
								type="submit"
								isLoading={updating}
								_hover={{
									bg: "green.500",
								}}
							>
								Submit
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
