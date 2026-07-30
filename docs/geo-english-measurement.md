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
| 2026-07-30T09:58:54Z | Google Search Console | Success; resubmitted 2026-07-30 | 10 (before Google rereads the 18-route sitemap) | 8 | 5 pages not indexed; 1 historical structured-data parse error | Domain property verified. Previous sitemap read was 2026-07-27. The parse error belongs to removed `/faq-zh.html`, which now returns 404; fix validation started 2026-07-30. |
| 2026-07-30T09:58:54Z | Bing Webmaster Tools | Authorization pending | — | — | Bing account not yet authorized | Google sign-in reached the consent screen. No account identity or sitemap data was submitted pending explicit user approval of the Bing OAuth disclosure. |

## Google URL inspection sample

| Checked at (UTC) | Route | Stored index state | Live test | Indexing request |
|---|---|---|---|---|
| 2026-07-30T09:58:54Z | `/` | Indexed | Eligible for indexing; page fetch succeeded | Not needed |
| 2026-07-30T09:58:54Z | `/competitive-shooting-video-editor/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/auto-trim-shooting-match-video/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/sync-two-shooting-videos-by-timer-beep/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/edit-multi-camera-shooting-video/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/reframe-landscape-shooting-video-for-social-media/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/merge-uspsa-stage-videos/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |
| 2026-07-30T09:58:54Z | `/import-practiscore-ess-hdp-match-results/` | Discovered, not indexed | Eligible for indexing; page fetch succeeded | Requested |

## Query and citation samples

| Checked at (UTC) | Surface | Market | Query ID | Site/page present | Cited URL | Factual error | Notes |
|---|---|---|---|---|---|---|---|
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q01 | No | — | — | One sample; another shooting-specific editor and general editors were recommended. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q02 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q03 | Yes | `https://shootingcut.com/faq.html` | None observed | Described Shooting Cut as a smart video editor with Auto Trim, two-camera sync, multi-camera Stage Mix, and score overlays—not as a caption-only tool. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q04 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q05 | Yes | No Shooting Cut URL observed | None observed | Named Shooting Cut as an auto-trim example; one sample and no direct product citation. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q06 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q07 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q08 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q09 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q10 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q11 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q12 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q13 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q14 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q15 | No | — | — | One sample; not a stable answer pattern. |
| 2026-07-30T10:05:00Z | Perplexity | English query; signed-out session | Q16 | No | — | — | One sample; not a stable answer pattern. |

## Research-channel status

| Checked at (UTC) | Channel | Backend | State | Evidence limitation |
|---|---|---|---|---|
| 2026-07-30T10:05:00Z | General web | Agent Reach / Jina Reader | Available | Read-only page retrieval; not used as evidence of generative citation frequency. |
| 2026-07-30T10:05:00Z | Facebook | OpenCLI connected Chrome bridge | Available | Three bounded public searches succeeded. Returned URLs can be profile or group URLs rather than durable post permalinks, and irrelevant results can appear. No cookies were read or exported by this audit. |
| 2026-07-30T10:05:00Z | Reddit | OpenCLI connected Chrome bridge | Available | Read-only searches succeeded, but exact-query recall was uneven and broad wording produced unrelated results. |
| 2026-07-30T10:05:00Z | YouTube | `yt-dlp` 2026.07.29 plus public YouTube pages | Partially available | Flat title search and exact-ID duration lookup succeeded without cookies. Full `yt-dlp` extraction triggered YouTube's sign-in/anti-bot check; official titles, channels, thumbnails, and dates were instead verified through public YouTube OEmbed and watch-page data. |
| 2026-07-30T10:05:00Z | Perplexity | Signed-out web session | Available | One run per fixed query; results are dated samples and do not establish a stable answer pattern. |
| 2026-07-30T10:05:00Z | Exa | Free MCP endpoint | Rate-limited | Returned HTTP 429 on 2026-07-30. No large retry or API-key requirement was introduced. |

## Week-0 public source-language sample

