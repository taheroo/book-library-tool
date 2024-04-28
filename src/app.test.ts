import request from "supertest";
import { app } from "./app";

describe("Application Health Check", () => {
  it("should confirm the application is running", async () => {
    const result = await request(app).get("/");
    expect(result.statusCode).toEqual(200);
  });
});
