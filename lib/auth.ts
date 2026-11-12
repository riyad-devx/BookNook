import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongoClient, MONGODB_DATABASE } from "@/lib/mongodb";

// The shared client from lib/mongodb.ts. It is created once per process and
// is never closed, so Better Auth and every other server-side database call
// use the same connection pool instead of one pool per module graph.
const client = getMongoClient();
const db = client.db(MONGODB_DATABASE);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
        jwt()
    ],
    session:{
      cookieCache:{
        enabled: true,
        strategy: 'jwt',
        // Keep the cookie cache short so revoked sessions stop working quickly.
        maxAge: 5 * 60
      }
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 10 },
        "/token": { window: 60, max: 60 },
      },
    },
});
