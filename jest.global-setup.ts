import connectDB from "./src/databases/index";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

module.exports = async () => {
  await connectDB();
};
