import express from "express";
import { signup,login,logout,updateProfile, check } from "../controllers/auth.controller.js";
import { proctoresRoute } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.put("/update-profile",proctoresRoute,updateProfile)
router.get("/check",proctoresRoute,check)
export default router;