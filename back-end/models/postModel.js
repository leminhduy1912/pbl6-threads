// const postSchema = mongoose.Schema(
// 	{
// 		postedBy: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 			required: true,
// 		},
// 		text: {
// 			type: String,
// 			maxLength: 500,
// 		},
// 		img: {
// 			type: [String],
// 			default: [],
// 		},
// 		likes: {
// 			type: [mongoose.Schema.Types.ObjectId],
// 			ref: "User",
// 			default: [],
// 		},
// 		replies: [
// 			{
// 				userId: {
// 					type: mongoose.Schema.Types.ObjectId,
// 					ref: "User",
// 					required: true,
// 				},
// 				content: {
// 					text: { type: String },
// 					image: { type: String },
// 				},
// 				conversation: [
// 					{
// 						_id: {
// 							type: mongoose.Schema.Types.ObjectId,
// 							default: () => new mongoose.Types.ObjectId(),
// 						},
// 						userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// 						userPic: { type: String },
// 						text: { type: String },
// 						image: { type: String },
// 					},
// 				],
// 				userProfilePic: {
// 					type: String,
// 				},
// 				username: {
// 					type: String,
// 				},
// 			},
// 		],
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

// const Post = mongoose.model("Post", postSchema);

// export default Post;



import mongoose  from "mongoose";
const conversationSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			default: () => new mongoose.Types.ObjectId(),
		},
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		userPic: { type: String },
		text: { type: String },
		image: { type: String },
	},
	{
		timestamps: true, // Timestamps for each conversation entry
	}
);

const replySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			text: { type: String },
			image: { type: String },
		},
		conversation: [conversationSchema], // Embed conversation schema
		userProfilePic: {
			type: String,
		},
		username: {
			type: String,
		},
	},
	{
		timestamps: true, // Timestamps for each reply
	}
);

const postSchema = new mongoose.Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			maxLength: 500,
		},
		img: {
			type: [String],
			default: [],
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		replies: [replySchema], // Embed reply schema
	},
	{
		timestamps: true, // Timestamps for each post
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;

