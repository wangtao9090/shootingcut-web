# Shooting Cut Pain-Led English GEO Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the existing English GEO surface around the editing outcomes shooters repeatedly describe—finishing match footage without a heavy general-purpose workflow—while preserving every verified Shooting Cut 1.1.3 boundary.

**Architecture:** Keep the current static GitHub Pages site and all 18 public English routes. Add the new qualitative research as a dated evidence layer, then update only the homepage and the existing guides whose openings do not yet express the observed pain language. Keep facts, visible copy, JSON-LD, `llms.txt`, sitemap dates, tests, and the measurement record synchronized in each independently deployable batch.

**Tech Stack:** Static HTML/CSS, JSON-LD, XML sitemap, plain-text `llms.txt`, Node.js site validator, Node test runner, GitHub Actions, GitHub Pages, Google Search Console, Bing Webmaster Tools, Agent Reach, OpenCLI, and yt-dlp.

## Global Constraints

- Scope is the English site `https://shootingcut.com/`; do not modify the Chinese repository or make China App Store availability a dependency.
- Keep `competitive-shooting video editor` as the primary product phrase.
- Use task language naturally: `edit shooting match footage`, `sync POV and third-person shooting videos`, `merge every stage into one full match video`, `turn landscape shooting video into vertical video`, `add shot times and stage results`, and `batch export match videos`.
- Do not add a new route in this update. All newly observed intents map to an existing English guide.
- Do not name or compare competing products in public site copy.
- Do not describe social samples as market-size or search-volume evidence.
- Do not claim automatic bullet-hit localization. Shooting Cut can use verified timing and score data; it does not infer where a bullet struck a target.
- Keep Shooting Cut positioned as a complete editor. Timer and gunshot analysis support trimming, synchronization, timing, and subtitles; they do not define the whole product.
- Preserve the verified 1.1.3 mode limits: Auto Trim exactly 1 video, Merge up to 20 sequential clips, Split Sync exactly 2 simultaneous views, and Stage Mix 2–3 simultaneous inputs labeled POV, Follow, or Static.
- Preserve the verified detection caveats: AGC, neighboring shots, echo/reverb, and weak timer beeps can affect detection; users review and correct proposed markers.
- Preserve the verified subscription statement: one subscription covers all of the subscriber's Apple devices, subject to App Store account and entitlement rules.
- Preserve the verified privacy statement: core video/audio analysis, editing, export, and person tracking run on device; iCloud, RevenueCat, CloudKit, score import, optional improvement reports, and user-initiated uploads retain their documented network boundaries.
- Privacy is an important trust reason, but it must follow the primary editing outcome rather than replace it as the homepage headline.
- Facebook remains an important publishing and discovery channel. The current public Facebook sample supports output language such as `full and uncut POV Match Video with all the stage results`, but it does not support a broad claim about editing pain frequency.
- Do not replace the existing Q01–Q16 baseline queries. Add a separately versioned pain-language matrix so earlier samples remain comparable.
- Do not install analytics or advertising scripts.
- Every public-copy batch must update matching visible text and JSON-LD together.
- Only update sitemap `<lastmod>` values for public pages actually changed in a batch.
- Every public-copy batch must pass `node --check`, the full Node test suite, the site validator, sitemap XML validation, `git diff --check`, and a local HTTP route check.
- Use an English commit message and push each independently valid batch to `main`.
- Use inline execution by default. Do not dispatch subagents unless the user explicitly authorizes agent/team execution.

---

## File Structure

