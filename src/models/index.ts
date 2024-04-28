import mongoose from "mongoose";

import User from "./user";
import Book from "./book";
const getModels = async () => {
  const uri: string = process.env.MONGODB_URI || "";
  // Ensure connection is open so we can run migrations
  await mongoose.connect(uri, {
    autoIndex: true,
  });

  return {
    mongoose,
    User,
    Book,
  };
};

export default getModels;
