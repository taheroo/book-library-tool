import express from "express";
import * as BookController from "../controllers/book.controller";
const router = express.Router();

router.post("/", BookController.createBook);
router.get("/", BookController.getBooks);
router.get("/search", BookController.searchBooks);
router.get("/:id", BookController.getBookById);
router.put("/:id", BookController.updateBook);
router.delete("/:id", BookController.deleteBook);
router.post("/upload", BookController.uploadBooks);

export default router;
