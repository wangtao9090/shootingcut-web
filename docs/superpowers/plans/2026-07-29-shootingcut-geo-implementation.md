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
- Production is split across two independent repositories and domains:
  - `/Users/wangtao/DevProject/shootingcut-web` publishes English-only content to `https://shootingcut.com`.
  - `/Users/wangtao/DevProject/shootingcut-cn` publishes Chinese-only content to `https://shootingcut.cn`.
- `shootingcut.com` must not retain `/zh/`, `*-zh.html`, Chinese content, or compatibility redirects. Those old URLs intentionally return 404.
- `shootingcut.cn` must not retain duplicate `zh/` or `*-zh.html` paths. Chinese pages use the same root-relative path shape as their English counterpart.
- The old `sync-cn.yml` workflow must be removed. The two repositories are maintained and deployed independently.
- Every English public page has a Chinese counterpart on `shootingcut.cn`; reciprocal cross-domain `hreflang` links must agree.
- Every content page starts with a standalone answer paragraph and includes specific inputs, output, workflow steps, limitations, Free/Pro boundary where verified, and an updated date.
- Content pages use `Article`, `HowTo` where appropriate, and `BreadcrumbList` JSON-LD. JSON-LD must parse as strict JSON.
- GitHub Pages remains the host. Preserve `CNAME`, root-based paths, HTTPS URLs, and the `main`/root Pages source.

## Task 1: Split the repositories and correct both factual baselines

1. First migrate the corrected Chinese pages from this branch into the Chinese repository:
   - `zh/index.html` → Chinese `index.html`
   - `faq-zh.html` → Chinese `faq.html`
   - `privacy-zh.html` → Chinese `privacy.html`
   - `support-zh.html` → Chinese `support.html`
   - `terms-zh.html` → Chinese `terms.html`
2. In the English repository, remove `zh/`, every `*-zh.html` file, and `.github/workflows/sync-cn.yml`. Do not add redirects.
3. In the Chinese repository, remove the duplicate `zh/` and every `*-zh.html` file after the root-path replacements exist.
4. Preserve the English factual corrections in `96e7f53` and the Chinese factual corrections in `ceaade5`/`fc1d48d`.
5. Publicly position Shooting Cut as a complete competitive-shooting video editor. Remove competitor comparisons and stale product/privacy claims from both sites.
6. Commit and push each repository’s branch independently.

## Task 2: Add independent validation, crawl metadata, privacy, and support

1. Adapt the dependency-free validator and CI separately in both repositories.
2. Each validator parses JSON-LD, checks local links/fragments/assets, validates sitemap locations, and blocks stale facts from Global Constraints.
3. English validation requires:
   - `lang="en"`;
   - canonical/OG/JSON-LD URLs on `https://shootingcut.com`;
   - `en` self-reference, `zh-Hans` matching `https://shootingcut.cn` path, and `x-default` English;
   - no `zh/`, `*-zh.html`, same-domain Chinese page, or Chinese sitemap URL.
4. Chinese validation requires:
   - `lang="zh-Hans"`;
   - canonical/OG/JSON-LD URLs on `https://shootingcut.cn`;
   - `zh-Hans` self-reference, `en` matching `https://shootingcut.com` path, and `x-default` English;
   - no duplicate `zh/` or `*-zh.html` page, and no English URL in the Chinese sitemap.
5. Create independent `robots.txt` and `sitemap.xml` files; each sitemap contains only its own domain.
6. Correct both privacy/terms/support sets to the precise data flow in Global Constraints. Make clear that detection-quality upload is user-controlled, currently enabled by default, excludes original audio/video, and can be disabled.
7. Preserve the `.com` OAuth callback paths. Legal TikTok disclosure may remain, but no marketing page may claim current TikTok direct upload.
8. Run validators, `xmllint`, local HTTP crawls, and diff checks; commit/push each repository independently.

## Task 3: Create the two-site GEO content foundation

Create the same root-relative paths independently in both repositories:

