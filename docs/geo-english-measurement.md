# Shooting Cut English GEO Measurement

## Scope

- Domain: `https://shootingcut.com/`
- Search language: English
- Product version at baseline: `1.1.3`
- App market: currently available non-China App Store markets
- Included surfaces: Google Search, Bing, ChatGPT, Perplexity, Claude,
  Microsoft Copilot, YouTube, Facebook, and Reddit when each surface is
  accessible
- Excluded: `shootingcut.cn`, Chinese queries, China App Store availability,
  product-market-opportunity analysis, and unsupported competitor comparisons

This document records repeatable discovery, indexing, query, citation, and
fact-accuracy checks. A single answer or search result is a dated sample, not a
ranking guarantee.

## Credential and privacy boundary

- Never record cookies, authorization headers, API keys, access/refresh tokens,
  account identifiers, ownership-verification tokens, or private raw exports.
- Search Console and Bing screenshots must exclude account email addresses and
  unrelated properties before entering the repository.
- OpenCLI may use the user's existing connected Chrome session for read-only
  Facebook or Reddit access. This document records only summarized public
  evidence.
- No analytics or advertising script is required for the baseline.

## Public route inventory

The English sitemap contains 18 URLs:

1. Homepage
2. FAQ
3. Privacy Policy
4. Support
5. Terms of Service
6. Competitive-shooting video editor
7. On-device shooting video editor
8. Auto Trim one shooting match video
9. Sync two shooting videos by timer beep
10. Edit a multi-camera shooting video
11. Shot-detection troubleshooting
12. Reframe landscape shooting video for social formats
13. Merge USPSA stage videos
14. Side-by-side shooting video comparison
15. Batch export match videos on Mac
16. Import PractiScore, ESS, HDP, and IDPA match results
17. Thailand HDP and ESS match results
18. Add official shot times and scores to match video

## Fixed English query matrix

Use the query text exactly as written at week 0, 2, 4, and 8.

| ID | Query | Primary intent | Expected best route |
|---|---|---|---|
| Q01 | `competitive shooting video editor` | Category | `/competitive-shooting-video-editor/` |
| Q02 | `USPSA match video editor` | US practical-shooting category | `/competitive-shooting-video-editor/` |
| Q03 | `IPSC match video editor` | International practical-shooting category | `/competitive-shooting-video-editor/` |
| Q04 | `edit a shooting match video` | General workflow | `/competitive-shooting-video-editor/` |
| Q05 | `automatically trim a shooting match video` | One-video automatic trim | `/auto-trim-shooting-match-video/` |
| Q06 | `sync two shooting videos by timer beep` | Two simultaneous views | `/sync-two-shooting-videos-by-timer-beep/` |
| Q07 | `edit a multi-camera shooting stage video` | Two or three camera views | `/edit-multi-camera-shooting-video/` |
| Q08 | `merge USPSA stage videos into one full match` | Sequential full-match assembly | `/merge-uspsa-stage-videos/` |
| Q09 | `turn a landscape shooting video into a vertical reel` | Reframe and Track | `/reframe-landscape-shooting-video-for-social-media/` |
| Q10 | `compare two shooting runs side by side` | Two-run comparison | `/side-by-side-shooting-video-comparison/` |
| Q11 | `batch export match videos on Mac` | macOS batch output | `/batch-export-match-videos/` |
| Q12 | `import PractiScore results into a shooting video` | Result import | `/import-practiscore-ess-hdp-match-results/` |
| Q13 | `add official shot times and scores to a shooting video` | Official PractiScore overlay | `/add-shot-times-and-scores-to-match-video/` |
| Q14 | `preserve HDP ESS Thailand match results` | Thailand result retention | `/thailand-hdp-ess-match-results/` |
| Q15 | `on-device shooting video editor` | Local processing | `/on-device-shooting-video-editor/` |
| Q16 | `private shooting video editor for iPhone` | Privacy and device processing | `/on-device-shooting-video-editor/` |

## Sampling rules

For generative-answer sampling:

1. Start a new non-personalized conversation when the surface supports it.
2. Use the exact query text without adding the product name.
3. Record UTC date/time, surface, market/language setting, cited URL, and factual
   errors.
4. Repeat each sampled query three times before calling an answer pattern
   stable.
5. Do not treat a single response as a long-term ranking or citation result.
6. If Shooting Cut appears, check whether it is described as a complete video
   editor rather than only a gunshot-caption tool.
7. Check input limits, Free/Pro boundaries, subscription scope, privacy,
   `.22` support, App Store availability, and upload destinations whenever an
   answer mentions them.

For social and video evidence:

1. Record the query, date, result URL, and directly observed wording.
2. Separate a shooter's stated workflow from any inference about broader user
   demand.
3. Treat Facebook as an important source whenever the connected read-only
   channel is available.
4. Do not convert view, like, follower, or group-member counts into product
   facts.

## Indexing baseline

| Checked at (UTC) | Surface | Sitemap status | Discovered URLs | Indexed URLs | Errors | Evidence note |
|---|---|---|---:|---:|---|---|

## Query and citation samples

| Checked at (UTC) | Surface | Market | Query ID | Site/page present | Cited URL | Factual error | Notes |
|---|---|---|---|---|---|---|---|

## Research-channel status

| Checked at (UTC) | Channel | Backend | State | Evidence limitation |
|---|---|---|---|---|

## English App Store parity

| Checked at (UTC) | Field | App Store value | Website value | State | Action |
|---|---|---|---|---|---|

Fields to check:

- App ID
- Product name
- Version
- Current-version release date
- Minimum OS requirement
- English App Store destination
- Free/Pro wording
- One-subscription device scope
- Direct upload destinations

## Evidence states

Each reviewed public route receives exactly one current state:

- `not discovered`
- `discovered but not crawled`
- `crawled but not indexed`
- `indexed with no observed impressions`
- `impressions with weak click-through`
- `cited accurately`
- `cited with factual error`

## Decision rules

| Evidence state | Action |
|---|---|
| `not discovered` | Check sitemap presence, robots, HTTP status, and homepage/internal links. |
| `discovered but not crawled` | Check fetch access, canonical URL, response stability, and internal-link depth. |
| `crawled but not indexed` | Check content uniqueness, visible evidence, canonical selection, and near-duplicate intent. |
| `indexed with no observed impressions` | Wait for the scheduled sample unless external query evidence proves a content gap. |
| `impressions with weak click-through` | Review the title, meta description, and opening answer for the observed query. |
| `cited accurately` | Preserve the page and avoid unnecessary rewriting. |
| `cited with factual error` | Correct the opening answer, FAQ, visible supporting text, and matching structured data together. |

## Page decisions

| Review date | Route | Evidence state | Decision | Exact change or no-change reason |
|---|---|---|---|---|

## Review schedule

- Week 0: submit/verify English sitemap, establish indexing counts, verify
  English App Store parity, smoke-test research channels, and sample the fixed
  queries.
- Week 2: classify discovery/indexing problems and correct only technical or
  factual errors supported by evidence.
- Week 4: review impressions, click-through, landing pages, and repeated
  generative citations.
- Week 8: decide which changes were durable and whether any genuinely missing
  English intent warrants a new page.
- Every App release: recheck version, OS requirements, mode/input limits,
  Free/Pro, subscription scope, privacy, result sources, upload destinations,
  and export limits.

## Deployment record

| Deployed at (UTC) | Commit | Validate site | GitHub Pages | Production check | Notes |
|---|---|---|---|---|---|

