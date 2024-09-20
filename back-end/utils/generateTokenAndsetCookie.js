import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
	console.log("userId",userId);
	
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
  console.log("token",token);
	return token;
};
export const setCookie=(token,res)=>{

	res.cookie("jwt", token, {
		httpOnly: true, // more secure
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict", // CSRF
	});
}

