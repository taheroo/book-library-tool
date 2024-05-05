import fs from "fs";
import csvParser from "csv-parser";
import getModels from "../src/models";
import { AnyBulkWriteOperation } from "mongoose";

interface BookData {
  id: string;
  title: string;
  author: string;
  publication_year: Date;
  publisher: string;
}

const loadData = (): Promise<BookData[]> =>
  new Promise((resolve, reject) => {
    const results: BookData[] = [];
    fs.createReadStream("./migrations/books_sample.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });

export async function up(): Promise<void> {
  const { Book } = await getModels();
  const books = await loadData();
  // Prepare the operations for bulkWrite
  const operations: AnyBulkWriteOperation<any>[] = books.map((book) => ({
    insertOne: {
      document: book,
    },
  }));

  await Book.bulkWrite(operations, { ordered: false });
}

export async function down(): Promise<void> {
  const { Book } = await getModels();
  await Book.deleteMany({});
}
