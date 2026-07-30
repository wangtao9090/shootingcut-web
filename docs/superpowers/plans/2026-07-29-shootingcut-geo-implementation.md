# Shooting Cut GEO Implementation Plan

> Approved for execution on 2026-07-29. Work on `codex/geo-optimization`, validate every logical batch, push the branch after every commit, and merge to `main` only after the whole site passes review.

## Global Constraints

- Treat the current 1.1.3 product source and live App Store metadata as the product truth. The in-app help/manual is stale and may only be used to locate code.
- Position Shooting Cut as a competitive-shooting video editor with analysis and score-aware workflows, not as a gunshot-subtitle utility.
- Do not name or compare competing products on public marketing, FAQ, structured-data, or guide pages. Competitor evidence may remain in internal `docs/`.
- Public modes are:
  - Auto Trim: exactly 1 video.
  - Merge: up to 20 videos.
  - Split Sync: exactly 2 videos, with Full Screen, Dual Center HUD, Dual Top HUD, and Side by Side layouts.
  - Stage Mix: 2–3 videos labeled POV, Follow, or Static; automatic movement-aware switching with manual override.
- Do not advertise Strings mode in 1.1.3. Do not advertise TikTok direct upload. YouTube and Facebook direct upload are supported.
- Use “one subscription covers all your Apple devices,” never “one purchase,” “lifetime,” or a one-time-purchase promise.
- Free facts: Auto Trim and score import are free. Free Auto Trim exports include the Shooting Cut watermark and logo intro card.
- Pro facts safe to publish: removes the Shooting Cut watermark, enables custom intro cards, unlocks Split Sync and Stage Mix, and enables macOS batch export. Do not state a Free/Pro boundary for single-platform social upload until product code and App Store copy agree.
- Supported export resolutions are Original, 4K, 1080p, and 720p. Supported ratios are Source, 9:16, 3:4, 4:5, 6:7, 1:1, and 16:9.
- Score facts: PractiScore official per-shot anchoring is supported. ESS, PractiScore, and HDP/IDPA score import paths exist; ESS has 41 configured regions. Do not claim arbitrary PDF support or promise WinMSS support.
- Troubleshooting may discuss AGC, neighboring gunshots, echo/reverb, weak timer beeps, detection sensitivity, timer-marker adjustment, adding/removing shots, setting the last shot, and minimum-split adjustment. Do not mention `.22` as a limitation.
- Privacy wording must distinguish:
  - video/audio editing and person tracking run on device;
  - original footage is not uploaded to a Shooting Cut processing server;
  - Photos/iCloud Photos and iCloud Drive behavior is controlled by Apple and the user’s settings;
  - app metadata can sync through the user’s iCloud key-value store, including aliases, perspectives, gun type, score associations, imported match records, and the shooter/match fields contained in those records; original media, PCM audio, and person-tracking paths do not use KVS;
  - RevenueCat receives subscription identifiers/status;
  - limited, pseudonymous detection-quality telemetry is enabled by default but can be disabled, and sends derived detection/timing/spectral fields, random session/analysis identifiers, and correction events to CloudKit rather than original media; disabling stops new reports and queued retries while disabled but does not erase data already submitted or the local retry queue;
  - score import and user-initiated YouTube/Facebook uploads use the network.
- Never claim “100% secure,” “all data never leaves the device,” “fully offline for every feature,” “no analytics,” “no third parties,” or that all video sync happens through Shooting Cut’s own iCloud mechanism.
- Every English public page must have a Chinese counterpart under `/zh/`; canonical and reciprocal `hreflang` links must agree.
- Every content page starts with a standalone answer paragraph and includes specific inputs, output, workflow steps, limitations, Free/Pro boundary where verified, and an updated date.
- Content pages use `Article`, `HowTo` where appropriate, and `BreadcrumbList` JSON-LD. JSON-LD must parse as strict JSON.
- GitHub Pages remains the host. Preserve `CNAME`, root-based paths, HTTPS URLs, and the `main`/root Pages source.

## Task 1: Add automated site validation and correct the public factual baseline

