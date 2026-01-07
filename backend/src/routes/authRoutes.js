import { Router } from 'express'
import { signup, login, getMe } from '../controllers/authController.js'
import { getProfile, updateProfile, searchUserByEmail } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.get('/users/search', protect, searchUserByEmail)

export default router
