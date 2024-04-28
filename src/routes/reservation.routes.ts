import express from "express";
import * as ReservationController from "../controllers/reservation.controller";
const router = express.Router();

router.post("/", ReservationController.createReservation);
router.get("/", ReservationController.getReservations);
router.put("/:id", ReservationController.updateReservation);

export default router;
