import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      email: string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log("Wrong credentials. Try again.");
      return null;
    }
    const { email, password } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        email: usersTable.email,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();
    if (!existedUser) {
      // Sign up
      const hashedPassword = await bcrypt.hash(password, 10);
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          email: email.toLowerCase(),
          hashedPassword,
          provider: "credentials",
        })
        .returning();
      return {
        email: createdUser.email,
        id: createdUser.displayId,
      };
    }

    // Sign in
    if (existedUser.provider !== "credentials") {
      console.log(`The email has registered with ${existedUser.provider}.`);
      return null;
    }
    if (!existedUser.hashedPassword) {
      console.log("The email has registered with social account.");
      return null;
    }

    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      email: existedUser.email,
      id: existedUser.id,
    };
  },
});