| Checked at (UTC) | Channel | Query | Public result | Directly observed wording | Limitation |
|---|---|---|---|---|---|
| 2026-07-30T10:05:00Z | Facebook | `USPSA match video` | `https://www.facebook.com/jerome.gonzales.37` | A public result used `uspsa match` followed by a match date. | OpenCLI returned a profile URL, not a durable post permalink; the second result was irrelevant. |
| 2026-07-30T10:05:00Z | Facebook | `IPSC full match video` | `https://www.facebook.com/hauser.benjamin` | A public result said `full and uncut POV Match Video with all the stage results`. | Profile URL only; one result cannot establish broader demand. |
| 2026-07-30T10:05:00Z | Facebook | `shooting match video editing` | — | No query-specific practical-shooting editing wording was observed in the bounded results. | Results were dominated by generic editing groups, advertising, and a repeated IPSC post. |
| 2026-07-30T10:05:00Z | Reddit | `USPSA match video` | — | No result returned for the exact bounded query. | Search availability does not guarantee recall. |
| 2026-07-30T10:05:00Z | Reddit | `IPSC full match video` | `https://www.reddit.com/r/canadaguns/comments/2clqx8/2014_ipsc_canadian_nationals_videos/` | The post labels one compilation `Full video (3rd person) all 16 stages`. | Historical single-post evidence. |
| 2026-07-30T10:05:00Z | Reddit | `USPSA video editing` | `https://www.reddit.com/r/CompetitionShooting/comments/1s0ta4p/how_to_edit_uspsa_match_footage_to_show_hits/` | The author asks how to show shot results above targets and fit the result to a YouTube Short or Instagram Reel. | A specific workflow request, not a market-size claim. |
| 2026-07-30T10:05:00Z | Reddit | `USPSA video editing` | `https://www.reddit.com/r/CompetitionShooting/comments/1q5573b/playing_with_new_insta360_x5_competition_with/` | The author describes creating multiple tracked clips first, then assembling the final video in a second editor. | One user's two-step workflow. |
| 2026-07-30T10:05:00Z | YouTube | `USPSA full match video` | `https://www.youtube.com/watch?v=6XODCvacHcA` | `USPSA Revolver Division Full Match Video 06/14/2025` | Flat-search title only; upload date metadata was not fetched. |
| 2026-07-30T10:05:00Z | YouTube | `USPSA full match video` | `https://www.youtube.com/watch?v=xvpUAiehwxI` | `USPSA Racegun Nats 2025 Full Match video` | Flat-search title only. |
| 2026-07-30T10:05:00Z | YouTube | `IPSC full match video` | `https://www.youtube.com/watch?v=1p8f2Y7mDi4` | `POV IPSC Full Match Video 2021 Saskatchewan Provincial Championships` | Flat-search title only. |
| 2026-07-30T10:05:00Z | YouTube | `IPSC full match video` | `https://www.youtube.com/watch?v=5nOXx6y301E` | `IPSC Match - 2017 Spring Shootout - 11 STAGES` | Flat-search title only. |
| 2026-07-30T10:05:00Z | YouTube | `shooting match video editing` | — | The top five results interpreted `match` as an editing transition or unrelated sport, not practical shooting. | The phrase is too ambiguous for source discovery without a discipline term. |

## Official guide-video evidence

