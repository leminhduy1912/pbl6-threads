import { Avatar, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
	const navigate = useNavigate();
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"} alignItems="flex-start">
				<Avatar src={reply.userProfilePic} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"} alignItems="flex-start">
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Button fontSize="sm" fontWeight="bold" >
							{reply.username}
						</Button>
					</Flex>
					<Text>{reply.text}</Text>
				</Flex>
			</Flex>
			{!lastReply ? <Divider /> : null}
		</>
	);
};

export default Comment;
