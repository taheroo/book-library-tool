import express from "express";
import * as UserControllers from "../controllers/user.controller";
import { validatePagination } from "../middlewares/pagination.middlewares";
const router = express.Router();

router.post("/", UserControllers.createUser);
router.get("/", validatePagination, UserControllers.getUsers);
router.get("/:id", UserControllers.getUserById);

export default router;
