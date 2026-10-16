import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
  
}
const dbUrl = new URL(process.env.POSTGRES_URL!);

console.log("Database connection:", {
  host: dbUrl.hostname,
  database: dbUrl.pathname.slice(1),
});
export const sql = postgres(process.env.POSTGRES_URL, {
  ssl: "require",
});