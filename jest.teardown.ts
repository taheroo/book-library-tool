import mongoose from "mongoose";

const tearDownTests = async () => {
  console.log("Finished on tests");
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    await mongoose.connection.close();
  } catch (error) {
    console.log("Error dropping collections", error);
  }
};

export default tearDownTests;
