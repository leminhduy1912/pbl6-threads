import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import { clientRequest } from "../api/clientRequest";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

	const logout = async () => {
		try {
			// `axios.post` takes the URL and the data object directly
			console.log(import.meta.env.VITE_BE_URL);
			const res = await clientRequest.post(`/api/users/logout`);
	
			// You don't need to call `.json()` with axios; it parses the response automatically
			const data = res.data;
	
			// Check if there's an error in the response
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
	
			// Save data to localStorage and update state
			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			// Handle any errors that occur during the request
			showToast("Error", error.message || "Something went wrong", "error");
		}
	};

	return logout;
};

export default useLogout;