import cron from "node-cron";
import ReservationModel from "../models/reservation";
import mailer from "./mailer";
import moment from "moment";

// Function to handle sending alerts for late returns
function sendLateReturnReminders() {
  const sevenDaysAgo = moment().subtract(7, "days").toDate();
  ReservationModel.find({
    reservation_ends_date: { $lt: sevenDaysAgo },
    return_date: { $exists: false },
  })
    .populate("user")
    .populate("book")
    .then((reservations) => {
      console.log("reservations", reservations);
      reservations.forEach((reservation) => {
        mailer.sendMail({
          to: (reservation.user as any).email,
          subject: "Late Book Return Alert",
          text: `Hi ${(reservation.user as any).name}, you have not returned "${
            (reservation.book as any).title
          }" which was due on ${
            reservation.reservation_ends_date
          }. Please return it as soon as possible.`,
        });
      });
    })
    .catch((err) => {
      console.error("Failed to send late return reminders:", err);
    });
}

if (process.env.NODE_ENV !== "test") {
  // Schedule tasks to run every day at 9 AM
  cron.schedule("0 9 * * *", () => {
    console.log(
      "Running scheduled tasks for due date reminders and late returns."
    );
    sendLateReturnReminders();
  });
}

export { sendLateReturnReminders };