- `docs/geo-content-strategy.md`: dated qualitative research evidence, evidence strength, and no-change decisions.
- `docs/geo-english-measurement.md`: preserved Q01–Q16 baseline plus the new P01–P08 pain-language query matrix and deployment decisions.
- `docs/geo-english-media-brief.md`: real-product capture priority ordered by the newly observed editing jobs.
- `index.html`: primary positioning, homepage product hierarchy, outcome-led guide hub, and homepage JSON-LD.
- `competitive-shooting-video-editor/index.html`: complete-editor answer and pain-to-workflow map.
- `sync-two-shooting-videos-by-timer-beep/index.html`: POV/third-person synchronization and review use case.
- `reframe-landscape-shooting-video-for-social-media/index.html`: fixed-crop pain, tracked vertical output, and social publishing examples.
- `add-shot-times-and-scores-to-match-video/index.html`: understandable performance context and the explicit no-hit-localization boundary.
- `batch-export-match-videos/index.html`: repeated multi-stage export pain and the separate-output boundary.
- `merge-uspsa-stage-videos/index.html`: already matches the new `Full Match`/`Every Stage` evidence; preserve it unless a factual or indexing issue appears.
- `side-by-side-shooting-video-comparison/index.html`: already explains POV plus follow-camera review; preserve it and strengthen its inbound link from Split Sync.
- `on-device-shooting-video-editor/index.html`: keep as the detailed trust page; do not turn privacy into the primary editing keyword.
- `llms.txt`: concise machine-readable summary matching the updated visible positioning.
- `sitemap.xml`: changed-route dates only.
- `scripts/validate-site.test.mjs`: positioning and boundary regression tests.
- `scripts/validate-site.mjs`: retain current fact, link, metadata, JSON-LD, privacy, and media validation; change only if a new regression test exposes a validator gap.

---

### Task 1: Record the New Pain Evidence Without Rewriting Public Pages

**Files:**
- Modify: `docs/geo-content-strategy.md`
- Modify: `docs/geo-english-measurement.md`
- Modify: `docs/geo-english-media-brief.md`

**Interfaces:**
- Consumes: the 2026-07-30 Agent Reach/OpenCLI/yt-dlp research snapshot and the existing Q01–Q16 measurement contract.
- Produces: a durable evidence hierarchy, a non-destructive P01–P08 query matrix, and a revised real-media capture order used by later tasks.

- [x] **Step 1: Add a dated pain-point research section**

Add `## 15. 2026-07-30 射手剪辑痛点复核` to `docs/geo-content-strategy.md` with this ranked evidence model:

1. **Strong:** general-purpose editors feel too heavy for basic match trimming, splicing, split view, resizing, and export.
2. **Strong:** shooters move footage through a camera app and a second editor, repeating trim, track, export, import, assemble, and export steps.
3. **Strong:** POV and third-person footage need synchronization or a shared layout to review footwork, reloads, hard stops, movement, and stage strategy.
4. **Strong to medium:** a fixed horizontal-to-vertical crop can create blurred borders or remove useful context; the shooter needs to remain in frame.
5. **Medium:** timing, splits, shot count, stage result, and score context make a run understandable to viewers.
6. **Medium:** `Full Match`, `Every Stage`, `All Stages`, `Every Shot`, and `Full Match Recap` are real publishing outcomes.
7. **Medium, workflow inference:** repeated preparation and rendering across many stages creates a batch-work pain.
8. **Weak as a primary pain, strong as a trust reason:** local processing/privacy appeared less often than editing friction in this bounded sample.

Include direct links to these sources and state each limitation:

- `https://www.reddit.com/r/CompetitionShooting/comments/1qqqhbi/video_editing_software/`
- `https://www.reddit.com/r/CompetitionShooting/comments/1cuuh84/video_editing_tips/`
- `https://www.reddit.com/r/CompetitionShooting/comments/1o4mlbl/mixed_pov_tried_it/`
- `https://www.reddit.com/r/CompetitionShooting/comments/1racdre/how_do_you_get_insta360_go_3s_footage_vertical/`
- `https://www.reddit.com/r/CompetitionShooting/comments/1q5573b/playing_with_new_insta360_x5_competition_with/`
- `https://www.reddit.com/r/CompetitionShooting/comments/1s0ta4p/how_to_edit_uspsa_match_footage_to_show_hits/`
- `https://brian-enos-forums.com/topic/304646-match-video-editing-software/`
- `https://www.youtube.com/watch?v=OnTLFiDnQIA`
- `https://www.youtube.com/watch?v=id_XyMKyqlI`

State explicitly that Shooting Cut owner posts and product-builder promotion posts were excluded from independent pain evidence.

- [x] **Step 2: Preserve Q01–Q16 and add a separate P01–P08 matrix**

Append this exact matrix to `docs/geo-english-measurement.md`:

