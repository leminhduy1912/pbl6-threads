import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
// import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { clientRequest } from "../api/clientRequest";

import { SwiperSlide,Swiper} from "swiper/react";


import 'swiper/css';
import Actions from "./Actions";
const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
  console.log("post",post.img);
  console.log("posted by",postedBy)
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
  const [imgs,setImgs] = useState(post.img);
	const navigate = useNavigate();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await clientRequest("/api/users/profile/" + postedBy);
				const data = await res.data;
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		console.log("delete post")
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await clientRequest.delete(`/api/posts/${post._id}`);
			const data = await res.data;
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user) return null;
	return (
   
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size='md'
						name={user.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								fontWeight={"bold"}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							>
								{user?.username}
							</Text>
							<Image src='/verified.png' w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>

							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
						</Flex>
					</Flex>

					<Text fontSize={"sm"}>{post.text}</Text>
				
          {imgs.length > 0 && (
    <Swiper
    spaceBetween={10}
    slidesPerView={2}
    navigation
    pagination={{ clickable: true }}
    style={{ width:"500px",height:"250px" }}
>
    {imgs.map((item, index) => {
        return (
            <SwiperSlide key={index}>
                {console.log("img", item)}
                
                <img
                    src={item}
                    alt=""
                    style={{
                        width: "250px",          
                        height: "250px",          
                        objectFit: "cover",       
                        borderRadius: "10px",     
                    }}
                />
            </SwiperSlide>
        );
    })}
</Swiper>
)}



					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default Post;