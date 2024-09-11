import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route('/createRoom').post(createRoom)
router.route('/joinRoom').patch(joinRoom)


export default router