**Files**

- Create: `scripts/validate-site.mjs`
- Create: `.github/workflows/validate-site.yml`
- Modify: `index.html`
- Modify: `zh/index.html`
- Modify: `faq.html`
- Modify: `faq-zh.html`
- Modify: `og-image.svg`

**Requirements**

1. Add a dependency-free Node validator that:
   - discovers public HTML files outside `.git`, `.worktrees`, `.superpowers`, and `docs`;
   - parses every `application/ld+json` block with `JSON.parse`;
   - verifies local `href`, `src`, and `poster` targets;
   - verifies canonical links and English/Chinese reciprocal `hreflang` pairs;
   - verifies sitemap entries resolve to local pages;
   - rejects public competitor names, stale Stage Mix “3+” wording, one-purchase/lifetime wording, Strings-mode claims, TikTok direct-upload claims, and absolute privacy claims listed in Global Constraints;
   - emits actionable file/line errors and exits non-zero on failure.
2. Add a GitHub Actions workflow for pull requests and pushes that runs the validator and `xmllint --noout sitemap.xml`.
3. Rewrite homepage and FAQ facts to match Global Constraints.
4. Remove every public competitor comparison and replace it with answer-first product/workflow explanations.
5. Reframe the product as a full competitive-shooting video editor. Keep scores as a useful editing/review input, not a separate market thesis.
6. Use accurate local-processing/privacy copy with a link to the privacy page.
7. Update the social image copy from generic “Smart Video Analysis” to the broader video-editing position and remove duplicate branding if present.
8. Run `node scripts/validate-site.mjs`, `xmllint --noout sitemap.xml`, and `git diff --check`.
9. Commit in English and push `codex/geo-optimization`.

## Task 2: Repair crawlability, locale metadata, legal/privacy accuracy, and support facts

**Files**

- Modify: `robots.txt`
- Modify: `sitemap.xml`
- Modify: `privacy.html`
- Modify: `privacy-zh.html`
- Modify: `terms.html`
- Modify: `terms-zh.html`
- Modify: `support.html`
- Modify: `support-zh.html`
- Modify: all existing public HTML pages as needed for canonical and `hreflang`

**Requirements**

1. Add canonical, `en`, `zh-Hans`, and `x-default` links to every existing page and make locale pairs reciprocal.
2. Keep search crawling rules separate from any AI-training opt-out language; do not accidentally block discovery crawlers.
3. Correct privacy and terms text to the precise data flow in Global Constraints.
4. State that original footage is not sent to a Shooting Cut processing server while documenting Apple storage/download behavior, RevenueCat, derived CloudKit telemetry and its disable control, score-fetch network access, and user-initiated social upload.
5. Preserve the existing TikTok legal disclosure and OAuth callback route, as previously decided, while making clear outside the legal disclosure that TikTok is not a currently available direct-upload feature.
6. Correct support feature/platform/plan facts.
7. Ensure sitemap dates and URLs match the actual public files.
8. Run the validator, XML validation, local HTTP link smoke checks, and `git diff --check`.
9. Commit in English and push the branch.

## Task 3: Create the bilingual GEO content foundation and positioning/privacy pages

**Files**

- Create: `assets/content.css`
- Create: `competitive-shooting-video-editor/index.html`
- Create: `zh/competitive-shooting-video-editor/index.html`
- Create: `on-device-shooting-video-editor/index.html`
- Create: `zh/on-device-shooting-video-editor/index.html`
- Modify: `index.html`
- Modify: `zh/index.html`

**Requirements**

1. Create a reusable, responsive content-page shell consistent with the current dark visual identity.
2. Publish an answer-first overview of the four real video-editing modes, exact input counts, export formats, score-aware overlays, supported devices, and verified Free/Pro boundaries.
3. Publish an accurate on-device processing and privacy explainer using the full exception model in Global Constraints.
4. Add FAQ-style questions only when the page body also answers them; add Article/Breadcrumb/HowTo JSON-LD as applicable.
5. Add contextual links from both homepages to the new pages.
6. Meet accessibility basics: semantic headings, visible keyboard focus, sufficient contrast, reduced-motion handling, useful link text.
7. Run the validator, XML validation, responsive local HTTP smoke checks, and `git diff --check`.
8. Commit in English and push the branch.

