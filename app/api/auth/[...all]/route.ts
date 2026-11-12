import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { connectMongo } from "@/lib/mongodb";

const handler = toNextJsHandler(auth);

/**
 * Better Auth reads and writes the session store, so the shared client has
 * to be connected before a request is handled.
 */
export const GET = async (request: Request) => {
  await connectMongo();

  return handler.GET(request);
};

export const POST = async (request: Request) => {
  await connectMongo();

  return handler.POST(request);
};
