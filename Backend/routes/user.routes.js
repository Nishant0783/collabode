    import { Router } from 'express';   
    import { registerUser, loginUser, logout, refreshAccessToken } from '../controllers/user.controller.js';
    import { verifyJWT } from './../middlewares/auth.middleware.js';

    const router = Router();

    // register user
    router.route('/register').post(registerUser);
    router.route('/login').post(loginUser);
    router.route('/logout').post(verifyJWT, logout);
    router.route('/refresh-token').post(refreshAccessToken);



    export default router;