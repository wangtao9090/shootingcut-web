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
  "add-shot-times-and-scores-to-match-video",
  "assets",
  "auto-trim-shooting-match-video",
  "batch-export-match-videos",
  "CNAME",
  "competitive-shooting-video-editor",
  "edit-multi-camera-shooting-video",
  "faq.html",
  "import-practiscore-ess-hdp-match-results",
  "index.html",
  "llms.txt",
  "merge-uspsa-stage-videos",
  "oauth",
  "og-image.svg",
  "on-device-shooting-video-editor",
  "privacy.html",
  "reframe-landscape-shooting-video-for-social-media",
  "robots.txt",
  "shot-detection-troubleshooting",
  "side-by-side-shooting-video-comparison",
  "sitemap.xml",
  "support.html",
  "sync-two-shooting-videos-by-timer-beep",
  "terms.html",
  "thailand-hdp-ess-match-results",
];
const expectedGuideRoutes = [
  "/competitive-shooting-video-editor/",
  "/on-device-shooting-video-editor/",
  "/auto-trim-shooting-match-video/",
  "/sync-two-shooting-videos-by-timer-beep/",
  "/edit-multi-camera-shooting-video/",
  "/shot-detection-troubleshooting/",
  "/reframe-landscape-shooting-video-for-social-media/",
  "/merge-uspsa-stage-videos/",
  "/side-by-side-shooting-video-comparison/",
  "/batch-export-match-videos/",
  "/import-practiscore-ess-hdp-match-results/",
  "/thailand-hdp-ess-match-results/",
  "/add-shot-times-and-scores-to-match-video/",
];
const expectedGuideVideos = new Map([
  ["sync-two-shooting-videos-by-timer-beep/index.html", ["oxkMd8x90B0"]],
  ["edit-multi-camera-shooting-video/index.html", ["EHIiom5QjMU"]],
  [
    "reframe-landscape-shooting-video-for-social-media/index.html",
    ["EO-yju9mCIk", "ZO5H3u1iSR8"],
  ],
]);
const expectedPolicyUrls = [
  "https://shootingcut.com/faq.html",
  "https://shootingcut.com/privacy.html",
  "https://shootingcut.com/support.html",
  "https://shootingcut.com/terms.html",
  "https://shootingcut.com/sitemap.xml",
  "https://shootingcut.cn/",
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

function countExact(source, value) {
  return source.split(value).length - 1;
}

function markdownUrls(source) {
  return [...source.matchAll(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g)].map(
    (match) => match[1],
  );
}

function homepageGuideHrefs(homepage) {
  const hub = homepage.match(
    /<section\b[^>]*\bid=(["'])guides\1[^>]*>[\s\S]*?<\/section>/i,
  );
  assert.ok(hub, "homepage must include a visible #guides section");
  assert.match(hub[0], /class=(["'])[^"']*\bguide-hub\b[^"']*\1/i);
  assert.doesNotMatch(
    hub[0],
    /\bfade-in\b/i,
    "guide hub must be visible without JavaScript",
  );
  assert.doesNotMatch(
    hub[0],
    /(?:^|\s)(?:hidden|inert)(?=\s|=|>)|display\s*:\s*none|visibility\s*:\s*hidden/i,
    "guide hub must not be statically hidden",
  );
  return [...hub[0].matchAll(/<a\b[^>]*\bhref=(["'])([^"']+)\1[^>]*>/gi)].map(
    (match) => match[2],
  );
}

test("homepage visibly links every English guide exactly once", async () => {
  const root = await copyCurrentSite();
  const homepage = await readFile(path.join(root, "index.html"), "utf8");
  const hrefs = homepageGuideHrefs(homepage);

  assert.doesNotMatch(
    homepage,
    /<nav\b[\s\S]*?<a\b[^>]*href=(["'])#guides\1[\s\S]*?<\/nav>/i,
    "guide hub must not add a top-navigation item",
  );
  assert.equal(hrefs.length, 13, "guide hub must contain exactly 13 anchors");
  assert.deepEqual(
    [...hrefs].sort(),
    [...expectedGuideRoutes].sort(),
    "guide hub must link the complete English guide surface",
  );

  for (const route of expectedGuideRoutes) {
    assert.equal(
      countExact(hrefs.join("\n"), route),
      1,
      `${route} must appear exactly once in the guide hub`,
    );
    const guide = path.join(root, route.slice(1), "index.html");
    await assert.doesNotReject(
      readFile(guide, "utf8"),
      `${route} must resolve to a tracked guide`,
    );
  }
});

test("homepage presents the complete match-video editing outcome", async () => {
  const [home, llms] = await Promise.all([
    readFile(path.join(workspaceRoot, "index.html"), "utf8"),
    readFile(path.join(workspaceRoot, "llms.txt"), "utf8"),
  ]);

  for (const phrase of [
    "Competitive-Shooting.",
    "Video Editing.",
    "Built for the Match.",
    "trim dead time",
    "sync POV and third-person views",
    "combine every stage",
    "add timing and results",
    "full-match video or vertical social clip",
  ]) {
    assert.ok(home.includes(phrase), `homepage must include: ${phrase}`);
  }

  assert.match(
    llms,
    /complete competitive-shooting video editor[\s\S]*trim dead time[\s\S]*combine every stage/i,
  );
  assert.doesNotMatch(home, /detect timer beeps and every gunshot/i);
  assert.doesNotMatch(home, /instantly get precise split times/i);
});

test("homepage visibly labels Pro features and mixed access boundaries", async () => {
  const home = await readFile(path.join(workspaceRoot, "index.html"), "utf8");

  for (const heading of [
    "Full Match Merge",
    "Split Sync",
    "Stage Mix",
    "Batch Export on Mac",
    "Custom Watermarks",
  ]) {
    assert.match(
      home,
      new RegExp(`<h3>${heading}[\\s\\S]{0,180}\\(PRO\\)</span></h3>`),
      `${heading} must display a Pro label in the feature grid`,
    );
  }

  assert.match(
    home,
    /<h3>Export and User-Initiated Sharing[\s\S]{0,320}\(FREE IN AUTO TRIM\)[\s\S]{0,180}\(PRO: MULTI-PLATFORM\)<\/span><\/h3>/,
  );
  assert.match(
    home,
    /<h3>Intro Title Cards[\s\S]{0,260}\(FREE DEFAULT\)[\s\S]{0,180}\(PRO: CUSTOM\)<\/span><\/h3>/,
  );
});

test("complete-editor guide maps shooter editing jobs to one workflow", async () => {
  const source = await readFile(
    path.join(
      workspaceRoot,
      "competitive-shooting-video-editor",
      "index.html",
    ),
    "utf8",
  );

  for (const phrase of [
    "finish the common match-video jobs in one editor",
    "remove dead time",
    "align simultaneous camera views",
    "put sequential stages in competition order",
    "make performance understandable",
    "reuse one edit across supported publishing formats",
  ]) {
    assert.ok(
      source.includes(phrase),
      `complete-editor guide must include: ${phrase}`,
    );
  }
});

test("Split Sync guide explains POV and third-person review", async () => {
  const source = await readFile(
    path.join(
      workspaceRoot,
      "sync-two-shooting-videos-by-timer-beep",
      "index.html",
    ),
    "utf8",
  );

  for (const phrase of [
    "hat-camera POV and a third-person view",
    "footwork, reloads, hard stops, movement, and stage strategy",
    "exactly two simultaneous recordings",
    "manually verify",
    "Stack both synchronized views top and bottom",
    "9:16, 1080 × 1920",
    "3:4, 1080 × 1440",
    "16:9, 1920 × 1080",
    "50/50, 40/60, or 30/70",
    "same-view comparison: 50/50",
    "does not use the top-and-bottom ratio control",
  ]) {
    assert.ok(source.includes(phrase), `Split Sync guide must include: ${phrase}`);
  }
});

test("Reframe guide answers fixed-crop and vertical publishing pain", async () => {
  const source = await readFile(
    path.join(
      workspaceRoot,
      "reframe-landscape-shooting-video-for-social-media",
      "index.html",
    ),
    "utf8",
  );

  for (const phrase of [
    "fixed center crop",
    "YouTube Shorts, Instagram Reels, or Facebook Reels",
    "Track follows the selected shooter",
    "does not decide which targets",
  ]) {
    assert.ok(source.includes(phrase), `Reframe guide must include: ${phrase}`);
  }
});

test("timing guide explains performance context without hit localization", async () => {
  const source = await readFile(
    path.join(
      workspaceRoot,
      "add-shot-times-and-scores-to-match-video",
      "index.html",
    ),
    "utf8",
  );

  for (const phrase of [
    "make a stage video easier to understand",
    "does not infer bullet-hit locations",
    "official per-shot timer records",
    "verify the timer-beep alignment",
  ]) {
    assert.ok(source.includes(phrase), `timing guide must include: ${phrase}`);
  }
});

test("batch export guide explains repeated multi-stage rendering", async () => {
  const source = await readFile(
    path.join(workspaceRoot, "batch-export-match-videos", "index.html"),
    "utf8",
  );

  for (const phrase of [
    "instead of starting each export one by one",
    "several prepared match edits",
    "separate output files",
    "does not combine stages",
  ]) {
    assert.ok(source.includes(phrase), `batch guide must include: ${phrase}`);
  }
});

test("guide video embeds are accessible and match VideoObject metadata", async () => {
  const root = await copyCurrentSite();

  for (const [relativePath, videoIds] of expectedGuideVideos) {
    const source = await readFile(path.join(root, relativePath), "utf8");

    assert.ok(
      countExact(source, "<figcaption>") >= videoIds.length,
      `${relativePath} must visibly caption every guide video`,
    );
    for (const videoId of videoIds) {
      const iframePattern = new RegExp(
        `<iframe\\b(?=[^>]*\\bsrc="https://www\\.youtube\\.com/embed/${videoId}")(?=[^>]*\\btitle="[^"]+")(?=[^>]*\\bloading="lazy")(?=[^>]*\\ballowfullscreen(?:\\s|>|=))[^>]*>`,
        "i",
      );
      assert.match(
        source,
        iframePattern,
        `${relativePath} must visibly embed ${videoId} with accessible lazy-loading attributes`,
      );
      assert.ok(
        source.includes(
          `"contentUrl": "https://www.youtube.com/watch?v=${videoId}"`,
        ) ||
          source.includes(
            `"contentUrl": "https://www.youtube.com/shorts/${videoId}"`,
          ),
        `${relativePath} must expose ${videoId} as VideoObject content`,
      );
      assert.ok(
        source.includes(
          `"embedUrl": "https://www.youtube.com/embed/${videoId}"`,
        ),
        `${relativePath} must match the visible ${videoId} embed in VideoObject`,
      );
    }
    assert.doesNotMatch(
      source,
      /youtube\.com\/embed\/[^"']*[?&]autoplay(?:=|&|["'])/i,
      `${relativePath} must not autoplay guide videos`,
    );
  }
});

test("guide video validation rejects unsafe embeds and mismatched metadata", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "sync-two-shooting-videos-by-timer-beep/index.html",
    'src="https://www.youtube.com/embed/oxkMd8x90B0" title="Official Shooting Cut Split Sync Side by Side demonstration" loading="lazy"',
    'src="https://www.youtube.com/embed/oxkMd8x90B0?autoplay=1" title="Official Shooting Cut Split Sync Side by Side demonstration"',
  );
  await replaceInFile(
    root,
    "sync-two-shooting-videos-by-timer-beep/index.html",
    '"contentUrl": "https://www.youtube.com/watch?v=oxkMd8x90B0"',
    '"contentUrl": "https://www.youtube.com/watch?v=EO-yju9mCIk"',
  );

  const result = runValidator(root);
  assertRejected(result, /must use loading="lazy"/i);
  assertRejected(result, /must not include an autoplay parameter/i);
  assertRejected(
    result,
    /official video oxkMd8x90B0 must have exactly one matching VideoObject/i,
  );
});

test("llms.txt exposes the complete reviewed product and route surface", async () => {
  const root = await copyCurrentSite();
  const llms = await readFile(path.join(root, "llms.txt"), "utf8");
  const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
  const urls = markdownUrls(llms);

  assert.equal(countExact(llms, "# Shooting Cut"), 1);
  for (const fact of [
    "Current product version: 1.1.8",
    "Shooting Cut is a complete competitive-shooting video editor for iPhone, iPad, and Mac.",
    "Requires iOS 26.0+, iPadOS 26.0+, or macOS 26.0+.",
    "Auto Trim accepts exactly 1 video.",
    "Merge combines up to 20 sequential clips into one long video.",
    "Split Sync accepts exactly 2 simultaneous views",
    "Stage Mix accepts 2–3 simultaneous inputs labeled POV, Follow, or Static",
    "Strings Mode is built for classifiers, Standards stages, and Steel Challenge",
    "Auto Trim, its timer and shot analysis, Reframe and Track, supported result import, timing and score overlays, standard export, and one-destination user-initiated sharing are free.",
    "Free Auto Trim exports include the Shooting Cut watermark and logo intro card.",
    "Pro unlocks Merge, Split Sync, Stage Mix, and Strings Mode",
    "One subscription covers all of the subscriber's Apple devices",
    "one supported sharing destination at a time",
    "Pro enables multi-platform sharing",
    "PractiScore result includes official per-shot timer records",
    "Supported result-import families are PractiScore, ESS, HDP, Shoot'n Score It, and IDPA",
    "ESS, HDP, Shoot'n Score It, and IDPA support score import but do not provide the same PractiScore-style official per-shot timing anchor.",
    "Track supports cropped 9:16, 3:4, 4:5, 6:7, and 1:1 outputs.",
    "Source keeps the source frame. Non-tracked 16:9 is separate from the Track crop ratios.",
    "currently enabled by default",
    "existing non-anonymous custom RevenueCat App User ID",
    "$RCAnonymousID:",
    "media aliases",
    "camera views",
    "firearm types",
    "score associations",
    "imported match fields",
  ]) {
    assert.ok(llms.includes(fact), `llms.txt must include reviewed fact: ${fact}`);
  }

  for (const route of expectedGuideRoutes) {
    const url = `https://shootingcut.com${route}`;
    assert.equal(
      urls.filter((candidate) => candidate === url).length,
      1,
      `${url} must appear in one Markdown link`,
    );
  }
  for (const url of expectedPolicyUrls) {
    assert.equal(
      urls.filter((candidate) => candidate === url).length,
      1,
      `${url} must appear in one Markdown link`,
    );
  }

  for (const forbidden of [
    /\bTikTok\b/i,
    /\.22\b/,
    /\b(?:CapCut|Insta360|DaVinci Resolve)\b/i,
    /\b(?:all data (?:stays|remains) on-device|no data leaves your device|completely offline|100% secure|no third parties)\b/i,
    /\b(?:WinMSS|PDF import|all scoring systems|automatic hit detection)\b/i,
  ]) {
    assert.doesNotMatch(llms, forbidden);
  }
  assert.doesNotMatch(sitemap, /llms\.txt/i);
});

test("English product facts distinguish free one-destination sharing from Pro multi-platform sharing", async () => {
  const root = await copyCurrentSite();
  const requiredFacts = [
    "one supported sharing destination at a time",
    "Pro enables multi-platform sharing",
  ];
  const requiredFiles = [
    "index.html",
    "faq.html",
    "competitive-shooting-video-editor/index.html",
    "support.html",
    "llms.txt",
  ];

  for (const relativePath of requiredFiles) {
    const source = await readFile(path.join(root, relativePath), "utf8");
    for (const requiredFact of requiredFacts) {
      assert.ok(
        source.includes(requiredFact),
        `${relativePath} must state the verified sharing boundary: ${requiredFact}`,
      );
    }
  }
});

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

test("rejects a visible zh-Hans language switch on an English public page", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<li><a href="#about">About</a></li>',
    '<li><a href="#about">About</a></li><li><a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a></li>',
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /index\.html:\d+ English public pages must not expose a visible zh-Hans language switch/i,
  );
});

test("allows a non-rendered zh-Hans anchor on an English public page", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<li><a href="#about">About</a></li>',
    '<li><a href="#about">About</a></li><li><a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans" style="display:none!important">Chinese</a></li>',
  );
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("allows a zh-Hans anchor hidden by an ancestor", async () => {
  const root = await copyCurrentSite();
  const languageSwitch =
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>';
  await replaceInFile(
    root,
    "index.html",
    '<li><a href="#about">About</a></li>',
    `<li><a href="#about">About</a></li><div style="visibility:hidden !important">${languageSwitch}</div>`,
  );
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("allows a commented zh-Hans anchor", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<li><a href="#about">About</a></li>',
    '<li><a href="#about">About</a></li><!-- <a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a> -->',
  );
  const result = runValidator(root);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("allows zh-Hans anchors inside script or style elements", async () => {
  const languageSwitch =
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>';
  for (const element of ["script", "style"]) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "index.html",
      '<li><a href="#about">About</a></li>',
      `<li><a href="#about">About</a></li><${element}>${languageSwitch}</${element}>`,
    );
    const result = runValidator(root);
    assert.equal(result.status, 0, `${element}\n${result.stdout}\n${result.stderr}`);
  }
});

test("allows browser-hidden zh-Hans anchor variants", async () => {
  const languageSwitch =
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>';
  const variants = [
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans" aria-hidden="tr&#117;e">Chinese</a>',
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans" style="display&colon;none">Chinese</a>',
    '<a href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans" style="display:/**/none">Chinese</a>',
    '<style>.review-hide { display: none; }</style><a class="review-hide" href="https://shootingcut.cn/" hreflang="zh-Hans" lang="zh-Hans">Chinese</a>',
    `<textarea>${languageSwitch}</textarea>`,
    `<div hidden/>${languageSwitch}</div>`,
    `<dialog>${languageSwitch}</dialog>`,
  ];

  for (const variant of variants) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "index.html",
      '<li><a href="#about">About</a></li>',
      `<li><a href="#about">About</a></li>${variant}`,
    );
    const result = runValidator(root);
    assert.equal(result.status, 0, `${variant}\n${result.stdout}\n${result.stderr}`);
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

test("does not let hidden CSS or an unclosed comment satisfy required labels", async () => {
  for (const replacement of [
    '<style>.review-hide { display: none; }</style><span class="review-hide"> or simply “Improve”</span>',
    '<!--\n or simply “Improve”',
  ]) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "privacy.html",
      " or simply “Improve”",
      replacement,
    );
    const result = runValidator(root);
    assertRejected(
      result,
      /privacy\.html:\d+ must list the actual detection-improvement control labels/i,
    );
  }
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
    "ShootingCut 1.1.4 does not offer TikTok video direct upload.",
    "ShootingCut 1.1.4 does not offer TikTok video direct upload. TikTok direct upload is supported.",
  );
  const result = runValidator(root);
  assertRejected(
    result,
    /privacy\.html:\d+ TikTok direct-upload or integration claim/i,
  );
});

test("does not let a negative clause excuse a contradictory clause", async () => {
  const legalSentence =
    "ShootingCut 1.1.4 does not offer TikTok video direct upload.";
  const variants = [
    "TikTok direct upload is supported, but ShootingCut does not currently offer TikTok video direct upload.",
    "ShootingCut does not currently offer TikTok video direct upload — however, TikTok direct upload is supported.",
  ];

  for (const variant of variants) {
    const root = await copyCurrentSite();
    await replaceInFile(root, "privacy.html", legalSentence, variant);
    const result = runValidator(root);
    assertRejected(
      result,
      /privacy\.html:\d+ TikTok direct-upload or integration claim/i,
    );
  }
});

test("scans facts that remain visually rendered inside inert or aria-hidden content", async () => {
  for (const attribute of ["inert", 'aria-hidden="true"']) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "index.html",
      '<section class="hero" id="home">',
      `<section class="hero" id="home"><p ${attribute}>No data leaves your device. TikTok direct upload is supported.</p>`,
    );
    const result = runValidator(root);
    const output = `${result.stdout}\n${result.stderr}`;
    assert.equal(result.status, 1, output);
    assert.match(output, /absolute privacy claim/i);
    assert.match(output, /TikTok direct-upload or integration claim/i);
  }
});

test("follows browser comment and optional paragraph-closing semantics", async () => {
  const variants = [
    '<section class="hero" id="home"><!-- <script> --><p>TikTok direct upload is supported.</p>',
    '<section class="hero" id="home"><p>Tik<!-- marker --!>Tok direct upload is supported.</p>',
    '<section class="hero" id="home"><p hidden>Hidden filler<p>TikTok direct upload is supported.</p>',
  ];

  for (const variant of variants) {
    const root = await copyCurrentSite();
    await replaceInFile(
      root,
      "index.html",
      '<section class="hero" id="home">',
      variant,
    );
    const result = runValidator(root);
    assertRejected(
      result,
      /index\.html:\d+ TikTok direct-upload or integration claim/i,
    );
  }
});

test("rejects protected facts split across adjacent visible blocks", async () => {
  const root = await copyCurrentSite();
  await replaceInFile(
    root,
    "index.html",
    '<section class="hero" id="home">',
    '<section class="hero" id="home"><p>No data</p><p>leaves your device.</p><p>TikTok direct</p><p>upload is supported.</p><p>Stage Mix supports</p><p>3+ inputs.</p>',
  );
  const result = runValidator(root);
  const output = `${result.stdout}\n${result.stderr}`;
  assert.equal(result.status, 1, output);
  assert.match(output, /absolute privacy claim/i);
  assert.match(output, /TikTok direct-upload or integration claim/i);
  assert.match(output, /stale Stage Mix input-count claim/i);
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
