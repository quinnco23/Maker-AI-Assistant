import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

type Machine = {
  shopCategory: string;
  machineType: string;
  manufacturer: string;
  model: string;
  manualUrl?: string;
  manufacturerUrl?: string;
};

type MachineWithQr = Machine & {
  slug: string;
  landingPageUrl: string;
  qrImagePath: string;
};

const ROOT = process.cwd();
const INPUT_JSON = path.join(ROOT, "client", "src", "data", "machines.json");
const OUTPUT_DIR = path.join(ROOT, "public", "qr");
const OUTPUT_MANIFEST = path.join(ROOT, "client", "src", "data", "machines-with-qr.json");

const LOCAL_BASE_URL = "http://localhost:5000/app/member/tools";
function machineDisplayName(machine: Machine) {
    return `${machine.manufacturer} ${machine.model}`.trim();
  }

const SITE_URL =
  process.env.SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5173";

function slugify(...parts: string[]) {
  return parts
    .join("-")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function clearPngs(dir: string) {
  try {
    const files = await fs.readdir(dir);
    await Promise.all(
      files
        .filter((f) => f.endsWith(".png"))
        .map((f) => fs.unlink(path.join(dir, f)))
    );
  } catch {
    // ignore if folder doesn't exist yet
  }
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  await clearPngs(OUTPUT_DIR);

  const raw = await fs.readFile(INPUT_JSON, "utf-8");
  const machines = JSON.parse(raw) as Machine[];

  const seenSlugs = new Map<string, number>();

  const enriched: MachineWithQr[] = [];

  for (const machine of machines) {
    const baseSlug = slugify(
      machine.shopCategory,
      machine.machineType,
      machine.manufacturer,
      machine.model
    );

    const count = (seenSlugs.get(baseSlug) ?? 0) + 1;
    seenSlugs.set(baseSlug, count);

    const slug = count === 1 ? baseSlug : `${baseSlug}-${count}`;
    const displayName = machineDisplayName(machine);
const landingPageUrl = `${LOCAL_BASE_URL}/${encodeURIComponent(displayName)}`;
    const qrFileName = `${slug}.png`;
    const qrImagePath = `/qr/${qrFileName}`;
    const qrFilePath = path.join(OUTPUT_DIR, qrFileName);

    await QRCode.toFile(qrFilePath, landingPageUrl, {
      type: "png",
      margin: 1,
      width: 512,
      errorCorrectionLevel: "H",
    });

    enriched.push({
      ...machine,
      slug,
      landingPageUrl,
      qrImagePath,
    });
  }

  await fs.writeFile(OUTPUT_MANIFEST, JSON.stringify(enriched, null, 2), "utf-8");

  console.log(`Generated ${enriched.length} QR codes`);
  console.log(`QR folder: ${OUTPUT_DIR}`);
  console.log(`Manifest: ${OUTPUT_MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});