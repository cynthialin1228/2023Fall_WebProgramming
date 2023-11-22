import { index, pgTable, serial, uuid, varchar, text, unique, timestamp } from "drizzle-orm/pg-core";
import {relations, sql} from "drizzle-orm";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToDocumentsTable: many(usersToDocumentsTable),
}));

export const documentsTable = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    title: varchar("title", { length: 100 }).notNull(),
    },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

export const documentsRelations = relations(documentsTable, ({ many }) => ({
  usersToDocumentsTable: many(usersToDocumentsTable),
}));

export const usersToDocumentsTable = pgTable(
  "users_to_documents",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    userAndDocumentIndex: index("user_and_document_index").on(
      table.userId,
      table.documentId,
    ),
    // This is a unique constraint on the combination of userId and documentId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.documentId, table.userId),
  }),
);

export const usersToDocumentsRelations = relations(
  usersToDocumentsTable,
  ({ one }) => ({
    document: one(documentsTable, {
      fields: [usersToDocumentsTable.documentId],
      references: [documentsTable.displayId],
    }),
    user: one(usersTable, {
      fields: [usersToDocumentsTable.userId],
      references: [usersTable.displayId],
    }),
  }),
);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    documentId: uuid("document_id").notNull(),
    userId: uuid("user_id").notNull(),
    content: text("content").notNull(),
    timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  },
  (table) => ({
    documentIdIndex: index("document_id_index").on(table.displayId),
  }),
);

export const documentToMessagesTable = pgTable(
  "document_to_messages",
  {
    id: serial("id").primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messagesTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    documentAndMessageIndex: index("document_and_message_index").on(
      table.documentId,
      table.messageId,
    ),
    uniqCombination: unique().on(table.documentId, table.messageId),
  }),
);

export const messagesRelations = relations(messagesTable, ({ many }) => ({
  documentsToMessagesTable: many(documentToMessagesTable),
}));

export const documentsToMessagesRelations = relations(
  documentToMessagesTable,
  ({ one }) => ({
    document: one(documentsTable, {
      fields: [documentToMessagesTable.documentId],
      references: [documentsTable.displayId],
    }),
    message: one(messagesTable, {
      fields: [documentToMessagesTable.messageId],
      references: [messagesTable.displayId],
    }),
  }),
);
