import getModels from "../src/models";
export async function up(): Promise<void> {
  console.log("Seeding users");
  const { User } = await getModels();
  // generate 1k users
  const users = Array.from({ length: 1000 }, (_, i) => ({
    email: `ayaditaherooo+${i}@gmail.com'`,
  }));
  await User.insertMany(users);
}

export async function down(): Promise<void> {
  const { User } = await getModels();
  await User.deleteMany({ email: { $regex: /ayaditaherooo+/ } });
}
