# Shooting Cut English GEO Post-Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the newly launched English `shootingcut.com` site into a measurable, evidence-led GEO surface without making the Chinese site or China App Store availability a dependency.

**Architecture:** Keep the existing static GitHub Pages architecture and its 18 English sitemap routes. First make the visible English experience consistent, then establish Google/Bing and generative-answer baselines, and only then enrich existing high-intent pages with verified media and data-led copy changes. Search Console and Bing remain the indexing sources of truth; Agent Reach is used for read-only source discovery across the web, YouTube, Facebook, and Reddit.

**Tech Stack:** Static HTML/CSS, JSON-LD, XML sitemap, Node.js site validator, Node test runner, GitHub Actions, GitHub Pages, Google Search Console, Bing Webmaster Tools, Agent Reach, OpenCLI, yt-dlp.

## Global Constraints

- Scope is the English site `https://shootingcut.com/` and English-language App Store availability.
- Do not make `shootingcut.cn`, Chinese content, or China App Store availability a blocker for this plan.
- Do not add new English routes before indexing and query evidence shows a missing intent that the existing 13 guide pages cannot answer.
- Do not add competitor/product comparisons unless an observed English query explicitly requires a comparison answer.
- Keep product positioning centered on the complete video editor: Auto Trim, Merge, Split Sync, Stage Mix, Reframe/Track, batch export, subtitles, result import, and official PractiScore timing.
- Preserve the verified 1.1.3 facts: one subscription covers the subscriber's Apple devices; `.22` is supported; detection can be affected by AGC, neighboring shots, echo/reverb, and weak timer beeps.
- Preserve the verified privacy boundary: core video/audio analysis, editing, export, and person tracking run on device; iCloud and connected services follow their documented boundaries; optional improvement data is user-controlled and pseudonymous rather than anonymous.
- Do not install analytics or advertising scripts during the baseline phase.
- Do not commit Search Console, Bing, Google, Microsoft, OpenCLI, or browser credentials, cookies, tokens, account identifiers, or private raw exports.
- Keep existing canonical and machine-readable `hreflang` metadata unless a separate technical review explicitly decides otherwise. Removing visible language navigation does not authorize removing alternate metadata.
- All website code/content batches must pass the repository validator, validator regression tests, sitemap XML validation, and `git diff --check`.
- Each completed website batch must use an English commit message and be pushed to `main`; verify the matching GitHub Pages deployment SHA before marking it complete.
- Use inline execution by default. Do not dispatch subagents unless the user explicitly authorizes subagent/team execution.

---

## File Structure

- `index.html`: English homepage, guide hub, existing official YouTube demonstrations, and homepage JSON-LD.
- `assets/content.css`: shared layout for the 13 guide pages and four policy/support pages.
- `*/index.html`: the 13 independent English GEO guides.
- `faq.html`, `privacy.html`, `support.html`, `terms.html`: English policy and support surfaces.
- `sitemap.xml`: the 18 English public URLs and their canonical/alternate discovery data.
- `robots.txt`: crawler discovery for the English sitemap.
- `llms.txt`: concise machine-readable English product and route summary.
- `scripts/validate-site.mjs`: public-page, product-fact, metadata, JSON-LD, link, sitemap, and privacy validation.
- `scripts/validate-site.test.mjs`: validator regression suite.
- `docs/geo-content-strategy.md`: research handoff and historical release record.
- `docs/geo-english-measurement.md`: new public methodology, fixed query set, dated index counts, citation samples, and decision log; it must never contain account secrets or cookies.
- `docs/geo-english-media-brief.md`: new capture brief for real 1.1.3 screenshots or recordings that are not already available on the official YouTube channel.
- `/Users/wangtao/DevProject/Shooting_Cut/docs/manual/Shooting_Cut_User_Manual.md`: explicitly outside this plan because it belongs to a different private repository whose worktree currently contains unrelated user changes.

---

### Task 1: Make Every Visible English-Site Navigation Surface English-Only

