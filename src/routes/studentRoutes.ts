import { Router } from "express";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth";
import { studentRegisterSchema } from "../validations/studentvalidations";
import { addStudent } from "../controllers/students/addstudentcontroller";
import { listStudents } from "../controllers/students/liststudentscontroller";
import { updateStudent } from "../controllers/students/updatestudentcontroller";
import { deleteStudent } from "../controllers/students/deletestudentcontroller";
import { getSingleStudent } from "../controllers/students/getsinglestudentcontoller";
import { changeStudentRoom } from "../controllers/students/changestudentroomcontroller";
const router = Router();
router.post("/addstudents", protect, validate(studentRegisterSchema), addStudent);
router.get("/students", protect, listStudents);
router.put("/update/:id", protect, validate(studentRegisterSchema), updateStudent);
router.delete("/delete/:id", protect, deleteStudent);
router.get("/student/:id", protect, getSingleStudent);
router.put(
  "/students/change-room/:id",
  protect,
  changeStudentRoom
);

export default router;
