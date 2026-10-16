import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: "require",
  connect_timeout: 10,
});

try {
  const result = await sql`
    SELECT
      current_database() AS database,
      current_schema() AS schema,
      COUNT(*) AS makerspace_count
    FROM public.makerspaces
  `;

  console.log("LOCAL DATABASE RESULT:", result);
} catch (error) {
  console.error("DATABASE ERROR:", error);
} finally {
  await sql.end();
}