**Files:**
- Modify: `faq.html`
- Modify: `privacy.html`
- Modify: `support.html`
- Modify: `terms.html`
- Modify: `competitive-shooting-video-editor/index.html`
- Modify: `on-device-shooting-video-editor/index.html`
- Modify: `auto-trim-shooting-match-video/index.html`
- Modify: `sync-two-shooting-videos-by-timer-beep/index.html`
- Modify: `edit-multi-camera-shooting-video/index.html`
- Modify: `shot-detection-troubleshooting/index.html`
- Modify: `reframe-landscape-shooting-video-for-social-media/index.html`
- Modify: `merge-uspsa-stage-videos/index.html`
- Modify: `side-by-side-shooting-video-comparison/index.html`
- Modify: `batch-export-match-videos/index.html`
- Modify: `import-practiscore-ess-hdp-match-results/index.html`
- Modify: `thailand-hdp-ess-match-results/index.html`
- Modify: `add-shot-times-and-scores-to-match-video/index.html`
- Modify: `assets/content.css`
- Modify: `sitemap.xml`
- Modify: `scripts/validate-site.mjs`
- Test: `scripts/validate-site.test.mjs`
- Modify: `docs/geo-content-strategy.md`

**Interfaces:**
- Consumes: the current English-page navigation markup and the existing `validateLanguageSwitch(page)` validation path.
- Produces: English-only visible navigation across all 18 public English pages while retaining canonical and `<link rel="alternate" hreflang="zh-Hans">` metadata.

- [ ] **Step 1: Write a validator regression test that rejects a visible Chinese language control**

Add a focused test that injects a visible `zh-Hans` anchor into the English homepage and expects the validator to reject it:

```js
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
```

- [ ] **Step 2: Run the focused regression test and verify it fails**

Run:

```bash
node --test --test-name-pattern="rejects a visible zh-Hans" scripts/validate-site.test.mjs
```

Expected: FAIL because the current validator still requires or accepts visible language-switch controls.

- [ ] **Step 3: Replace the visible-language-switch requirement with an English-only rule**

In `scripts/validate-site.mjs`, replace `validateLanguageSwitch(page)` with a validator that:

1. scans visible anchor elements;
2. identifies anchors whose `hreflang` is `zh-Hans`;
3. ignores anchors that are genuinely non-rendered by the parser's existing visibility helpers;
4. reports `English public pages must not expose a visible zh-Hans language switch`;
5. leaves `validateLocaleMetadata` unchanged so canonical and alternate metadata remain required and exact.

Call the new validator for every non-OAuth English public page.

- [ ] **Step 4: Remove visible `Chinese` controls from the 17 remaining pages**

Delete only the rendered navigation anchors or wrappers that display `Chinese`. Do not delete head-level alternate links, canonical URLs, sitemap alternates, or JSON-LD.

- [ ] **Step 5: Remove the unused shared language-switch CSS**

Delete `.nav-links .language-switch` declarations from `assets/content.css` after confirming `rg -n "language-switch"` has no remaining visible HTML consumer.

- [ ] **Step 6: Update affected sitemap dates and the handoff decision**

Set `<lastmod>` for each actually modified English public URL to the deployment date. Add a dated note to `docs/geo-content-strategy.md` that:

- visible `.com` navigation is English-only;
- machine-readable alternate metadata remains;
- `.cn` remediation and China App Store availability are deferred.

- [ ] **Step 7: Run the full site validation**

Run:

```bash
node scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
xmllint --noout sitemap.xml
git diff --check
```

Expected: all commands exit 0; no visible `Chinese` navigation remains in public English HTML.

- [ ] **Step 8: Commit, push, and verify production**

Run:

```bash
git add faq.html privacy.html support.html terms.html \
  competitive-shooting-video-editor on-device-shooting-video-editor \
  auto-trim-shooting-match-video sync-two-shooting-videos-by-timer-beep \
  edit-multi-camera-shooting-video shot-detection-troubleshooting \
  reframe-landscape-shooting-video-for-social-media merge-uspsa-stage-videos \
  side-by-side-shooting-video-comparison batch-export-match-videos \
  import-practiscore-ess-hdp-match-results thailand-hdp-ess-match-results \
  add-shot-times-and-scores-to-match-video assets/content.css sitemap.xml \
  scripts/validate-site.mjs scripts/validate-site.test.mjs \
  docs/geo-content-strategy.md
git commit -m "Remove visible Chinese links from English site"
git push origin main
```

Expected: `Validate site` and GitHub Pages succeed for the commit; a production fetch of every HTML route contains no visible `>Chinese</a>` control.

---

### Task 2: Create the English GEO Measurement Contract

**Files:**
- Create: `docs/geo-english-measurement.md`
- Modify: `docs/geo-content-strategy.md`

