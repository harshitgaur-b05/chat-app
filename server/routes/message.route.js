import express from "express";
import { proctoresRoute } from "../middlewares/auth.middleware.js";
import {getMessages, getUserForsideBar, sendMessage} from '../controllers/message.controllers.js'
const router=express.Router();

router.get("/users",proctoresRoute,getUserForsideBar)
router.get("/:id",proctoresRoute,getMessages)
router.post("/send/:id",proctoresRoute,sendMessage)
export default router
