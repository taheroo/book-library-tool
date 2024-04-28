import request from "supertest";
import { app } from "../app";

describe("User Routes", () => {
  it("should create a new user and respond with 201 status", async () => {
    const newUser = { email: "john@example.com" };
    const result = await request(app).post("/api/users").send(newUser);
    expect(result.statusCode).toEqual(201);
  });

  it("should fetch all users and respond with 200 status", async () => {
    const result = await request(app).get("/api/users");
    expect(result.statusCode).toEqual(200);
  });

  it("should fetch a single user by id and respond with 200 status", async () => {
    const newUser = { email: "john+1@example.com" };
    const user = await request(app).post("/api/users").send(newUser);
    const result = await request(app).get(`/api/users/${user.body._id}`);
    expect(result.statusCode).toEqual(200);
  });

  it("should respond with 404 status when user is not found", async () => {
    const result = await request(app).get(
      "/api/users/60a3b3e2c5c3f8e1b4e6b6b0"
    );
    expect(result.statusCode).toEqual(404);
  });
});