| ID | Pain-language query | Primary route |
|---|---|---|
| P01 | `simple video editor for shooting match footage` | `/competitive-shooting-video-editor/` |
| P02 | `edit USPSA match footage without a complicated timeline` | `/competitive-shooting-video-editor/` |
| P03 | `sync POV and third person shooting videos` | `/sync-two-shooting-videos-by-timer-beep/` |
| P04 | `turn landscape shooting video into vertical video` | `/reframe-landscape-shooting-video-for-social-media/` |
| P05 | `merge every stage into one full match video` | `/merge-uspsa-stage-videos/` |
| P06 | `add shot times and stage results to shooting video` | `/add-shot-times-and-scores-to-match-video/` |
| P07 | `batch export shooting match videos on Mac` | `/batch-export-match-videos/` |
| P08 | `private on-device shooting video editor` | `/on-device-shooting-video-editor/` |

Document that P01–P08 begin at the pain-led deployment date and must not be backfilled into the earlier Q01–Q16 Week-0 sample.

- [x] **Step 3: Record explicit no-change decisions**

Add these dated rows to the measurement decision table:

- `/merge-uspsa-stage-videos/`: preserve because its H1, answer, workflow, and publishing-language section already answer P05.
- `/side-by-side-shooting-video-comparison/`: preserve because it already explains POV/follow-camera review and manual comparison boundaries.
- `/on-device-shooting-video-editor/`: preserve as a trust-depth page; do not promote privacy above the primary editing outcome.
- `/thailand-hdp-ess-match-results/`: preserve because the new general editing research does not add a verified Thailand-specific editing pain.
- `/shot-detection-troubleshooting/`: preserve as support intent, not a homepage-defining pain.

- [x] **Step 4: Reorder the real-media capture brief**

Change `docs/geo-english-media-brief.md` priority to:

1. complete mode overview showing Auto Trim, Merge, Split Sync, and Stage Mix;
2. Merge from ordered stage clips to one Full Match output;
3. PractiScore official timing and score overlay;
4. macOS batch export with several prepared match edits;
5. supported result-source selection;
6. Auto Trim marker review;
7. privacy/improvement control.

Keep the existing official Split Sync, Stage Mix, and Reframe videos as sufficient first evidence. State that real screenshots improve evidence but do not block Tasks 2–7.

- [x] **Step 5: Validate and commit the documentation batch**

Run:

```bash
rg -n "P0[1-8]|automatic bullet-hit|owner posts|Full Match|fixed crop" \
  docs/geo-content-strategy.md docs/geo-english-measurement.md
git diff --check
```

Expected: all eight P queries appear once in the new matrix; the evidence section contains limitations; no public HTML is changed.

Commit and push:

```bash
git add docs/geo-content-strategy.md docs/geo-english-measurement.md \
  docs/geo-english-media-brief.md
git commit -m "Record pain-led English GEO research"
git push origin main
```

---

### Task 2: Make the Homepage Lead With the Complete Editing Outcome

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `index.html`
- Modify: `llms.txt`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: Task 1's evidence hierarchy and P01/P02 query definitions.
- Produces: one outcome-led homepage description shared consistently by visible copy, JSON-LD, and `llms.txt`.

- [x] **Step 1: Add a failing homepage-positioning regression test**

Add:

```js
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
```

- [x] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="complete match-video editing outcome" \
  scripts/validate-site.test.mjs