**Interfaces:**
- Consumes: the 18 sitemap URLs and the 13 guide routes already published.
- Produces: one fixed English query set and a dated record format used by Search Console, Bing, generative-answer sampling, and later content decisions.

- [ ] **Step 1: Create the measurement document with fixed fields**

Start `docs/geo-english-measurement.md` with these sections and tables:

```markdown
# Shooting Cut English GEO Measurement

## Scope

- Domain: https://shootingcut.com/
- Search language: English
- App market: currently available non-China App Store markets
- Excluded: shootingcut.cn, Chinese queries, China App Store

## Indexing baseline

| Checked at (UTC) | Surface | Sitemap status | Discovered URLs | Indexed URLs | Errors | Evidence note |
|---|---|---:|---:|---:|---|---|

## Query and citation samples

| Checked at (UTC) | Surface | Market | Query | Site/page present | Cited URL | Factual error | Notes |
|---|---|---|---|---|---|---|---|

## Page decisions

| Review date | Route | Evidence state | Decision | Exact change or no-change reason |
|---|---|---|---|---|
```

- [ ] **Step 2: Add the fixed English query matrix**

Record these queries exactly so week 0, 2, 4, and 8 samples remain comparable:

```text
competitive shooting video editor
USPSA match video editor
IPSC match video editor
edit a shooting match video
automatically trim a shooting match video
sync two shooting videos by timer beep
edit a multi-camera shooting stage video
merge USPSA stage videos into one full match
turn a landscape shooting video into a vertical reel
compare two shooting runs side by side
batch export match videos on Mac
import PractiScore results into a shooting video
add official shot times and scores to a shooting video
preserve HDP ESS Thailand match results
on-device shooting video editor
private shooting video editor for iPhone
```

- [ ] **Step 3: Add sampling rules**

Document that every generative-answer sample must use:

- a new non-personalized conversation where available;
- the exact query text;
- the date, surface, market/language setting, cited URL, and factual errors;
- three repetitions before treating an answer pattern as stable;
- no claim that a single answer equals ranking.

- [ ] **Step 4: Add the evidence-state decision rules**

Use these exact states:

```text
not discovered
discovered but not crawled
crawled but not indexed
indexed with no observed impressions
impressions with weak click-through
cited accurately
cited with factual error
```

Map them to actions:

- `not discovered` or `discovered but not crawled`: inspect sitemap, robots, status, and internal links;
- `crawled but not indexed`: inspect uniqueness, visible evidence, and canonical selection;
- `indexed with no observed impressions`: wait for the scheduled sample unless external query evidence shows a content gap;
- `impressions with weak click-through`: revise title, description, and opening answer;
- `cited accurately`: preserve the page and avoid unnecessary rewriting;
- `cited with factual error`: correct the opening answer, FAQ, and matching structured data together.

- [ ] **Step 5: Link the measurement contract from the main handoff**

Add an English-first post-launch note and a relative link to `docs/geo-english-measurement.md` in `docs/geo-content-strategy.md`.

- [ ] **Step 6: Review for secrets and commit**

Run:

```bash
rg -n -i "cookie|authorization:|api[_ -]?key|client_secret|access_token|refresh_token" \
  docs/geo-english-measurement.md
git diff --check
```

Expected: the document contains methodology words only, not credential values.

Commit:

```bash
git add docs/geo-english-measurement.md docs/geo-content-strategy.md
git commit -m "Add English GEO measurement contract"
git push origin main
```

---

### Task 3: Establish Google and Bing Indexing Baselines

**Files:**
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: `https://shootingcut.com/sitemap.xml`, the verified 18-route sitemap, and an authenticated Google/Microsoft browser session supplied by the user.
- Produces: dated sitemap, discovery, indexing, and URL-inspection evidence without adding analytics code.

- [ ] **Step 1: Verify the Google Search Console property**

Open Google Search Console in the user's authenticated browser and select the `shootingcut.com` domain property. If it does not exist, create a Domain property and pause only for the minimum DNS ownership action that requires the user's domain-account authority.

Expected: the property is owner-verified. Never paste the verification token into chat, logs, or repository files.

- [ ] **Step 2: Submit the English sitemap**

In the Sitemaps report, submit:

```text
https://shootingcut.com/sitemap.xml
```

Expected: Search Console reports `Success`. Record submission/read time, discovered URL count, and errors in `docs/geo-english-measurement.md`.

- [ ] **Step 3: Run a limited Google URL Inspection sample**

Use live inspection for:

