import { Router } from "express";
import { addRoom } from "../controllers/rooms/addroomcontroller";
import { protect } from "../middlewares/auth";
import { getRooms } from "../controllers/rooms/getroomscontroller";
const router = Router();
router.post("/addroom", protect, addRoom);
router.get("/getrooms",protect,getRooms)
export default router;