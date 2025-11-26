import { Router } from "express";
import { addRoom } from "../controllers/rooms/addroomcontroller";
import { protect } from "../middlewares/auth";
import { updateRoom } from "../controllers/rooms/updateroomcontroller";
import { getRooms } from "../controllers/rooms/getroomscontroller";
import { getSingleRoom } from "../controllers/rooms/singleroomviewcontroller";
const router = Router();
router.post("/addroom", protect, addRoom);
router.get("/getrooms",protect,getRooms)
router.put("/rooms/:roomId", protect, updateRoom);
router.get("/singleroom/:id", protect, getSingleRoom);


export default router;