```text
https://shootingcut.com/
https://shootingcut.com/competitive-shooting-video-editor/
https://shootingcut.com/auto-trim-shooting-match-video/
https://shootingcut.com/sync-two-shooting-videos-by-timer-beep/
https://shootingcut.com/edit-multi-camera-shooting-video/
https://shootingcut.com/reframe-landscape-shooting-video-for-social-media/
https://shootingcut.com/merge-uspsa-stage-videos/
https://shootingcut.com/import-practiscore-ess-hdp-match-results/
```

Expected: crawl allowed, page fetch successful, and indexing allowed. Request indexing only for these representative URLs when they are not already indexed; use the sitemap for the full route set because Search Console has daily request limits.

- [ ] **Step 4: Verify Bing Webmaster Tools**

Use Bing Webmaster Tools in the user's authenticated browser. Import the verified Search Console property when offered, or verify `shootingcut.com` directly, then submit the same sitemap.

Expected: the site and sitemap are accepted. Record discovered/indexed counts and errors separately from Google.

- [ ] **Step 5: Record only non-secret results**

Update the indexing table with counts, state, and date. Do not commit screenshots containing account email, property ownership tokens, or unrelated properties.

- [ ] **Step 6: Commit the baseline record**

Run:

```bash
git diff --check
git add docs/geo-english-measurement.md
git commit -m "Record English search indexing baseline"
git push origin main
```

---

### Task 4: Smoke-Test English Research Channels and Capture Week-0 Query Evidence

**Files:**
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: Agent Reach, OpenCLI's existing Chrome bridge, yt-dlp, the fixed English query matrix, and user-established browser login sessions.
- Produces: a reproducible week-0 source-language and generative-citation sample. It does not produce market-opportunity or competitor-positioning claims.

- [ ] **Step 1: Run Agent Reach doctor with its absolute user-level path**

Run:

```bash
/Users/wangtao/.local/bin/agent-reach doctor --json
```

Expected: web/Jina and YouTube/yt-dlp are usable. Treat Facebook and Reddit as unverified until their real read-only commands succeed.

- [ ] **Step 2: Smoke-test Facebook through OpenCLI**

Run:

```bash
/opt/homebrew/bin/opencli facebook search "USPSA match video" -f yaml
```

Expected: structured search results and no login error. Do not log or export browser cookies. If it reports a login requirement, ask the user to refresh `facebook.com` in the already connected Chrome profile and retry once.

- [ ] **Step 3: Smoke-test Reddit through OpenCLI**

Run:

```bash
/opt/homebrew/bin/opencli reddit search "USPSA video editing" -f yaml
```

Expected: structured results and no login error. If unavailable, record Reddit as unavailable for that dated sample instead of inventing anonymous API access.

- [ ] **Step 4: Capture a bounded YouTube title-language sample**

Run:

```bash
/opt/homebrew/bin/yt-dlp --dump-json "ytsearch5:USPSA full match video"
/opt/homebrew/bin/yt-dlp --dump-json "ytsearch5:IPSC full match video"
/opt/homebrew/bin/yt-dlp --dump-json "ytsearch5:shooting match video editing"
```

Expected: at most 15 results. Summarize recurring English wording such as `Full Match`, `All Stages`, `POV`, `Stage Mix`, or other directly observed phrases; do not infer product demand from titles alone.

- [ ] **Step 5: Sample Facebook and Reddit with a bounded query set**

Use no more than these three queries per available platform:

```text
USPSA match video
IPSC full match video
shooting match video editing
```

For each sample, record query, date, result URL, directly stated workflow language, and the evidence limitation. Facebook is an important source in this sample, not a secondary afterthought.

- [ ] **Step 6: Record the Exa limitation without blocking the plan**

Record that the free Exa MCP endpoint returned HTTP 429 on 2026-07-30. Do not repeat large Exa requests and do not require an Exa API key for the Google/Bing/YouTube/OpenCLI baseline.

- [ ] **Step 7: Sample generative answers**

Run the fixed query set in new English sessions across the available answer surfaces. For each query, record:

- whether Shooting Cut appears;
- the cited URL;
- whether the answer describes Shooting Cut as a full video editor rather than a gunshot-caption-only tool;
- any incorrect input limits, subscription scope, privacy claims, `.22` claims, or App Store availability claims.

- [ ] **Step 8: Commit summarized evidence only**

Run:

```bash
rg -n -i "cookie|authorization:|api[_ -]?key|client_secret|access_token|refresh_token" \
  docs/geo-english-measurement.md
git diff --check
git add docs/geo-english-measurement.md
git commit -m "Record English GEO discovery baseline"
git push origin main
```

Expected: only summarized public evidence is committed; raw session data and credentials are absent.

---

### Task 5: Verify English App Store and Website Fact Parity

**Files:**
- Modify: `docs/geo-english-measurement.md`
- Conditionally modify: `index.html`
- Conditionally modify: `faq.html`
- Conditionally modify: `competitive-shooting-video-editor/index.html`
- Conditionally modify: `llms.txt`
- Conditionally modify: every English page containing the specific stale fact found by the audit.
- Conditionally modify: `sitemap.xml`
- Conditionally modify: `scripts/validate-site.mjs`
- Conditionally test: `scripts/validate-site.test.mjs`

**Interfaces:**
- Consumes: the current non-China English App Store listing, Apple's lookup response, and the verified 1.1.3 product-source audit.
- Produces: a dated fact-parity record and, only when evidence shows a mismatch, one consistent English-site correction batch.

- [ ] **Step 1: Fetch the current US English App Store metadata**

Run:

```bash
curl -fsSL "https://itunes.apple.com/lookup?id=6761160281&country=us" |
  jq '.results[0] | {
    trackId,
    trackName,
    version,
    minimumOsVersion,
    currentVersionReleaseDate,
    trackViewUrl,
    description
  }'
```

Expected: one result for App ID `6761160281`. Do not query or make claims about China App Store availability in this task.

- [ ] **Step 2: Inventory matching website facts**

Run:

```bash
rg -n '1\\.1\\.3|iOS 26|iPadOS 26|macOS 26|App Store|subscription|Free|Pro' \
  --glob '*.html' llms.txt
```

Compare only facts that Apple exposes directly or that the verified product source establishes. Do not infer current price, trial availability, or regional availability from a different storefront.

- [ ] **Step 3: Record a dated parity table**

Add:

```markdown
## English App Store parity

| Checked at (UTC) | Field | App Store value | Website value | State | Action |
|---|---|---|---|---|---|
```

Required fields:

```text
App ID
product name
version
release date
minimum OS requirement
English App Store destination
Free/Pro wording
one-subscription device scope
direct upload destinations
```

- [ ] **Step 4: Write a failing test only when a website mismatch exists**

For a confirmed mismatch, add a regression assertion for the exact corrected fact before editing visible content. Run the focused test and verify it fails for the stale value.

- [ ] **Step 5: Correct every occurrence of the confirmed stale fact**

Update visible text, JSON-LD, `llms.txt`, and validator constants together. Do not change unrelated copy. Update sitemap `<lastmod>` only for the public pages actually changed.

- [ ] **Step 6: Validate and commit the audit or correction**

Run:

```bash
node scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
xmllint --noout sitemap.xml
git diff --check
```

If no mismatch exists, commit only the dated measurement record:

```bash
git add docs/geo-english-measurement.md
git commit -m "Record English App Store parity baseline"
git push origin main
```

If a mismatch is corrected, stage only the measurement record and exact affected website/test files, then commit:

```bash
git commit -m "Align English site with current App Store facts"
git push origin main
```

---

### Task 6: Add Existing Official Workflow Videos to the Matching English Guides

**Files:**
- Modify: `assets/content.css`
- Modify: `sync-two-shooting-videos-by-timer-beep/index.html`
- Modify: `edit-multi-camera-shooting-video/index.html`
- Modify: `reframe-landscape-shooting-video-for-social-media/index.html`
- Modify: `sitemap.xml`
- Modify: `scripts/validate-site.mjs`
- Test: `scripts/validate-site.test.mjs`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: official videos already embedded on the homepage and their live yt-dlp metadata.
- Produces: visible, accessible workflow evidence on the exact guide pages that answer Split Sync, Stage Mix, and Reframe queries; matching `VideoObject` data is allowed only when the video is visibly present.

- [ ] **Step 1: Fetch current metadata for the exact official videos**

Run:

```bash
/opt/homebrew/bin/yt-dlp --dump-single-json --skip-download \
  "https://www.youtube.com/watch?v=oxkMd8x90B0"
/opt/homebrew/bin/yt-dlp --dump-single-json --skip-download \
  "https://www.youtube.com/watch?v=EHIiom5QjMU"
/opt/homebrew/bin/yt-dlp --dump-single-json --skip-download \
  "https://www.youtube.com/watch?v=EO-yju9mCIk"
/opt/homebrew/bin/yt-dlp --dump-single-json --skip-download \
  "https://www.youtube.com/shorts/ZO5H3u1iSR8"
```