## Task 4: Publish the bilingual core workflow guides

**Files**

- Create English and Chinese page pairs for:
  - `auto-trim-shooting-match-video/`
  - `sync-two-shooting-videos-by-timer-beep/`
  - `edit-multi-camera-shooting-video/`
  - `shot-detection-troubleshooting/`

**Requirements**

1. Auto Trim: one input, timer/shot detection, adjustable padding/manual correction, free export facts.
2. Split Sync: exactly two inputs, timer-beep alignment, all four layouts, and Pro boundary.
3. Stage Mix: 2–3 inputs, POV/Follow/Static roles, movement-aware switching, manual override, and Pro boundary.
4. Troubleshooting: real recording conditions and current manual correction controls; never mention `.22`.
5. Add reciprocal locale metadata, canonical URLs, breadcrumbs, answer paragraphs, steps, limitations, and contextual links.
6. Run the validator, XML validation, HTTP smoke checks, and `git diff --check`.
7. Commit in English and push the branch.

## Task 5: Publish the bilingual advanced workflow guides

**Files**

- Create English and Chinese page pairs for:
  - `side-by-side-shooting-video-comparison/`
  - `merge-uspsa-stage-videos/`
  - `reframe-shooting-video-for-reels-shorts/`
  - `batch-export-match-videos/`
  - `add-shot-times-and-scores-to-match-video/`

**Requirements**

1. Explain how Side by Side is one Split Sync layout; do not imply a separate mode.
2. Explain Merge’s 20-video maximum without implying it auto-syncs multiple camera angles.
3. Explain on-device Vision-based reframing and the exact export ratios/resolutions without biometric or cloud-AI claims.
4. State macOS + Pro for batch export.
5. Clearly distinguish PractiScore official per-shot anchoring from ESS/HDP/IDPA score import.
6. Do not claim unsupported progress prediction, WinMSS, arbitrary PDFs, or score-system coverage.
7. Run the validator, XML validation, HTTP smoke checks, and `git diff --check`.
8. Commit in English and push the branch.

## Task 6: Complete machine-readable discovery, navigation, and GEO handoff

**Files**

- Create: `llms.txt`
- Modify: `sitemap.xml`
- Modify: all public pages needed for final contextual navigation
- Modify: `docs/geo-content-strategy.md`
- Modify: `README.md`

**Requirements**

1. Add a concise, factual `llms.txt` with product identity, current version/platforms, exact mode/input facts, privacy summary with exceptions, Free/Pro facts, and the complete public page index.
2. Add every new EN/ZH URL to the sitemap with current `lastmod`.
3. Ensure each guide is reachable from at least one hub/home page and links to relevant adjacent guides.
4. Update the handoff to record completed implementation, source-verified corrections, remaining research, and a measurement plan. Keep competitor/social research internal only.
5. Document local validation and GitHub Pages deployment in README.
6. Run the validator, `xmllint`, local HTTP smoke checks, and `git diff --check`.
7. Commit in English and push the branch.

## Task 7: Whole-site review, production merge, and live verification

**Requirements**

1. Run a broad final review against this plan and current product facts.
2. Re-run:
   - `node scripts/validate-site.mjs`
   - `xmllint --noout sitemap.xml`
   - `git diff --check origin/main...HEAD`
   - a local HTTP crawl over every sitemap URL
3. Verify no user-owned changes exist in either repository.
4. Merge the reviewed branch into `main` without rewriting history and push `main`.
5. Monitor the GitHub Pages workflow to a terminal success state.
6. Verify production HTTPS, `CNAME`, canonical URLs, `robots.txt`, `llms.txt`, sitemap, both homepages, privacy pages, and every new EN/ZH guide return 200 with correct content.
7. Deliver a concise Chinese completion report with commits, validation evidence, production URLs, source-audit corrections, and remaining measurement/research work.
