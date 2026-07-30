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
