import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  await mkdir(outDir, { recursive: true });

  // The site itself, and the renders of it, go out as plain files.
  const appTarget = join(outDir, "app");
  const shotsTarget = join(outDir, "screenshots");
  await cp(join(here, "app"), appTarget, { recursive: true });
  await cp(join(here, "screenshots"), shotsTarget, { recursive: true });

  // The dossier is the kit's own summary of those two folders.
  const dossier = await buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  const dossierPath = join(outDir, "dossier.json");
  await writeFile(dossierPath, dossier);
  console.log("Wrote " + dossierPath + " (" + dossier.length + " bytes)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
