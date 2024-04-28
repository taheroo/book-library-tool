import mongoose from "mongoose";

interface Book {
  id: string;
  title: string;
  author: string;
  publication_year: Date;
  publisher: string;
  total_copies: number;
  available_copies: number;
}

const bookSchema = new mongoose.Schema<Book>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publication_year: { type: Date, required: true },
  publisher: { type: String, required: true },
  total_copies: { type: Number, required: true, default: 4 },
  available_copies: { type: Number, required: true, default: 4 },
});

bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });

const BookModel = mongoose.model<Book>("Book", bookSchema);

export default BookModel;