Expected: official channel, title, upload date, duration, thumbnail, and URL are captured for review. If any video is unavailable or its visible content contradicts the guide, exclude it rather than substituting an unrelated video.

- [ ] **Step 2: Write failing media-validation tests**

Add tests that require:

- every guide iframe to use an HTTPS YouTube embed URL;
- `title`, `loading="lazy"`, and `allowfullscreen`;
- a visible caption adjacent to the iframe;
- every guide-level `VideoObject` to match a visibly embedded video on that page;
- no autoplay parameter.

Run:

```bash
node --test --test-name-pattern="guide video" scripts/validate-site.test.mjs
```

Expected: FAIL because guide-specific media validation and embeds do not yet exist.

- [ ] **Step 3: Add a responsive shared media component**

Add shared classes to `assets/content.css`:

```css
.guide-video {
    margin: 1.75rem 0;
}

.guide-video-frame {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    background: #000;
    aspect-ratio: 16 / 9;
}

.guide-video-frame iframe {
    width: 100%;
    height: 100%;
    border: 0;
}

.guide-video figcaption {
    margin-top: 0.7rem;
    color: var(--text-muted);
    font-size: 0.88rem;
}
```

- [ ] **Step 4: Embed one exact workflow demonstration on each matching guide**

Use:

- Split Sync guide: `oxkMd8x90B0`;
- Stage Mix guide: `EHIiom5QjMU`;
- Reframe guide: `EO-yju9mCIk` and `ZO5H3u1iSR8` together only when the copy explicitly explains landscape versus tracked 4:5 output.

Each iframe must include `loading="lazy"`, an English workflow-specific title, no autoplay, and a visible caption describing what the viewer can verify.

- [ ] **Step 5: Add matching `VideoObject` JSON-LD**

Use the metadata returned in Step 1. The name, description, thumbnail, upload date, content URL, and embed URL must match the visible video. Do not copy homepage descriptions if the guide needs a narrower factual description.

- [ ] **Step 6: Update sitemap dates and record the evidence improvement**

Update `<lastmod>` only for the three modified guide routes. Record that these pages changed from text-only to visible official workflow evidence.

- [ ] **Step 7: Run the full website validation**

Run:

```bash
node scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
xmllint --noout sitemap.xml
git diff --check
```

Expected: all commands exit 0 and the embedded media remains responsive at narrow viewport widths.

- [ ] **Step 8: Commit, push, and verify production**

Run:

```bash
git add assets/content.css \
  sync-two-shooting-videos-by-timer-beep/index.html \
  edit-multi-camera-shooting-video/index.html \
  reframe-landscape-shooting-video-for-social-media/index.html \
  sitemap.xml scripts/validate-site.mjs scripts/validate-site.test.mjs \
  docs/geo-english-measurement.md
git commit -m "Add workflow videos to English GEO guides"
git push origin main
```

Expected: CI and Pages succeed; live HTML includes the selected video IDs and the videos load without autoplay.

---

### Task 7: Define the Real 1.1.3 Screenshot and Recording Batch

**Files:**
- Create: `docs/geo-english-media-brief.md`
- Modify: `docs/geo-content-strategy.md`

**Interfaces:**
- Consumes: the verified 1.1.3 product, current website facts, and the absence of reusable screenshots in the product repository.
- Produces: an exact capture list for later content work; it does not add generated or placeholder UI images to the public site.

- [ ] **Step 1: Create the media brief with exact required captures**

Require these real-product captures:

```text
Mode selection: Auto Trim, Merge, Split Sync, Stage Mix
Auto Trim: timer marker, detected shots, trim boundaries, manual correction
Merge: ordered Stage 1 through Stage N clips and Full Match output
Split Sync: two synchronized inputs and a selected layout
Stage Mix: 2–3 inputs with POV, Follow, or Static roles and reviewed switches
Reframe/Track: one source shown in landscape and a supported tracked crop
Result import: PractiScore, ESS, HDP, and IDPA source selection
Official timing: PractiScore official times/splits aligned to video subtitles
Privacy control: Help Improve Gunshot Detection control and its current default
```

- [ ] **Step 2: Add media safety and authenticity requirements**

