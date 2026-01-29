"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { logAppwriteConnection } from "./appwrite-logger";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    logAppwriteConnection("Session Client", "disconnected", { reason: "No session found" });
    return { account: null };
  } else {
    client.setSession(session.value);
    logAppwriteConnection("Session Client", "connected", { sessionId: session.value });
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY || process.env.APPWRITE_SECRET || "");

  logAppwriteConnection("Admin Client", "connected", { 
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT 
  });

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
