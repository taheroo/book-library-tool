import mongoose from "mongoose";
import BookModel from "./book";

interface Reservation {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  reservation_starts_date: Date;
  reservation_ends_date: Date;
  return_date?: Date;
  reminders?: {
    due_date_reminder_sent?: Date;
    late_return_reminder_sent?: Date;
  };
}

const reservationSchema = new mongoose.Schema<Reservation>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  reservation_starts_date: { type: Date, required: true },
  reservation_ends_date: { type: Date, required: true },
  return_date: { type: Date },
  reminders: {
    due_date_reminder_sent: { type: Date },
    late_return_reminder_sent: { type: Date },
  },
});

reservationSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const book = await BookModel.findById(this.book);
      if (book && book.available_copies > 0) {
        book.available_copies -= 1;
        await book.save();
      } else {
        throw new Error("No available copies of the book");
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      } else {
        return next(new Error("An unknown error occurred"));
      }
    }
  }
  next();
});

const ReservationModel = mongoose.model<Reservation>(
  "Reservation",
  reservationSchema
);

export default ReservationModel;
