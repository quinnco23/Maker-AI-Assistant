import { build } from "esbuild";

build({
  entryPoints: ["server/app.ts"],
  outfile: "api/index.cjs",
  platform: "node",
  target: "node20",
  format: "cjs",
  bundle: true,
  packages: "external",
  logLevel: "info",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});