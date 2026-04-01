import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createSebHeaderProfileDraft,
  parseSebConfigXml,
} from "../src/lib/seb/shared.ts";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "..");
const configPath = path.join(repoRoot, "config.seb");

test("config.seb matches the Python reference hash", async () => {
  const xml = await readFile(configPath, "utf8");
  const parsed = await parseSebConfigXml(xml);
  const draft = await createSebHeaderProfileDraft("config.seb", xml);

  assert.equal(
    parsed.startUrl,
    "https://kulon2.undip.ac.id/mod/quiz/view.php?id=120524"
  );
  assert.equal(
    draft.configKeyHash,
    "e804ab76405afa2736303c9b0205a2df47d31f319a50b935e70977b09b245342"
  );
});

test("unsupported xml content is rejected", async () => {
  await assert.rejects(
    () =>
      createSebHeaderProfileDraft(
        "invalid.seb",
        "<?xml version=\"1.0\"?><plist><dict><key>startURL</key><dict></dict></dict></plist>"
      ),
    /Unsupported SEB config/
  );
});