The brief must require:

- screenshots from the real 1.1.3 app, not generated UI;
- no unapproved competitor names, shooter names, match identifiers, email addresses, or account IDs;
- redaction before assets enter the web repository;
- English UI;
- captions that state only visible, verified behavior;
- source capture retained outside the public repository;
- optimized public derivative with explicit width, height, alt text, and no embedded location metadata.

- [ ] **Step 3: Define the priority order**

Use this order:

1. Auto Trim;
2. Merge;
3. PractiScore official timing overlay;
4. result import;
5. on-device/privacy control;
6. mode-selection overview.

Split Sync, Stage Mix, and Reframe use the existing official videos first.

- [ ] **Step 4: Link the media brief from the main handoff**

Add a relative link and state that page-specific screenshots are a follow-on batch, not a prerequisite for Search Console submission.

- [ ] **Step 5: Commit the brief**

Run:

```bash
git diff --check
git add docs/geo-english-media-brief.md docs/geo-content-strategy.md
git commit -m "Define English GEO media capture brief"
git push origin main
```

---

### Task 8: Run Evidence-Gated Reviews at Weeks 2, 4, and 8

**Files:**
- Modify: `docs/geo-english-measurement.md`
- Conditionally modify: only the English route files supported by recorded evidence.
- Conditionally modify: `sitemap.xml`
- Conditionally modify: `scripts/validate-site.mjs`
- Conditionally test: `scripts/validate-site.test.mjs`

**Interfaces:**
- Consumes: the fixed query matrix, GSC/Bing states, generative samples, YouTube/Facebook/Reddit source notes, and page-level media changes.
- Produces: dated keep/change decisions with no bulk near-duplicate page creation.

- [ ] **Step 1: Capture the scheduled snapshot**

At weeks 2, 4, and 8, record:

- sitemap status and discovered/indexed URL counts;
- page/query impressions, clicks, click-through rate, and average position when available;
- the fixed generative-answer sample;
- Facebook, Reddit, and YouTube source availability;
- factual errors.

- [ ] **Step 2: Classify each route using the fixed evidence states**

Every route must receive one state from Task 2 and either:

- `no change`;
- a precise title/description change;
- a precise opening-answer/FAQ change;
- an internal-link change;
- a media-evidence change;
- a technical crawl/index fix.

- [ ] **Step 3: Refuse unsupported page proliferation**

Do not create a new page when:

- the existing route already answers the query;
- the only evidence is a single model response;
- the proposed page differs only by a near-synonym;
- Facebook/Reddit/YouTube evidence shows posting language but not a distinct information need.

- [ ] **Step 4: Implement only the approved evidence-backed batch**

For every changed visible fact, update the body and matching JSON-LD together. Update sitemap `<lastmod>` only for changed public routes.

- [ ] **Step 5: Validate, commit, push, and record deployment**

Run:

```bash
node scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
xmllint --noout sitemap.xml
git diff --check
```

Use an English commit message describing the actual evidence-led change, push `main`, and record the GitHub Pages deployment SHA in `docs/geo-english-measurement.md`.

---

## Completion Criteria

- Every visible navigation surface on `shootingcut.com` is English-only.
- Canonical English URLs and machine-readable discovery metadata remain valid.
- Google Search Console and Bing Webmaster Tools have dated sitemap/index baselines for `shootingcut.com`.
- The fixed 16-query English matrix has week-0, 2, 4, and 8 records.
- Facebook is explicitly sampled when its OpenCLI read command succeeds; failure is recorded rather than silently omitted.
- Exa HTTP 429 does not block the baseline.
- Split Sync, Stage Mix, and Reframe guides contain visible official workflow evidence with matching metadata.
- No new route is created without recorded query evidence.
- No analytics, ad scripts, credentials, cookies, or private account exports are added.
- Every website change passes validator, regression, XML, diff, CI, Pages, and live-SHA verification.

## Explicitly Deferred Work

- `shootingcut.cn`, Chinese queries, China App Store availability, and `.cn` HTTPS are not part of this English-site plan.
- The private English user manual is not modified here. A read-only audit found that its header still says `Last Updated: 2026-04-01` and that it contains stale iOS/iPadOS requirements, TikTok upload claims, Free/Pro boundaries, `anonymous` improvement-data wording, and screenshot placeholders. Because the product repository is separate and currently contains an unrelated user modification, its manual refresh requires its own implementation plan and commit series.
