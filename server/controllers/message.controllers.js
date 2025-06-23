import ChatUser from "../models/user.models.js";
import Message from "../models/message.models.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForsideBar=async(req,res)=>{
    try {
        const loggedUserId=req.user._id;
        const filteredUser=await ChatUser.find({_id:{$ne:loggedUserId}}).select("-password")
        res.status(200).json(filteredUser)
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            msg:"internal server error"
        })
    }
}
export const getMessages=async (req,res)=>{
    try {
        const {id:userTochat}=req.params;
        const myId=req.user._id;
        const message=await Message.find({
            $or:[
                {senderId:myId,receiverId:userTochat},
                {senderId:userTochat,receiverId:myId}
            ]
        })
        res.status(200).json(message)
    } catch (error) {
         console.log(error.message);
        
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

export const sendMessage = async (req, res) => {
  try {
    console.log("Send message request body:", req.body);
    console.log("Receiver ID:", req.params.id);
    console.log("Sender ID:", req.user?._id);

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      console.log("Uploading image to Cloudinary");
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded:", imageUrl);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    console.log("Saving message:", newMessage);
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("Receiver socket ID:", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
