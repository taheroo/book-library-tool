import request from "supertest";
import { app } from "../app";
import BookModel from "../models/book";

const addBook = async (bookData: {
  id: string;
  title: string;
  author: string;
  publication_year: Date;
  publisher: string;
  total_copies: number;
}) => {
  const book = new BookModel(bookData);
  await book.save();
};

describe("Book Routes", () => {
  describe("POST /api/books", () => {
    it("should create a new book and return it", async () => {
      const newBook = {
        id: "1",
        title: "Test Book",
        author: "Test Author",
        publication_year: new Date("2021-01-01"),
        publisher: "Test Publisher",
        total_copies: 4,
      };
      const response = await request(app).post("/api/books").send(newBook);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id", "1");
      expect(response.body).toHaveProperty("title", "Test Book");
    });
  });

  describe("GET /api/books", () => {
    it("should retrieve all books", async () => {
      await addBook({
        id: "3",
        title: "Another Book",
        author: "Another Author",
        publication_year: new Date("2020-01-01"),
        publisher: "Another Publisher",
        total_copies: 5,
      });

      const response = await request(app).get("/api/books");
      expect(response.statusCode).toBe(200);
      expect(response.body.books.length).toBeGreaterThan(0);
    });
  });
});
