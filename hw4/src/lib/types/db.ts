export type User = {
    id: string;
    email: string;
    provider: "github" | "credentials";
};

export type Document = {
    id: string;
    title: string;
    content: string; 
  };