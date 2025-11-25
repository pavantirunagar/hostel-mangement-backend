import { Router } from "express";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validations/registervalidations";
import { register } from "../controllers/auth/register.controller";
import { login } from "../controllers/auth/login.controller";
import { protect } from "../middlewares/auth";

const router = Router();

// Register Route
router.post("/register", validate(registerSchema), register);

// Login Route
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  return res.json({
    ok: true,
    user: (req as any).user 
  });
});


export default router;
