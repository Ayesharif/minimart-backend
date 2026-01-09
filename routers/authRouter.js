import express from 'express';

import { authMe, login, logOut, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/authMe', authMe)
router.get('/logout', logOut)

export default router;