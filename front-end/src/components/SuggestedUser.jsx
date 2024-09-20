import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import useFollowUnfollow from "../hooks/userFollowUnFollow";
import { Link } from "react-router-dom";


const SuggestedUser = ({user}) => {
   
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
    console.log(following,updating)
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
    {/* left side */}
    <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box flexDirection={"column"} justifyContent={"start"} alignItems={"start"} width={"10rem"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
            </Text>
            <Text color={"gray.light"} fontSize={"sm"}>
                {user.name}
            </Text>
        </Box>
    </Flex>
    {/* right side */}
    <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
            color: following ? "black" : "white",
            opacity: ".8",
        }}
    >
        {following ? "Unfollow" : "Follow"}
    </Button>
</Flex>
  )
}

export default SuggestedUser