| Checked at (UTC) | Video | Public title | Channel | Upload date | Duration | Guide use |
|---|---|---|---|---|---|---|
| 2026-07-30T10:19:22Z | `https://www.youtube.com/watch?v=oxkMd8x90B0` | `ShootingCut in Action \| SplitSync SidebySide #practicalshooting #ipscshooting #shootingsports` | `WANG TAO` | 2026-04-09 | 28 seconds | Visible Split Sync Side by Side evidence on `/sync-two-shooting-videos-by-timer-beep/` |
| 2026-07-30T10:19:22Z | `https://www.youtube.com/watch?v=EHIiom5QjMU` | `ShootingCut in Action \| StageMix 16x9 #ipscshooting #uspsa #practicalshooting #Shooting Cut` | `WANG TAO` | 2026-04-04 | 28 seconds | Visible Stage Mix evidence on `/edit-multi-camera-shooting-video/` |
| 2026-07-30T10:19:22Z | `https://www.youtube.com/watch?v=EO-yju9mCIk` | `ShootingCut in Action \| sample 16:9 #ipscshooting #uspsa #practicalshooting #Shooting Cut` | `Shooting Cut` | 2026-04-04 | 28 seconds | Non-tracked landscape half of the comparison on `/reframe-landscape-shooting-video-for-social-media/` |
| 2026-07-30T10:19:22Z | `https://www.youtube.com/shorts/ZO5H3u1iSR8` | `·ShootingCut in Action \| Sample 4x5 #ipscshooting #uspsa #practicalshooting #Shooting Cut` | `Shooting Cut` | 2026-04-04 | 28 seconds | Tracked 4:5 half of the comparison on `/reframe-landscape-shooting-video-for-social-media/` |

The public YouTube OEmbed response supplied title, channel, and thumbnail; the
public watch page supplied the exact publication date; `yt-dlp` flat exact-ID
search or the visible player supplied duration. No browser cookie was exported
or committed.

## English App Store parity

| Checked at (UTC) | Field | App Store value | Website value | State | Action |
|---|---|---|---|---|---|
| 2026-07-30T10:07:22Z | App ID | `6761160281` | English App Store links use `id6761160281` | Pass | None |
| 2026-07-30T10:07:22Z | Product name | `Shooting Cut` | Canonical product name is `Shooting Cut` | Pass | None |
| 2026-07-30T10:07:22Z | Version | `1.1.3` | `1.1.3` | Pass | None |
| 2026-07-30T10:07:22Z | Current-version release date | `2026-07-29T18:40:40Z` | Not published as a product claim | No conflict | Keep the release date in this measurement record rather than adding volatile copy sitewide. |
| 2026-07-30T10:07:22Z | Minimum OS requirement | `26.0` in the US iOS lookup result | iOS 26.0+, iPadOS 26.0+, and macOS 26.0+ | Pass | None; the platform-specific website values also match the verified product source. |
| 2026-07-30T10:07:22Z | English App Store destination | `https://apps.apple.com/us/app/shooting-cut/id6761160281` | Locale-neutral `https://apps.apple.com/app/shooting-cut/id6761160281` | Pass | Keep the locale-neutral public link so English users reach their applicable storefront. |
| 2026-07-30T10:07:22Z | Free/Pro wording | Auto Trim and score import are free; Pro removes the watermark and adds custom intro cards, multi-camera modes, social upload, and batch export | Same after the 2026-07-30 correction | Corrected | Added the missing Pro qualifier for direct platform upload to the homepage, FAQ, editor overview, support page, and `llms.txt`. |
| 2026-07-30T10:07:22Z | One-subscription device scope | Not stated in the US description | One subscription covers the subscriber's Apple devices, subject to App Store account and entitlement rules | Product-source verified; no App Store conflict | None |
| 2026-07-30T10:07:22Z | Direct upload destinations | YouTube and Facebook (Pro) | YouTube and Facebook (Pro) | Corrected | Added an exact entitlement boundary and regression validation; TikTok direct upload remains explicitly unsupported. |

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
| 2026-07-30 | `/sync-two-shooting-videos-by-timer-beep/` | `discovered but not crawled` | Media-evidence change | Added one visible official Split Sync Side by Side demonstration and matching `VideoObject` after the live page passed Google's fetch/index eligibility test. |
| 2026-07-30 | `/edit-multi-camera-shooting-video/` | `discovered but not crawled` | Media-evidence change | Added one visible official Stage Mix demonstration and matching `VideoObject`; retained the requirement to review and override proposed cuts. |
| 2026-07-30 | `/reframe-landscape-shooting-video-for-social-media/` | `discovered but not crawled` | Media-evidence change | Added the official non-tracked 16:9 and tracked 4:5 examples together so the visible evidence matches the page's output-boundary explanation. |

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
