import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
  
}
console.log("ENV:", process.env.POSTGRES_URL);
export const sql = postgres(process.env.POSTGRES_URL, {
  ssl: "require",
});