import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

let authInstance;

/**
 * Create the Better Auth instance once per server process.
 *
 * Kept lazy on purpose: `next build` imports route modules while collecting
 * configuration. Creating the Mongo client at module scope turns a missing
 * MONGODB_URI into "Cannot read properties of undefined (reading 'startsWith')"
 * during the build. This way the build succeeds, and a missing variable fails
 * at request time with a message that says exactly what to configure.
 */
export function getAuth() {
  if (authInstance) return authInstance;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to studiospace_front_end/.env for local " +
        "development, or to your hosting provider's environment variables " +
        "(Vercel: Project → Settings → Environment Variables), then restart or redeploy."
    );
  }

  const client = new MongoClient(uri);
  const db = client.db();

  authInstance = betterAuth({
    database: mongodbAdapter(db, {
      client,
    }),

    emailAndPassword: {
      enabled: true,
      // Matches the register card's password rules (prototype says "6+ characters";
      // better-auth's default is 8).
      minPasswordLength: 6,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  });

  return authInstance;
}