- `competitive-shooting-video-editor/`
- `on-device-shooting-video-editor/`

Requirements:

1. Use a shared responsive content-page shell within each repository.
2. Publish answer-first product and privacy explainers using current product facts.
3. Add reciprocal cross-domain `hreflang`, self-canonical URLs, contextual navigation, accessibility basics, and Article/Breadcrumb/HowTo JSON-LD where applicable.
4. Do not mix languages inside a site except proper product/technical names.
5. Validate, review, commit, and push each repository.

## Task 4: Publish the core workflow guides on both domains

Create the same paths independently in both repositories:

- `auto-trim-shooting-match-video/`
- `sync-two-shooting-videos-by-timer-beep/`
- `edit-multi-camera-shooting-video/`
- `shot-detection-troubleshooting/`
- `reframe-landscape-shooting-video-for-social-media/`

Requirements:

1. Auto Trim: one input, timer/shot detection, padding/manual correction, and free export facts.
2. Split Sync: exactly two inputs, timer-beep alignment, four layouts, and Pro boundary.
3. Stage Mix: 2–3 inputs, POV/Follow/Static roles, movement-aware switching, manual override, and Pro boundary.
4. Troubleshooting: AGC, neighboring gunshots, echo/reverb, weak beeps, and current manual correction controls; never mention `.22` as a limitation.
5. Reframe/Track: show how one landscape recording can be tracked on device and exported repeatedly for different publishing formats. Include Source, 9:16, 3:4, 4:5, 6:7, 1:1, and 16:9 ratios plus Original, 4K, 1080p, and 720p resolutions. Explain which modes support reframing and that Split Sync output ratio is controlled by its layout.
6. Include a practical output matrix for vertical short video, portrait feed, square feed, and landscape video. Social-platform names may be used as format examples, but never imply TikTok direct upload; current direct-upload support is YouTube and Facebook.
7. Validate reciprocal metadata and all content facts before separate commits/pushes.

## Task 5: Publish the advanced workflow guides on both domains

Create the same paths independently in both repositories:

- `side-by-side-shooting-video-comparison/`
- `merge-uspsa-stage-videos/`
- `batch-export-match-videos/`
- `add-shot-times-and-scores-to-match-video/`

Requirements:

1. Side by Side is a Split Sync layout, not a separate mode.
2. Merge accepts up to 20 videos and is not multi-camera auto-sync.
3. Batch export is macOS + Pro.
4. PractiScore supports official per-shot anchoring; distinguish this from ESS/HDP/IDPA score import.
5. Do not claim progress prediction, WinMSS, arbitrary PDFs, or unsupported score-system coverage.

## Task 6: Complete machine-readable discovery and handoff

1. Add domain-specific `llms.txt` files with current product facts and page indexes.
2. Add every local URL to only that domain’s sitemap.
3. Ensure each guide is reachable from a homepage/hub and links to relevant adjacent guides.
4. Update the English repository’s GEO handoff with the source audit, two-domain architecture, completed work, measurement plan, and remaining internal research.
5. Document independent repository validation/deployment in each README.
6. Repair `shootingcut.cn` certificate provisioning, verify the certificate covers the production hostname, then enable GitHub Pages HTTPS enforcement.

## Task 7: Whole-site review, production merge, and live verification

1. Run a broad review of both branches against this plan and current product facts.
2. Re-run both validators, both sitemap XML checks, branch diff checks, and local sitemap crawls.
3. Verify neither repository contains unowned changes.
4. Merge each reviewed branch to its own `main` without rewriting history, then push.
5. Monitor both GitHub Pages deployments and all repository workflows to terminal success.
6. Verify both production domains, HTTPS, CNAME, canonical URLs, reciprocal cross-domain `hreflang`, robots, llms, sitemaps, homepages, privacy pages, and every guide.
7. Confirm `.com/zh/` and `.com/*-zh.html` return 404 with no redirect.
8. Deliver a concise Chinese report with commits, validation evidence, production URLs, source-audit corrections, and remaining measurement work.
