import { Request, Response } from "express";
import BookModel from "../models/book";
import { MongoDBError } from "../types/mongodb-error.types";
import { MONGO_ERROR_CODES } from "../constants/mongodb-error-codes";
import fs from "fs";
import csvParser from "csv-parser";

interface BookQuery {
  genre?: RegExp;
  title?: RegExp;
  author?: RegExp;
}

export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = new BookModel(req.body);
    await newBook.save();
    res.status(201).send(newBook);
  } catch (error) {
    const e = error as MongoDBError;
    if (e.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
      res
        .status(409)
        .send("A book with the same title and author already exists.");
    } else {
      res.status(400).send(e);
    }
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const offset = (page - 1) * limit;

    const books = await BookModel.find().skip(offset).limit(limit);
    const totalCount = await BookModel.countDocuments();

    res.send({
      books,
      pagination: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  const { genre, title, author } = req.query;
  let query: BookQuery = {};
  if (title) query["title"] = new RegExp(title as string, "i");
  if (author) query["author"] = new RegExp(author as string, "i");

  try {
    const books = await BookModel.find(query);
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const uploadBooks = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = req.file.path;
  const results: {
    id: string;
    title: string;
    author: string;
    publication_year: Date;
    publisher: string;
  }[] = [];
  /**
   * csv-parser is a streaming parser
   * it reads the file line by line, instead of loading the entire file into memory
   * which can cause memory issues, especially when the file is large
   */
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      BookModel.insertMany(results)
        .then(() => {
          fs.unlinkSync(filePath);
          res
            .status(201)
            .send("Books have been successfully uploaded and saved.");
        })
        .catch((error) => {
          fs.unlinkSync(filePath);
          res.status(500).send(error);
        });
    })
    .on("error", (error) => {
      fs.unlinkSync(filePath);
      res.status(500).send(error);
    });
};
