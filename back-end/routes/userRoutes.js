import express from "express"
import { followUnFollowUser, freezeAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();
router.post("/signup", signupUser);
router.post("/signin", loginUser);
router.post("/logout", logoutUser);
router.get("/suggested", protectRoute,getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.get("/profile/:query", getUserProfile);
router.put("/freeze", protectRoute, freezeAccount);

export default router