import express from "express";
import * as UserControllers from "../controllers/user.controller";
const router = express.Router();

router.post("/", UserControllers.createUser);
router.get("/", UserControllers.getUsers);
router.get("/:id", UserControllers.getUserById);

export default router;
