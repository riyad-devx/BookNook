import {
  MongoClient,
  type Db,
} from "mongodb";

/**
 * A single MongoClient per process, shared by every server-side module.
 *
 * The production build evaluates server code in more than one module graph
 * (the server-component graph and the route-handler graph), so a client
 * created in module scope is created once per graph. Each of those clients
 * owns a separate connection pool and a separate topology, which means the
 * same request can hit a healthy connection on one graph and a closed one on
 * the other. Caching the client and the connection promise on `globalThis`
 * keeps exactly one connection per lambda instance instead.
 */

/** The database that holds the Better Auth collections. */
export const MONGODB_DATABASE = "booknook";

type MongoCache = {
  client?: MongoClient;
  connection?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & {
  __booknookMongo?: MongoCache;
};

const cache: MongoCache = (globalForMongo.__booknookMongo ??= {});

function createClient(): MongoClient {
  const url = process.env.MONGODB_URL;

  if (!url) {
    throw new Error(
      "MONGODB_URL is not set, the database connection cannot be created.",
    );
  }

  return new MongoClient(url, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    maxPoolSize: 10,
  });
}

/**
 * The shared client. It is never closed, so every caller keeps using the
 * same connection pool for the lifetime of the instance.
 */
export function getMongoClient(): MongoClient {
  cache.client ??= createClient();

  return cache.client;
}

/**
 * Connects the shared client and returns it.
 *
 * `MongoClient.connect()` returns straight away when the client is already
 * connected and rebuilds the topology when the client was closed, so calling
 * it is cheap and it repairs a client that was closed from the outside.
 * Concurrent callers share one handshake through the cached promise.
 *
 * A failed attempt is never cached: the promise is dropped as soon as it
 * settles, so the next caller starts a fresh attempt and the error is
 * reported to every caller that was waiting for it.
 */
export async function connectMongo(): Promise<MongoClient> {
  if (!cache.connection) {
    const attempt = getMongoClient().connect();

    const settled = attempt.finally(() => {
      if (cache.connection === settled) {
        cache.connection = undefined;
      }
    });

    cache.connection = settled;
  }

  return cache.connection;
}

/** The shared client bound to the application database, connected and ready. */
export async function getMongoDb(): Promise<Db> {
  const client = await connectMongo();

  return client.db(MONGODB_DATABASE);
}
