export type User = {
    id: string;
    email: string;
    provider: "github" | "credentials";
};