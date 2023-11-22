# Web Programming HW#4

Login with username and can sign out.

The username is unique

The user can see all the chat room on the first page, and can see detail message when clicking the chat room.

The user can click "Add" button and type another user's name. If there is an existing chatroom, it will guide to the existing one. If there is no existing chatroom with that person, then it will create a new one.

Can delete chatroom and all the messages in it.


While typing message, user can choose to click Send button or use "Enter" keydown to sent the message.

The message will immediately show on the screen just after sending it.






```bash
yarn
```

## Prettier and ESLint
```bash
yarn lint
```

## Drizzle Setup

1. Install drizzle

   ```bash
   yarn add drizzle-orm pg
   yarn add -D drizzle-kit @types/pg
   ```

2. Copy the `docker-compose.yml` from this repo to your project root.

3. Start the database

   ```bash
   docker compose up -d
   ```

4. Add `POSTGRES_URL` to `.env.local`:
   ```text
   ...
   POSTGRES_URL=postgres://postgres:postgres@localhost:5432/hw4
   ```
5. Create `db` folder
   ```bash
   cd ./src
   mkdir db
   ```
6. Create the `./src/db/index.ts` file:

   ```ts
   import { drizzle } from "drizzle-orm/node-postgres";
   import { Client } from "pg";

   import { privateEnv } from "@/lib/env/private";

   const client = new Client({
     connectionString: privateEnv.POSTGRES_URL,
     connectionTimeoutMillis: 5000,
   });
   await client.connect();
   export const db = drizzle(client);
   ```

   Remember to setup the environment variables handlers in `src/lib/env/private.ts`:

   ```ts
   import { z } from "zod";

   const privateEnvSchema = z.object({
     POSTGRES_URL: z.string().url(),
   });

   type PrivateEnv = z.infer<typeof privateEnvSchema>;

   export const privateEnv: PrivateEnv = {
     POSTGRES_URL: process.env.POSTGRES_URL!,
   };

   privateEnvSchema.parse(privateEnv);
   ```

7. Create an empty `./src/db/schema.ts` file

8. Copy the `./drizzle.config.ts` from this repo to your project root.
   Remember to install `dotenv`:

   ```bash
   yarn add dotenv
   ```

9. Change the `target` option in `tsconfig.json` to `es2017`:

   ```json
   {
     "compilerOptions": {
       "target": "es2017",
       ...
     }
   }
   ```

10. Add scripts
    Add the following scripts to the `./package.json` file:

    ```json
    {
      "scripts": {
        // This script will update the database schema
        "migrate": "drizzle-kit push:pg",
        // This script opens a GUI to manage the database
        "studio": "drizzle-kit studio"
      }
    }
    ```

11. Add `pg-data` to `.gitignore`
    ```text
    ...
    pg-data/
    ```

## Pusher Setup

1.  Install pusher

    ```bash
    yarn add pusher pusher-js
    ```

2.  Create a pusher account at https://pusher.com/
3.  Create a new app

    - Click `Manage` on the `Channel` tab
    - Click `Create app`
    - Enter the app name
    - Select a cluster. Pick the one closest to you, i.e. `ap3(Asia Pacific (Tokyo))`
    - Click `Create app`

4.  Go to `App Keys` tab, you will see the following keys:
    - `app_id`
    - `key`
    - `secret`
    - `cluster`
5.  Copy these keys to your `.env.local` file:

    ```text
    PUSHER_ID=<app_id>
    NEXT_PUBLIC_PUSHER_KEY=<key>
    PUSHER_SECRET=<secret>
    NEXT_PUBLIC_PUSHER_CLUSTER=<cluster>
    ```

    `NEXT_PUBLIC` prefix is required for the client side to access the env variable.

    Also, please remember to add these keys to your environment variables handler in `src/lib/env/private.ts` and `src/lib/env/public.ts`. You can view those two files for more details.

6.  Go to `App Settings` tab, scroll down to `Enable authorized connections` and enable it.
    Note: If you enable the `Enable client events` option, every connection will last only 30 seconds if not authorized. So if you just want to do some experiments, you might need to disable this option.
