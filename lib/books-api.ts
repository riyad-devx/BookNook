/** Backend that owns the books collection and GridFS cover images. */
export const BOOKS_API_BASE =
  process.env.BOOKS_API_URL ?? "http://localhost:5000";
