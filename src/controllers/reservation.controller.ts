import { Request, Response } from "express";
import ReservationModel from "../models/reservation";
import BookModel from "../models/book";
import UserModel from "../models/user";
import { MongoDBError } from "../types/mongodb-error.types";
import { MONGO_ERROR_CODES } from "../constants/mongodb-error-codes";

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { user, book } = req.body;
    const bookExists = await BookModel.findById(book);
    if (!bookExists) {
      return res.status(400).send("Book does not exist.");
    }
    const userExists = await UserModel.findById(user);
    if (!userExists) {
      return res.status(400).send("User does not exist.");
    }
    // Check for existing unreturned reservations
    const existingReservation = await ReservationModel.findOne({
      user,
      book,
      return_date: { $exists: false },
    });
    if (existingReservation) {
      return res.status(400).send("This user has already borrowed this book.");
    }

    // Check reservation limits and book availability
    const userReservationsCount = await ReservationModel.countDocuments({
      user,
      return_date: { $exists: false },
    });
    if (userReservationsCount >= 3) {
      return res.status(400).send("User cannot borrow more than 3 books.");
    }

    const bookReservationsCount = await ReservationModel.countDocuments({
      book,
      return_date: { $exists: false },
    });
    if (bookReservationsCount >= bookExists.total_copies) {
      return res
        .status(400)
        .send("This book is not available for reservation.");
    }

    const newReservation = new ReservationModel(req.body);
    await newReservation.save();
    res.status(201).send(newReservation);
  } catch (error) {
    const e = error as MongoDBError;
    if (e.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
      res
        .status(409)
        .send("A reservation for the same user and book already exists.");
    } else {
      res.status(400).send(e);
    }
  }
};

export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await ReservationModel.find()
      .populate("user", "email")
      .populate("book", "title author");
    res.send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { user, book } = req.body;
    const bookExists = await BookModel.findById(book);
    if (!bookExists) {
      return res.status(400).send("Book does not exist.");
    }
    const reservation = await ReservationModel.findOne({
      user,
      book,
      return_date: { $exists: false },
    });

    if (!reservation) {
      return res.status(404).send({
        message: "No active reservation found for this book and user.",
      });
    }

    reservation.return_date = new Date();
    await reservation.save();
    bookExists.available_copies += 1;
    await bookExists.save();
    // Calculate points if the book was returned on time
    if (reservation.return_date <= reservation.reservation_ends_date) {
      const userAccount = await UserModel.findById(user);
      if (userAccount) {
        userAccount.points += 10;
        await userAccount.save();
      }
    }

    res.send({ message: "Book returned successfully.", reservation });
  } catch (error) {
    res.status(500).send(error);
  }
};