```

Expected: FAIL because the current hero and `llms.txt` do not contain the new outcome-led copy and the homepage still contains absolute audio-analysis wording.

- [x] **Step 3: Replace the homepage metadata and hero copy**

Keep the existing `<title>`. Replace the meta description with:

```text
Edit USPSA, IPSC, and IDPA match footage: trim dead time, sync camera views, merge every stage, add results, and export full-match or vertical video.
```

Replace the three visual H1 lines with:

```text
Competitive-Shooting.
Video Editing.
Built for the Match.
```

Replace the hero paragraph with:

```text
Shooting Cut turns raw match footage into a finished video in one purpose-built workflow. Trim dead time, sync POV and third-person views, combine every stage, add timing and results, and export a full-match video or vertical social clip on iPhone, iPad, and Mac.
```

Keep the App Store CTA, free-trial statement, OS requirements, and discipline tags.

- [x] **Step 4: Reorder the homepage feature hierarchy**

Make the first six cards appear in this order:

1. **Auto Trim**
2. **Full Match Merge**
3. **Split Sync**
4. **Stage Mix**
5. **Reframe and Track**
6. **Timing, Scores, and Results**

Use this exact Merge card copy:

```text
Arrange up to 20 sequential stage clips in competition order and export one Full Match video while preserving each clip's score association.
```

Use this exact audio-analysis copy later in the secondary feature group:

```text
Analyze timer beeps and gunshot impulses to propose trim points, synchronization, and timing data. Review detected markers when AGC, neighboring shots, echo, or weak beeps affect the recording.
```

Keep on-device processing, Apple-device subscription coverage, export/sharing, intro cards, and watermarks as secondary trust and finishing capabilities.

- [x] **Step 5: Reorganize the guide hub by user outcome**

Use these three lane headings:

1. `Choose the editing job`
2. `Build and publish the video`
3. `Add data, batch output, and trust`

Place the complete-editor guide first. Put Auto Trim, Split Sync, Stage Mix, Merge, and Reframe in the primary editing journey. Put result import, Thailand result preservation, official timing/scores, batch export, troubleshooting, and on-device processing in the third lane.

Use this guide-hub subtitle:

```text
Choose the outcome you need: trim one stage, synchronize camera views, assemble a full match, add performance context, or export another format.
```

- [x] **Step 6: Synchronize homepage JSON-LD and `llms.txt`**

Update the homepage `SoftwareApplication` description and the first product paragraph in `llms.txt` to say that Shooting Cut is a complete competitive-shooting video editor that:

- trims stage footage;
- synchronizes POV and third-person views;
- combines sequential stages into one Full Match video;
- adds verified timing and score context;
- reframes supported edits for multiple formats;
- exports on iPhone, iPad, and Mac.

Retain every exact mode, subscription, upload, score-source, export, and privacy boundary already enforced by the validator.

- [x] **Step 7: Update the homepage sitemap date and measurement record**

Update only the homepage `<lastmod>`. Add a page-decision row linking this change to P01/P02 and state that no ranking or citation improvement is claimed at deployment time.

- [x] **Step 8: Validate, commit, push, and verify production**

Run:

```bash
node --check scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
node scripts/validate-site.mjs
xmllint --noout sitemap.xml
git diff --check
```

Commit:

```bash
git add index.html llms.txt sitemap.xml scripts/validate-site.test.mjs \
  docs/geo-english-measurement.md
git commit -m "Lead English site with match editing outcomes"
git push origin main
```

Expected production result: the homepage returns 200, its visible hero contains the complete-editor phrase, JSON-LD parses, and GitHub Actions deploys the exact commit.

---

### Task 3: Turn the Complete-Editor Guide Into the Pain-to-Workflow Answer

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `competitive-shooting-video-editor/index.html`
- Modify: `llms.txt`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: P01/P02 and the existing four-mode table.
- Produces: an answer that connects editing friction to the correct Shooting Cut workflow without naming competitors.

- [x] **Step 1: Add a failing guide-positioning test**

Add:

```js
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
    assert.ok(source.includes(phrase), `complete-editor guide must include: ${phrase}`);
  }
});
```

- [x] **Step 2: Run the test and verify failure**

Run:

```bash
node --test --test-name-pattern="maps shooter editing jobs" \
  scripts/validate-site.test.mjs
```

Expected: FAIL because the current page starts with a feature inventory and has no outcome checklist.

- [x] **Step 3: Rewrite the metadata, answer, and lede**

Use this meta description:

```text
Edit USPSA, IPSC, and IDPA match footage in one Apple workflow: trim stages, sync POV and third-person views, merge a full match, add results, and export.
```

Use this answer:

```text
Shooting Cut is a complete competitive-shooting video editor for iPhone, iPad, and Mac: trim one stage, synchronize POV and third-person footage, combine every stage, add verified timing and score context, reframe for vertical formats, and export from one product.
```

Use this lede:

```text
The editing job is usually simple to describe even when the footage is not: remove dead time, keep simultaneous camera views aligned, put sequential stages in order, and make the finished run understandable. Shooting Cut organizes those jobs around match footage rather than presenting timer and gunshot subtitles as the entire product.
```

- [x] **Step 4: Add the outcome checklist before the existing mode table**

Add an H2 titled:

```text
Finish the common match-video jobs in one editor
```

Add a visible list covering these exact outcomes:

- remove dead time from one stage recording;
- align simultaneous POV and third-person camera views;
- put sequential stages in competition order for one Full Match video;
- make performance understandable with available timing and score data;
- reuse one edit across supported publishing formats;
- render several prepared edits with macOS Pro batch export.

Link each outcome to its existing exact guide. Keep the four-mode input table immediately after the checklist so outcomes lead and limits remain easy to verify.

- [x] **Step 5: Update matching structured data and machine summary**

Update the page's `Article` description to match the visible answer. Update the route description in `llms.txt` without repeating the whole homepage paragraph.

- [ ] **Step 6: Validate and deploy**

Run the full validation command set from Task 2, then:

```bash
git add competitive-shooting-video-editor/index.html llms.txt sitemap.xml \
  scripts/validate-site.test.mjs docs/geo-english-measurement.md
