import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "../utils/getPublicIdOfImage.js";
import mongoose from "mongoose";
const createPost = async (req, res) => {
	try {
		const { postedBy, text,img } = req.body;
		// let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Kiểm tra nếu user không phải là người tạo
		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		// Xử lý mảng img
		let imgUrls = [];
		if (img && Array.isArray(img) && img.length > 0) {
			// Duyệt qua từng ảnh trong mảng và upload lên Cloudinary
			for (let i = 0; i < img.length; i++) {
				const uploadedResponse = await cloudinary.uploader.upload(img[i], {
					folder: 'Threads',
					use_filename: false,
					unique_filename: true
				});
				imgUrls.push(uploadedResponse.secure_url); // Lưu lại URL của ảnh đã upload
			}
		}

		// Tạo mới post với text và mảng URL hình ảnh
		const newPost = new Post({ postedBy, text, img: imgUrls });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};
const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		console.log(Array.isArray(post.img)); // Kiểm tra post.img có phải là mảng không

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			for (let url of post.img) {
			  console.log("public image ", url);
			   let  imgId = getPublicIdFromUrl(url);
			  console.log("public image id", imgId);
			   await cloudinary.uploader.destroy(imgId);
			}
		  }
		  

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// const replyToPost = async (req, res) => {
// 	try {
// 		const { text } = req.body;
// 		const { img } = req.body;
// 		const { conversationId }= req.body;
// 		const postId = req.params.id;
// 		const userId = req.user._id;
// 		const userProfilePic = req.user.profilePic;
// 		const username = req.user.username;
// console.log("reply to post")
// 		if (!text) {
// 			return res.status(400).json({ error: "Text field is required" });
// 		}
// 		if (img) {
// 			const uploadedResponse = await cloudinary.uploader.upload(profilePic,{
// 				folder: 'Threads',
// 				use_filename: false,
// 				unique_filename: true
// 			});
// 			uploadImg = uploadedResponse.secure_url;
// 		}

// 		const post = await Post.findById(postId);
// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const reply = { userId, text, uploadImg, username };

// 		post.replies.push(reply);
// 		await post.save();

// 		res.status(200).json(reply);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

const replyToPost = async (req, res) => {
	try {
		const { text, img, replyId } = req.body; // replyId thay cho conversationId
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		// Tìm bài viết theo postId
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Nếu không có replyId, thêm phản hồi mới vào mảng replies
		if (!replyId) {
			const newReply = {
				userId,
				content: {
					text,
					image: img,
				},
				userProfilePic,
				username,
				conversation: [], // Khởi tạo mảng conversation rỗng cho reply mới
			};

			post.replies.push(newReply);
		} else {
			// Nếu có replyId, tìm reply cụ thể để thêm vào conversation
			const reply = post.replies.find((r) => r._id.toString() == replyId);
            console.log("reply find",post.replies);
			if (!reply) {
				return res.status(404).json({ message: "Reply not found" });
			}
			const newConversation = {
				_id: new mongoose.Types.ObjectId(), // Tạo _id cho conversation mới
				userId,
				userPic: userProfilePic,
				text,
				image: img,
			};

			// Thêm vào mảng conversation của reply đã tìm thấy
			reply.conversation.push(newConversation);
		}

		// Lưu thay đổi vào cơ sở dữ liệu
		await post.save();

		// Trả về phản hồi thành công
		res.status(200).json({ message: "Reply added successfully", post });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		console.log("get feed post user id",userId)
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };