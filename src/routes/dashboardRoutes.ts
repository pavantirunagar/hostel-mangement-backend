import { Router } from "express";
import { protect } from "../middlewares/auth"; 
import { getDashboard } from "../controllers/dashboard/dashboardcontroller"; 

const router = Router();

router.get("/dashboard", protect, getDashboard);

export default router;
