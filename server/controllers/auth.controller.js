import ChatUser from '../models/user.models.js'; 
import bcrypt from 'bcrypt';
import { genrateToken } from "../lib/utlis.js"; 
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { name, username, password, avatar, bio } = req.body;
    console.log(req.body);
    
  try {
    if (!name || !username || !password || !avatar || !bio) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long",
      });
    }
    
    const user = await ChatUser.findOne({ username });

    if (user) {
      return res.status(400).json({
        msg: "Username already exists. Choose another.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new ChatUser({
      name,
      username,
      bio,
      password: hashedPassword,
      avatar,
    });
if(newUser)


    {
    await newUser.save();

    genrateToken(newUser._id, res);

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        avatar: newUser.avatar,
      },
    });}
    else{
        res.status(400).json({
            msg:"cannot register"
        })
    }
}
   catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: "Server error during sign up" });
  }
};

export const login= async (req,res)=>{
  const {username,password}=req.body;
  console.log(req.body);
  
  try {
    const user=await ChatUser.findOne({username}).select("+password");
    if(!user){
      return res.status(400).json({
        msg:"not found user"
    
      })
    }
    else{
      if(user.password){
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect)return res.status(400).json({msg:"incorrect password"})

      }
      genrateToken(user._id,res)

      res.status(200).json({
        _id:user._id,
        name:user.name,
        username:user.username,
        bio:user.bio,
        avatar:user.avatar
      })
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg:"internal server error"
    })
    
  }  

}
export const logout=(req,res)=>{
  try {
     res.cookie("jwt","",{maxAge:0});
    res.status(200).json({msg:"logged out successfully"})
  } catch (error) {
    
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar) {
      return res.status(400).json({
        msg: "Avatar image is required",
      });
    }

    const uploadedAvatar = await cloudinary.uploader.upload(avatar, {
      folder: "avatars", // optional: groups images under a folder
    });

    const updatedUser = await ChatUser.findByIdAndUpdate(
      userId,
      {
        avatar: {
          public_id: uploadedAvatar.public_id,
          url: uploadedAvatar.secure_url,
        },
      },
      { new: true }
    );

    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const check=(req,res)=>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
    
  }
}

