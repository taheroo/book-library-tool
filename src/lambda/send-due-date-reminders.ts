/**
 * This lambda function sends email reminders to users whose book reservations are ending in two days.
 * Note: This is just the implementation code. To use this function, you must build and deploy it as a scheduled event in AWS Lambda.
 * Ensure the environment is properly set up with required dependencies, and AWS Lambda permissions are correctly configured for accessing MongoDB and sending emails.
 */
// import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
// import { mongo } from "mongoose";
// import mailer from "../services/mailer";

// const client = new mongo.MongoClient(
//   process.env.MONGODB_CONNECTION_STRING || ""
// );

// export const handler: Handler = async (): Promise<APIGatewayProxyResultV2> => {
//   console.log("Starting reminder service V1.0");
//   const db = await client.db("dev-library");
//   const reservationCollection = db.collection("reservations");
//   const today = new Date();
//   const twoDaysFromNow = new Date();
//   twoDaysFromNow.setDate(today.getDate() + 2);
//   today.setHours(0, 0, 0, 0);
//   twoDaysFromNow.setHours(23, 59, 59, 999);

//   console.log(`Looking for reservations ending in two days %j`, {
//     reservation_ends_date: {
//       gte: today,
//       lte: twoDaysFromNow,
//     },
//   });
//   const aggregationPipeline = [
//     {
//       $match: {
//         reservation_ends_date: {
//           $gte: today,
//           $lte: twoDaysFromNow,
//         },
//         return_date: { $exists: false },
//         "reminders.due_date_reminder_sent": { $exists: false },
//       },
//     },
//     {
//       $lookup: {
//         from: "books",
//         localField: "book",
//         foreignField: "_id",
//         as: "book",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "user",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     {
//       $unwind: "$book",
//     },
//     {
//       $unwind: "$user",
//     },
//     {
//       $group: {
//         _id: "$user._id",
//         user: { $first: "$user" },
//         books: { $push: "$book.title" },
//         reservation: { $first: "$_id" },
//       },
//     },
//   ];
//   const reservations = await reservationCollection
//     .aggregate(aggregationPipeline)
//     .toArray();
//   console.log(`Found reservations: ${reservations.length}`);
//   for (const { reservation, user, books } of reservations) {
//     console.log(`Sending email to ${user.email}`);
//     await mailer.sendMail({
//       to: user.email,
//       subject: "Upcoming Book Return Due",
//       text: `Hi, your books ${books.join(
//         ", "
//       )} are due on 2 days. Please remember to return them on time.`,
//     });

//     console.log(
//       `Reservation for books ${books.join(", ")} by ${
//         user.email
//       } ends in two days`
//     );
//     console.log(`Updating reservation ${reservation}`);
//     await reservationCollection.updateOne(
//       { _id: reservation },
//       { $set: { "reminders.due_date_reminder_sent": new Date() } }
//     );
//   }

//   const response = {
//     statusCode: 200,
//     body: `reservations: ${reservations.length} `,
//   };
//   return response;
// };
