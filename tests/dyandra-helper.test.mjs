import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_DYANDRA_REFRESH_INTERVAL_MS,
  findMatchingDyandraLoketLink,
  normalizeDyandraHelperConfig,
  normalizeDyandraRefreshInterval,
} from "../src/lib/dyandra/shared.ts";

test("findMatchingDyandraLoketLink pakai includes + urutan DOM pertama", () => {
  const match = findMatchingDyandraLoketLink(
    [
      {
        href: "https://example.com/not-loket",
        text: "15 April 2026",
      },
      {
        href: "https://widget.loket.com/second",
        text: "Tiket Presale 15 April 2026 jam 10.00",
      },
      {
        href: "https://widget.loket.com/third",
        text: "15 April 2026 tambahan",
      },
    ],
    "15 April 2026"
  );

  assert.deepEqual(match, {
    href: "https://widget.loket.com/second",
    text: "Tiket Presale 15 April 2026 jam 10.00",
  });
});

test("findMatchingDyandraLoketLink normalisasi whitespace", () => {
  const match = findMatchingDyandraLoketLink(
    [
      {
        href: "https://widget.loket.com/test",
        text: "   15    April   2026   ",
      },
    ],
    "15 April 2026"
  );

  assert.deepEqual(match, {
    href: "https://widget.loket.com/test",
    text: "15 April 2026",
  });
});

test("normalizeDyandraRefreshInterval clamp dan fallback", () => {
  assert.equal(normalizeDyandraRefreshInterval("250"), 500);
  assert.equal(normalizeDyandraRefreshInterval("70000"), 60000);
  assert.equal(
    normalizeDyandraRefreshInterval("bukan-angka"),
    DEFAULT_DYANDRA_REFRESH_INTERVAL_MS
  );
});

test("normalizeDyandraHelperConfig jaga shape default", () => {
  const config = normalizeDyandraHelperConfig({
    targetText: "  15   April 2026 ",
    refreshIntervalMs: "1200",
    autoRefreshEnabled: 1,
  });

  assert.deepEqual(config, {
    targetText: "15 April 2026",
    refreshIntervalMs: 1200,
    autoRefreshEnabled: true,
  });
});
