# shootingcut-web

English-only website and product documentation for
[Shooting Cut](https://shootingcut.com), a competitive-shooting video editor
for iPhone, iPad, and Mac.

## Sites and repositories

| Site | Repository | Language | Custom domain |
|---|---|---|---|
| English | [`wangtao9090/shootingcut-web`](https://github.com/wangtao9090/shootingcut-web) | English | `https://shootingcut.com` |
| Chinese | [`wangtao9090/shootingcut-cn`](https://github.com/wangtao9090/shootingcut-cn) | Simplified Chinese | `https://shootingcut.cn` |

The two sites are maintained, validated, committed, and deployed
independently. This repository does not publish a `.com/zh` compatibility
surface or `*-zh.html` pages, and those removed routes do not redirect to the
Chinese domain.

## Hosting

The English site is a static GitHub Pages site:

- publishing branch: `main`
- publishing source: repository root
- custom-domain file: [`CNAME`](CNAME)
- custom domain: `shootingcut.com`

`CNAME` is part of the deployment contract and must remain in the repository
root. Do not replace, delete, or regenerate it during content work.

## Repository structure

- `index.html`, `faq.html`, `privacy.html`, `support.html`, `terms.html`:
  site-level English pages
- `<guide-route>/index.html`: English workflow and product guides
- `assets/`: shared public assets
- `robots.txt`: English crawler policy and English sitemap reference
- `sitemap.xml`: public `.com` URL inventory with paired cross-domain
  alternates
- `llms.txt`: supplementary machine-readable product and route summary
- `scripts/validate-site.mjs`: dependency-free site structure and fact
  validator
- `scripts/validate-site.test.mjs`: validator and discoverability regression
  tests
- `docs/geo-content-strategy.md`: current GEO implementation and maintenance
  handoff
- `.github/workflows/validate-site.yml`: GitHub Actions validation workflow

`llms.txt` supplements the indexable HTML pages and sitemap. It does not
replace them and must not be described as a file that every AI system honors.

## Local validation

Requirements:

- a current Node.js LTS release
- `xmllint` from `libxml2`

Run every check from the repository root:

```bash
node --check scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
node scripts/validate-site.mjs
xmllint --noout sitemap.xml
git diff --check
```

For route smoke tests, start a local static server and require HTTP `200` for
every public route in `sitemap.xml`, `/llms.txt`, and shared public assets.
Also inspect representative desktop and mobile layouts, keyboard focus, and
wide-table containment.

## English and Chinese route pairing

Equivalent English and Chinese topics use the same root-relative path across
the two domains. Each pair is maintained through reciprocal metadata:

- English page:
  - self `hreflang="en"` on `shootingcut.com`
  - matching `hreflang="zh-Hans"` path on `shootingcut.cn`
  - English self URL as `x-default`
- Chinese page:
  - matching `hreflang="en"` path on `shootingcut.com`
  - self `hreflang="zh-Hans"` on `shootingcut.cn`
  - English URL as `x-default`

The sites deploy independently, so a new route requires paired commits in both
repositories. Before either commit is merged, verify that canonical,
`og:url`, `hreflang`, sitemap entries, visible language switches, and internal
links use the exact intended domain and path.

Do not restore the removed `.com/zh`, `.com/*-zh.html`, duplicated `zh/`, or
cross-repository synchronization workflow.

## Product fact source

Public content must use the current Shooting Cut product source as its fact
baseline. The older user manual is not authoritative for current versions,
mode limits, Free/Pro boundaries, import sources, privacy behavior, upload
targets, or export ceilings.

Re-audit product facts for every release, especially:

- product version and Apple OS requirements
- Auto Trim, Merge, Split Sync, and Stage Mix input limits
- Free, Pro, watermark, intro-card, batch-export, and subscription terms
- Reframe/Track ratios and resolution ceilings
- supported score sources and official per-shot timing availability
- on-device processing and connected-service exceptions
- user-initiated upload destinations

Keep public guide copy competitor-neutral. Internal research may retain source
and tool names when they are needed for evidence provenance.

## Deployment checklist

1. Confirm the working branch is based on the latest `main` without rewriting
   history.
2. Re-audit facts against the current product source and review the English /
   Chinese same-path pairing.
3. Run all local validation commands.
4. Review the complete diff, including canonical, `og:url`, `hreflang`,
   sitemap, homepage navigation, `llms.txt`, and protected files such as
   `CNAME`.
5. Commit with an English message and push the feature branch.
6. Wait for the `Validate site` GitHub Actions workflow to succeed and complete
   independent review.
7. Merge normally into `main`; do not force-push or rewrite published history.
8. Push `main`, then monitor both GitHub Actions and the GitHub Pages
   deployment to terminal success.
9. Live-check `https://shootingcut.com`, every new route, `/llms.txt`,
   canonical URLs, reciprocal `hreflang`, language switches, sitemap contents,
   and expected 404s for removed `.com` Chinese routes.
10. Coordinate the paired Chinese repository deployment and verify both
    domains after both independent commits are live.
