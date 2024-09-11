import { Router } from "express";
import { createRoom } from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(verifyJWT);

router.route('/createRoom').post(verifyJWT, createRoom)


export default router