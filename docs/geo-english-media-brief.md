# Shooting Cut 1.1.4 English GEO Media Brief

## Purpose

Capture real Shooting Cut 1.1.4 UI evidence for the English guide pages. These
assets are a follow-on evidence batch, not a prerequisite for sitemap
submission or indexing. Existing official videos remain the first visual
evidence for Split Sync, Stage Mix, and Reframe.

Generated, reconstructed, or placeholder UI must not be published as product
evidence.

## Priority order

1. Complete mode-selection overview
2. Merge
3. PractiScore official timing overlay
4. macOS batch export
5. PractiScore, ESS, HDP, Shoot'n Score It, and IDPA result import
6. Auto Trim
7. On-device/privacy control

Split Sync, Stage Mix, and Reframe screenshots can follow later because their
matching English guides already include official workflow videos. Real
screenshots strengthen evidence, but they do not block pain-led copy,
structured-data, or measurement updates.

## Required captures

| Priority | Workflow | Required real-product state | Primary guide |
|---:|---|---|---|
| 1 | Mode selection | Auto Trim, Merge, Split Sync, and Stage Mix together in the real mode-selection UI | `/competitive-shooting-video-editor/` |
| 2 | Merge | Ordered Stage 1 through Stage N clips and the resulting Full Match output state | `/merge-uspsa-stage-videos/` |
| 3 | Official timing | PractiScore official times and splits aligned to video subtitles from the timer anchor | `/add-shot-times-and-scores-to-match-video/` |
| 4 | Batch export | Several prepared match edits in the macOS Pro batch queue, with separate output jobs visible | `/batch-export-match-videos/` |
| 5 | Result import | Source-selection UI covering PractiScore, ESS, HDP, Shoot'n Score It, and IDPA without exposing real participant data | `/import-practiscore-ess-hdp-match-results/` |
| 6 | Auto Trim | One imported stage video with the timer marker, detected shots, proposed trim boundaries, and the manual event-correction controls visible | `/auto-trim-shooting-match-video/` |
| 7 | Privacy control | The real `Help Improve Gunshot Detection` control and its current default state in 1.1.4 | `/on-device-shooting-video-editor/` |

## Capture details by workflow

### Auto Trim

Capture enough of one timeline to show:

- the timer marker;
- detected gunshots;
- proposed start and end trim boundaries;
- waveform context;
- removal of one false event or selection of the true last shot;
- the reviewed state before export.

The caption must describe detection as an editable proposal, not guaranteed
ground truth.

### Merge

Capture:

- ordered inputs labeled Stage 1 through Stage N;
- the order-control surface;
- each clip's retained score association when visible;
- the single Full Match output state.

Do not describe Merge as simultaneous multi-camera editing or batch export.

### PractiScore official timing

Capture:

- the imported official timer record;
- the timer anchor aligned to the video;
- official shot times or splits in the subtitle/overlay preview;
- the reviewed output state.

The caption must state that official per-shot timing is available when the
PractiScore source provides it. Do not extend that claim to ESS, HDP, or IDPA.

### Batch export

Capture:

- several prepared match edits in the macOS Pro batch queue;
- separate output jobs rather than one combined timeline;
- the selected output state without exposing local filenames or participant
  data;
- the completed separate exports when that state is visible.

The caption must distinguish batch export from Merge: batch export renders
separate prepared edits, while Merge combines sequential stages into one Full
Match video.

### Result import

Capture the real source-selection UI for PractiScore, ESS, HDP, Shoot'n Score It,
and IDPA. Use
sanitized demonstration data. A separate Thailand-focused derivative may show
HDP and ESS together, but it must not expose shooter names, match identifiers,
or private result URLs.

### Privacy and improvement control

Capture the current 1.1.4 control without restaging its default. The visible
caption must distinguish:

- core on-device video/audio analysis, editing, export, and person tracking;
- optional detection-improvement reports;
- iCloud, subscription verification, result import, and user-initiated upload
  network boundaries.

### Mode overview

Capture all four mode choices in one real screen:

- Auto Trim;
- Merge;
- Split Sync;
- Stage Mix.

The frame should make the product read as a complete competitive-shooting video
editor, not only a gunshot-caption utility.

## Safety and authenticity requirements

- Capture the real released 1.1.4 app with the English UI.
- Do not use generated UI, mockups, reconstructed screens, or placeholders.
- Do not show unapproved competitor names, shooter names, match identifiers,
  email addresses, account IDs, platform tokens, or notification content.
- Redact sensitive fields before an asset enters the web repository.
- Retain the untouched source capture outside the public web repository.
- Publish only an optimized derivative with an explicit width and height.
- Remove embedded location metadata and other unnecessary image metadata.
- Write alt text and captions from visible, verified behavior only.
- Do not claim that all data stays local; preserve the documented connected
  service boundaries.

## Asset manifest

Every proposed public asset must be reviewed with:

| Field | Requirement |
|---|---|
| Source build | `Shooting Cut 1.1.4` |
| UI language | English |
| Capture device | Device family and OS version |
| Public filename | Descriptive lowercase filename |
| Dimensions | Exact width and height |
| Destination route | One primary English guide |
| Alt text | Concise visible-state description |
| Caption | Verified workflow fact and any necessary limit |
| Redactions | Explicit list, or `none` |
| Metadata check | Location metadata removed |

## Acceptance checklist

- The source is the real 1.1.4 app.
- The UI state matches the intended guide.
- No private or identifying data is visible.
- The public derivative is legible at a narrow mobile width.
- Alt text, caption, visible copy, and matching structured data agree.
- The page validator and full site test suite pass after publication.
