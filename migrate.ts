// ts-migrate-mongoose configuration
export default {
  uri: process.env.MONGODB_URI,
  collection: "migrations",
  migrationsPath: "./migrations",
  templatePath: "./migrations/template.ts",
  autosync: false,
};
