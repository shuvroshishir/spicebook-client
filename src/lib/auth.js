// to fix internal server error
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
            isBlocked: {
                type: "boolean",
                defaultValue: false,
            },
            isPremium: {
                type: "boolean",
                defaultValue: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"], // Add trusted providers
        },
    },

    // for jwt token generation by better-auth
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 60 * 60 * 24 * 7,
        },
    },
    plugins: [
        jwt(),
    ],
});