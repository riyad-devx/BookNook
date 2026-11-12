import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("booknook");

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
