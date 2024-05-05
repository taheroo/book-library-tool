import dotenv from "dotenv";
import getModels from "../src/models";

dotenv.config();
const USER_TEST_EMAIL = process.env.USER_TEST_EMAIL;

export async function up(): Promise<void> {
  if (!USER_TEST_EMAIL) {
    throw new Error("USER_TEST_EMAIL is not defined in the .env file.");
  }
  console.log("Seeding users");
  const { User } = await getModels();
  // generate 1k users
  const users = Array.from({ length: 1000 }, (_, i) => ({
    email: `${USER_TEST_EMAIL.split("@")[0]}+${i}@${
      USER_TEST_EMAIL.split("@")[1]
    }`,
  }));
  await User.insertMany(users);
}

export async function down(): Promise<void> {
  const { User } = await getModels();
  if (!USER_TEST_EMAIL) {
    throw new Error("USER_TEST_EMAIL is not defined in the .env file.");
  }
  const regexPattern = new RegExp(`${USER_TEST_EMAIL.split("@")[0]}\\+`, "i");
  await User.deleteMany({ email: { $regex: regexPattern } });
}