git commit -m "Map shooting video pain to editing workflows"
git push origin main
```

Expected: P01/P02 have one clear primary route, all original input limits remain visible, and the route returns 200 after Pages deployment.

---

### Task 4: Express the Two-Camera Pain in POV and Third-Person Language

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `sync-two-shooting-videos-by-timer-beep/index.html`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: P03 and the existing official Split Sync demonstration.
- Produces: a two-camera guide that answers the observed review use case while retaining exact-two-input and manual-verification boundaries.

- [ ] **Step 1: Add a failing two-view use-case test**

Add:

```js
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
  ]) {
    assert.ok(source.includes(phrase), `Split Sync guide must include: ${phrase}`);
  }
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="POV and third-person review" \
  scripts/validate-site.test.mjs
```

Expected: FAIL on the new use-case phrases.

- [ ] **Step 3: Update metadata and the opening answer**

Use this meta description:

```text
Sync two shooting videos—such as POV and third-person views—by timer beep, verify alignment, and choose a shared review or publishing layout.
```

Use this answer:

```text
Use Split Sync to align exactly two simultaneous recordings—such as a hat-camera POV and a third-person view—by timer-beep audio, then manually verify the offset and choose a shared layout for review or publishing.
```

Keep the existing H1 and URL.

- [ ] **Step 4: Add the review-purpose section**

Add an H2:

```text
Review footwork, reloads, and stage strategy from two views
```

Explain that keeping POV and third-person footage on one synchronized timeline can show footwork, reloads, hard stops, movement, and stage strategy that one angle may not show clearly. State that Shooting Cut presents the views; it does not automatically grade technique.

Link `Side by Side` to `/side-by-side-shooting-video-comparison/`.

- [ ] **Step 5: Add one visible FAQ and matching FAQPage item**

Question:

```text
Can I synchronize a hat-camera POV and a third-person shooting video?
```

Answer:

```text
Yes, when both recordings show the same run. Split Sync uses exactly two simultaneous inputs, proposes alignment from timer-beep and audio evidence, and still requires manual verification before export.
```

- [ ] **Step 6: Validate and deploy**

Run the full validation command set, then:

```bash
git add sync-two-shooting-videos-by-timer-beep/index.html sitemap.xml \
  scripts/validate-site.test.mjs docs/geo-english-measurement.md
git commit -m "Clarify POV and third-person video sync"
git push origin main
```

Expected: the visible FAQ and JSON-LD agree, the official video remains embedded once, and the route remains valid.

---

### Task 5: Answer the Horizontal-to-Vertical Crop Pain

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `reframe-landscape-shooting-video-for-social-media/index.html`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: P04 and the existing 16:9 versus tracked 4:5 official examples.
- Produces: a vertical-video answer that explains what Track solves and what still needs user review.

- [ ] **Step 1: Add a failing reframe-use-case test**

Add:

```js
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
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="fixed-crop and vertical publishing" \
  scripts/validate-site.test.mjs
