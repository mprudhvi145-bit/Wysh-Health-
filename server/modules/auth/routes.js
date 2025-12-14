
import { Router } from "express";
import { AuthController } from "./controller.js";
import { jwtAuthGuard } from "../../middleware/guards.js";
import { authLimiter } from "../../middleware/limiter.js";

export const authRouter = Router();

authRouter.post('/request-otp', authLimiter, AuthController.requestOtp);
authRouter.post('/verify-otp', authLimiter, AuthController.verifyOtp);
authRouter.get('/me', jwtAuthGuard, AuthController.getMe);

// Legacy/Demo Routes (Keep for compatibility with frontend demo if needed)
authRouter.post('/login', async (req, res) => {
    // Basic mock login bridge
    const { email } = req.body;
    // Route to OTP flow internally or maintain separate demo logic
    // For now, simpler to reuse the previous demo login logic here if desired, 
    // or deprecate. We will maintain the previous logic for 'Dr. Sarah Chen' demo.
    const { users } = await import('../../index.js'); // Hack to access memory users from index for demo
    // ... (Implementation handled in index.js for legacy/demo)
    res.status(501).json({ error: "Use /request-otp for production auth" });
});
