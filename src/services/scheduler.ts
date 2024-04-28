import cron from "node-cron";
import ReservationModel from "../models/reservation";
import mailer from "./mailer";
import moment from "moment";

// Function to handle sending reminders for upcoming due dates
function sendDueDateReminders() {
  const twoDaysFromNow = moment().add(2, "days").startOf("day").toDate();

  console.log("twoDaysFromNow", twoDaysFromNow);
  ReservationModel.find({
    reservation_ends_date: {
      $gte: twoDaysFromNow,
      $lt: moment(twoDaysFromNow).add(1, "days").toDate(),
    },
    return_date: { $exists: false },
  })
    .populate("user")
    .populate("book")
    .then((reservations) => {
      console.log("reservations", reservations.length);

      reservations.forEach((reservation) => {
        mailer.sendMail({
          to: (reservation.user as any).email,
          subject: "Upcoming Book Return Due",
          text: `Hi ${(reservation.user as any).name}, your book "${
            (reservation.book as any).title
          }" is due on ${
            reservation.reservation_ends_date
          }. Please remember to return it on time.`,
        });
      });
    })
    .catch((err) => {
      console.error("Failed to send due date reminders:", err);
    });
}

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
    sendDueDateReminders();
    sendLateReturnReminders();
  });
}

export { sendDueDateReminders, sendLateReturnReminders };
