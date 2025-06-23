import jwt from "jsonwebtoken"
import ChatUser from "../models/user.models.js"

export const proctoresRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                message:"unautheized no token provided"
            })
            
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        if(!decode){
            return   res.status(401).json({
                message:"unautheized unverivoed token"
            })
        }
        const user=await ChatUser.findById(decode.userId).select("-password");
        if(!user){
            return res.status(404).json({
                msg:"not found"
            })
            
        }
        req.user=user;
            next();
    } catch (error) {
        
    }
}