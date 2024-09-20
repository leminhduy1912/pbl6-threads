import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { clientRequest } from "../api/clientRequest";

const useFollowUnfollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
          showToast("Error", "Please login to follow", "error");
          return;
        }
      
        if (updating) return; // Prevent multiple submissions
        setUpdating(true);
      
        try {
          // Make the follow/unfollow request
          const { data } = await clientRequest.post(`/api/users/follow/${user._id}`);
      
          // Handle errors from the server response
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
      
          // Simulate updating followers based on action
          if (following) {
            showToast("Success", `Unfollowed ${user.name}`, "success");
            user.followers.pop(); // Simulate removing from followers list
          } else {
            showToast("Success", `Followed ${user.name}`, "success");
            user.followers.push(currentUser?._id); // Simulate adding to followers list
          }
      
          setFollowing(!following); // Toggle the following state
          console.log(data);
        } catch (error) {
          // Improved error handling
          showToast("Error", error.response?.data?.message || error.message, "error");
        } finally {
          setUpdating(false); // Always reset the updating state
        }
      };
      

	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;