```

Expected: FAIL because the current page starts with ratio ceilings instead of the observed crop problem.

- [ ] **Step 3: Update the title, metadata, answer, and lede**

Use this title:

```text
Turn Landscape Shooting Video into Vertical Social Formats | Shooting Cut
```

Use this meta description:

```text
Keep the shooter in frame when turning one landscape stage video into 9:16, 4:5, square, or other supported social formats with on-device Track.
```

Use this answer:

```text
Turn one landscape stage edit into portrait, square, and landscape exports without relying on a fixed center crop: Track follows the selected shooter inside supported 9:16, 3:4, 4:5, 6:7, and 1:1 frames on your Apple device.
```

Use this lede:

```text
A vertical crop has less horizontal room, so review whether the shooter and relevant action remain in frame and whether timing or score text remains readable. Track solves the moving-subject part; it does not decide which targets, props, or overlays matter to the final composition.
```

- [ ] **Step 4: Add platform examples without implying unsupported direct upload**

Add a section explaining that an exported vertical file can be prepared for YouTube Shorts, Instagram Reels, or Facebook Reels. State separately that direct upload to YouTube and Facebook is a Pro feature and that other publishing workflows begin with the exported file.

- [ ] **Step 5: Add one visible FAQ and matching FAQPage item**

Question:

```text
Will Track keep the shooter, targets, and score overlay visible automatically?
```

Answer:

```text
Track follows the selected shooter inside a supported crop. It does not decide which targets or overlays matter, so preview the complete stage and adjust the composition or overlay before export.
```

- [ ] **Step 6: Synchronize Article, HowTo, and FAQ structured data**

Update the Article description and only the HowTo/FAQ text whose visible counterpart changed. Preserve the verified ratio and resolution matrix.

- [ ] **Step 7: Validate and deploy**

Run the full validation command set, then:

```bash
git add reframe-landscape-shooting-video-for-social-media/index.html \
  sitemap.xml scripts/validate-site.test.mjs docs/geo-english-measurement.md
git commit -m "Explain vertical shooting video reframing"
git push origin main
```

Expected: the two existing official videos remain present, no direct Instagram upload is claimed, and the route's JSON-LD stays consistent with visible text.

---

### Task 6: Make Timing and Scores Explain the Run Without Claiming Hit Detection

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `add-shot-times-and-scores-to-match-video/index.html`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: P06 and the observed request to make match footage understandable.
- Produces: a performance-context answer with an explicit boundary between imported timing/score data and bullet-hit location.

- [ ] **Step 1: Add a failing performance-context boundary test**

Add:

```js
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
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="without hit localization" \
  scripts/validate-site.test.mjs
```

Expected: FAIL on the explicit viewer-outcome and hit-location boundary.

- [ ] **Step 3: Update metadata and the opening answer**

Use this meta description:

```text
Make match footage easier to understand by adding verified PractiScore shot times, splits, shot count, and scores aligned to the timer beep.
```

Use this answer:

```text
Make a stage video easier to understand by displaying verified shot times, splits, shot count, and score data from a PractiScore result that contains official per-shot timer records. Shooting Cut aligns that record to the footage by the timer beep; it does not infer bullet-hit locations.
```

Keep the existing import, alignment, preview, and missing-field boundaries.

- [ ] **Step 4: Add one visible FAQ and matching FAQPage item**

Question:

```text
Does Shooting Cut show where bullets hit the target?
```

Answer:

```text
No. Shooting Cut can display available imported score and official timing data and can analyze timer and shot audio. It does not locate or place bullet hits on a target image.
```

- [ ] **Step 5: Synchronize structured data, validate, and deploy**

Update the Article and FAQ descriptions that mirror changed visible text. Run the full validation command set, then:

```bash
git add add-shot-times-and-scores-to-match-video/index.html sitemap.xml \
  scripts/validate-site.test.mjs docs/geo-english-measurement.md
git commit -m "Clarify timing overlays and hit boundaries"
git push origin main
```

Expected: P06 has one accurate answer, the page does not imply automatic visual hit detection, and all JSON-LD parses.

---

### Task 7: Explain Batch Export as the Repeated-Work Solution

**Files:**
- Modify: `scripts/validate-site.test.mjs`
- Modify: `batch-export-match-videos/index.html`
- Modify: `sitemap.xml`
- Modify: `docs/geo-english-measurement.md`

**Interfaces:**
- Consumes: P07 and the medium-strength repeated-work inference.
- Produces: a cautious batch-export explanation that does not confuse separate outputs with Merge.

- [ ] **Step 1: Add a failing batch-workflow test**

Add:

```js
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
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="repeated multi-stage rendering" \
  scripts/validate-site.test.mjs
```

Expected: FAIL on the new repeated-work language.

- [ ] **Step 3: Update metadata and the opening answer**

Use this meta description:

```text
Render several prepared match edits as separate files on Mac instead of starting each export one by one; every job keeps its real format limits.
```

Use this answer:

```text
Use Shooting Cut Pro on macOS to render several prepared match edits as separate output files instead of starting each export one by one. Every job still follows its editing mode, ratio, resolution, layout, and tracking limits.
```

- [ ] **Step 4: Add the multi-stage workflow explanation**

Add an H2:

```text
Queue prepared stage edits without rebuilding each export
```

Explain that the user completes timing, cuts, results, framing, and tracking first, then queues the prepared edits. Repeat the existing boundary: batch export creates separate files and does not combine stages; Merge creates one Full Match video.

- [ ] **Step 5: Validate and deploy**

Run the full validation command set, then:

```bash
git add batch-export-match-videos/index.html sitemap.xml \
  scripts/validate-site.test.mjs docs/geo-english-measurement.md
