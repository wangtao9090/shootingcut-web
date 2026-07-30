import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(testDirectory, "..");
const validatorPath = path.join(workspaceRoot, "scripts", "validate-site.mjs");
const temporaryRoots = new Set();
const publicEntries = [
  ".github",
  "CNAME",
  "faq.html",
  "index.html",
  "oauth",
  "og-image.svg",
  "privacy.html",
  "robots.txt",
  "sitemap.xml",
  "support.html",
  "terms.html",
];

async function copyCurrentSite() {
  const root = await mkdtemp(path.join(os.tmpdir(), "shootingcut-task-2-"));
  temporaryRoots.add(root);
  for (const entry of publicEntries) {
    await cp(path.join(workspaceRoot, entry), path.join(root, entry), {
      recursive: true,
    });
  }
  return root;
}

after(async () => {
  await Promise.all(
    [...temporaryRoots].map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function replaceInFile(root, relativePath, before, after) {
  const target = path.join(root, relativePath);
  const source = await readFile(target, "utf8");
  assert.ok(
    source.includes(before),
    `test fixture ${relativePath} does not contain the expected source`,
  );
  await writeFile(target, source.replace(before, after));
}

function runValidator(root) {
  return spawnSync(process.execPath, [validatorPath], {
    cwd: root,
    encoding: "utf8",
  });
}

function assertRejected(result, expected) {
  const output = `${result.stdout}\n${result.stderr}`;
  assert.equal(result.status, 1, output);
  assert.match(output, expected);
}

test("accepts the precise privacy boundary and legitimate external JSON-LD URLs", async () => {
  const root = await copyCurrentSite();
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("requires one matching og:url on every public page", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '    <meta property="og:url" content="https://shootingcut.com/">\n',
    "",
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ expected exactly one og:url/i);
});

test("rejects a cross-domain og:url", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<meta property="og:url" content="https://shootingcut.com/">',
    '<meta property="og:url" content="https://shootingcut.cn/">',
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ og:url must be exactly/i);
});

test("rejects a page-owned JSON-LD URL on the wrong domain", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '"url": "https://shootingcut.com/",',
    '"url": "https://shootingcut.cn/",',
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ SoftwareApplication url must be exactly/i);
});

test("accepts a same-route object mainEntityOfPage reference", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '"url": "https://shootingcut.com/",',
    '"url": "https://shootingcut.com/",\n        "mainEntityOfPage": {"@id": "https://shootingcut.com/"},',
  );
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("rejects an object mainEntityOfPage reference on the wrong domain", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '"url": "https://shootingcut.com/",',
    '"url": "https://shootingcut.com/",\n        "mainEntityOfPage": {"@id": "https://shootingcut.cn/"},',
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /index\.html:\d+ SoftwareApplication mainEntityOfPage\.@id must be exactly/i,
  );
});

test("rejects duplicate HTML ids", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<section class="hero" id="home">',
    '<section class="hero" id="home"><div id="home"></div>',
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ duplicate id="home"/i);
});

test("rejects visible Chinese encoded as HTML character references", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<section class="hero" id="home">',
    '<section class="hero" id="home"><p>&#x4e2d&#x6587</p>',
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /index\.html:\d+ English public pages must not contain visible Chinese text/i,
  );
});

test("rejects a language switch hidden with an important inline style", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>',
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans" style="display:none!important">Chinese</a>',
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ language switch must be visible/i);
});

test("rejects a language switch hidden by an ancestor", async () => {
  const root = await copyCurrentSite();
  const languageSwitch =
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>';
  await replaceInFile(
    root,
    "index.html",
    languageSwitch,
    `<div style="visibility:hidden !important">${languageSwitch}</div>`,
  );
  const result = runValidator(root);
  assertRejected(result, /index\.html:\d+ language switch must be visible/i);
});

test("does not count a commented language switch as visible", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>',
    '<!-- <a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a> -->',
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /index\.html:\d+ expected exactly one visible zh-Hans language switch; found 0/i,
  );
});

test("does not count language switches inside script or style elements", async () => {
  const languageSwitch =
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>';
  for (const element of ["script", "style"]) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "index.html",
      languageSwitch,
      `<${element}>${languageSwitch}</${element}>`,
    );
    const result = runValidator(root);
    assertRejected(
      result,
      /index\.html:\d+ expected exactly one visible zh-Hans language switch; found 0/i,
    );
  }
});

test("rejects an absolute local-media privacy claim", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "support.html",
    "Core video/audio analysis, editing, export, and person tracking run on device, and original footage is not uploaded to a ShootingCut media-processing server.",
    "All video and audio processing is performed locally on your device. Your media files never leave your device.",
  );
  const result = runValidator(root);
  assertRejected(result, /support\.html:\d+ absolute local-media privacy claim/i);
});

test("rejects detection reports described as anonymous instead of pseudonymous", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "privacy.html",
    "limited pseudonymous derived fields",
    "anonymous derived fields",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ detection reports must be described as pseudonymous/i,
  );
});

test("requires the current default state of the detection-improvement switch", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "privacy.html",
    "is user-controlled and is currently enabled by default",
    "is user-controlled",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ must state that detection improvement is currently enabled by default/i,
  );
});

test("requires the custom RevenueCat App User ID KVS boundary", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "privacy.html",
    "A non-anonymous RevenueCat App User ID",
    "A RevenueCat identifier",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ must disclose the custom RevenueCat App User ID KVS boundary/i,
  );
});

test("requires all real detection-improvement control labels", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "privacy.html",
    " or simply “Improve”",
    "<!--\n or simply “Improve”\n-->",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ must list the actual detection-improvement control labels/i,
  );
});

test("requires support to list all real detection-improvement control labels", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "support.html",
    " or simply “Improve”",
    "",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /support\.html:\d+ support must list the actual detection-improvement control labels/i,
  );
});

test("rejects stale and absolute claims split across source lines", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<section class="hero" id="home">',
    `<section class="hero" id="home">
      <p>No d&#x61;ta
      leaves your device.</p>
      <p>Lifetime acc&#x65;ss is included.</p>
      <p>Tik&#x54;ok direct<span> </span>upload is supported.</p>
      <p>Stage M&#x69;x supports
      3+ inputs.</p>`,
  );
  const result = runValidator(root);
  const output = `${result.stdout}\n${result.stderr}`;
  assert.equal(result.status, 1, output);
  assert.match(output, /absolute privacy claim/i);
  assert.match(output, /stale purchase claim/i);
  assert.match(output, /TikTok direct-upload or integration claim/i);
  assert.match(output, /stale Stage Mix input-count claim/i);
});

test("does not let a legal negative sentence excuse an adjacent positive claim", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "privacy.html",
    "ShootingCut 1.1.3 does not offer TikTok video direct upload.",
    "ShootingCut 1.1.3 does not offer TikTok video direct upload. TikTok direct upload is supported.",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ TikTok direct-upload or integration claim/i,
  );
});

test("ignores forbidden claims that are statically hidden", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<section class="hero" id="home">',
    '<section class="hero" id="home"><p hidden>No data leaves your device. Lifetime access. TikTok direct upload. Stage Mix supports 3+ inputs.</p>',
  );
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("requires robots.txt to reference only the English sitemap", async () => {
  const root = await copyCurrentSite();
  const robotsPath = path.join(root, "robots.txt");
  const robots = await readFile(robotsPath, "utf8");
  await writeFile(
    robotsPath,
    `${robots}\nSitemap: https://shootingcut.cn/sitemap.xml\n`,
  );
  const result = runValidator(root);
  assertRejected(result, /robots\.txt:\d+ sitemap directive must be exactly/i);
});