git commit -m "Frame batch export around repeated match work"
git push origin main
```

Expected: P07 maps to one accurate page and the Merge-versus-batch distinction remains explicit.

---

### Task 8: Verify Production and Measure the Pain-Led Update

**Files:**
- Modify: `docs/geo-english-measurement.md`
- Modify: `docs/geo-content-strategy.md`

**Interfaces:**
- Consumes: deployed Tasks 1–7 and their GitHub Pages SHAs.
- Produces: a dated technical baseline, query-to-page observations, and evidence-gated follow-up decisions.

- [ ] **Step 1: Run the complete repository acceptance suite**

Run:

```bash
node --check scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
node scripts/validate-site.mjs
xmllint --noout sitemap.xml
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Check all public routes through a local HTTP server**

Start:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

In a second shell, extract every English sitemap URL and verify HTTP 200. Check the homepage plus the five changed guide routes at desktop and mobile widths. Stop the server after verification.

- [ ] **Step 3: Verify the exact production commit**

For each pushed batch:

- wait for `Validate site` and GitHub Pages to reach a terminal success state;
- confirm the deployment SHA equals the pushed `main` SHA;
- fetch every changed production URL;
- parse every live JSON-LD block;
- confirm the old absolute `every gunshot` and `instantly get precise` homepage wording is absent.

- [ ] **Step 4: Record the deployment baseline**

Add one deployment row per commit with:

- UTC deployment time;
- full commit SHA;
- validation run result;
- Pages run result;
- changed routes;
- production HTTP/JSON-LD result.

Do not record cookies, OAuth tokens, account IDs, or private Search Console/Bing exports.

- [ ] **Step 5: Sample Q01–Q16 and P01–P08 on the fixed schedule**

Use:

- **72 hours:** technical discovery, sitemap, canonical, HTTP, and structured-data checks only;
- **Week 2:** discovery/crawl/index state and query-to-landing-page correctness;
- **Week 4:** impressions, click-through, landing pages, and three-run generative citation samples;
- **Week 8:** durable query coverage and whether any genuinely missing intent exists.

Do not interpret a single generative answer as a ranking.

- [ ] **Step 6: Apply evidence-gated follow-up rules**

- If a page is not discovered, inspect sitemap, homepage link depth, robots, HTTP, and canonical.
- If discovered but not crawled, inspect fetch stability and internal links.
- If crawled but not indexed, inspect uniqueness and visible evidence.
- If indexed with no impressions, wait for the scheduled review unless an external query proves a content gap.
- If impressions exist but click-through is weak, adjust only the title, meta description, and opening answer for the observed query.
- If a citation is accurate, preserve the page.
- If a citation contains a factual error, update visible text and matching JSON-LD together.
- Do not create a new route unless Week-8 evidence shows an intent that none of the 13 guides can answer.

- [ ] **Step 7: Commit the final dated record**

Run:

```bash
git add docs/geo-english-measurement.md docs/geo-content-strategy.md
git commit -m "Record pain-led GEO deployment baseline"
git push origin main
```

Expected: the handoff states what changed, what remained unchanged, what evidence justified the update, and when the next review occurs.

---

## Self-Review

- Every observed pain maps to an existing route; no new page is required.
- The plan preserves the original Q01–Q16 baseline and adds P01–P08 separately.
- Public copy does not name competitors or claim market share.
- Merge, Side by Side, privacy, Thailand, and troubleshooting pages have explicit no-change decisions.
- The homepage leads with the complete editor, not timer/gunshot captions.
- Timing/results copy explicitly rejects automatic bullet-hit localization.
- Facebook is retained as an important publication/discovery source without overstating noisy public-search evidence.
- Privacy remains prominent as trust evidence after the primary editing outcome.
- Each public batch has a focused regression test, full validation, an English commit, a push, and production verification.
- Real-product media remains a separate evidence batch and does not block text, structured-data, or measurement work.
