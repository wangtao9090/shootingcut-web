import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const siteRoot = process.cwd();
const productionOrigin = "https://shootingcut.com";
const excludedDirectories = new Set([
  ".git",
  ".worktrees",
  ".superpowers",
  "docs",
]);

const failures = [];
const counts = {
  htmlPages: 0,
  jsonLdBlocks: 0,
  localLinks: 0,
  sitemapLocations: 0,
};

function toPosixPath(...parts) {
  return path.posix.join(...parts);
}

function absolutePath(relativePath) {
  return path.join(siteRoot, ...relativePath.split("/"));
}

function lineNumber(source, index) {
  return source.slice(0, Math.max(0, index)).split("\n").length;
}

function addFailure(relativePath, source, index, message) {
  failures.push({
    relativePath,
    line: lineNumber(source, index),
    message: message.replace(/\s+/g, " ").trim(),
  });
}

async function discoverPublicFiles(relativeDirectory = "") {
  const directory = relativeDirectory
    ? absolutePath(relativeDirectory)
    : siteRoot;
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const relativePath = relativeDirectory
      ? toPosixPath(relativeDirectory, entry.name)
      : entry.name;

    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        files.push(...(await discoverPublicFiles(relativePath)));
      }
      continue;
    }

    if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

function decodeCharacterReference(reference) {
  const normalized = reference.toLowerCase();
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  if (normalized in named) {
    return named[normalized];
  }
  if (/^#x[0-9a-f]+$/i.test(reference)) {
    return String.fromCodePoint(Number.parseInt(reference.slice(2), 16));
  }
  if (/^#[0-9]+$/.test(reference)) {
    return String.fromCodePoint(Number.parseInt(reference.slice(1), 10));
  }
  return `&${reference};`;
}

function decodeHtmlAttribute(value) {
  return value.replace(
    /&(amp|apos|gt|lt|quot|#x[0-9a-f]+|#[0-9]+);/gi,
    (_, reference) => decodeCharacterReference(reference),
  );
}

function parseAttributes(attributeSource, sourceIndex) {
  const attributes = [];
  const attributePattern =
    /([^\s"'=<>`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attributePattern.exec(attributeSource)) !== null) {
    const value = match[2] ?? match[3] ?? match[4];
    let valueOffset = match.index;

    if (value !== undefined) {
      const equalsOffset = match[0].indexOf("=");
      const afterEquals = match[0].slice(equalsOffset + 1);
      const whitespaceLength = afterEquals.length - afterEquals.trimStart().length;
      const quoteLength = /^["']/.test(afterEquals.trimStart()) ? 1 : 0;
      valueOffset += equalsOffset + 1 + whitespaceLength + quoteLength;
    }

    attributes.push({
      name: match[1].toLowerCase(),
      value,
      index: sourceIndex + valueOffset,
    });
  }

  return attributes;
}

function scanStartTags(source) {
  const tags = [];
  const tagPattern =
    /<([A-Za-z][A-Za-z0-9:-]*)(?=\s|\/?>)((?:"[^"]*"|'[^']*'|[^'"<>])*)>/g;
  let match;

  while ((match = tagPattern.exec(source)) !== null) {
    tags.push({
      name: match[1].toLowerCase(),
      index: match.index,
      endIndex: tagPattern.lastIndex,
      attributes: parseAttributes(
        match[2],
        match.index + 1 + match[1].length,
      ),
    });
  }

  return tags;
}

function findAttribute(tag, name) {
  return tag.attributes.find((attribute) => attribute.name === name);
}

function currentRoute(relativePath) {
  if (relativePath === "index.html") {
    return "/";
  }
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length)}`;
  }
  return `/${relativePath}`;
}

function routeCandidates(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  const normalizedPath = path.posix
    .normalize(`/${decodedPath}`)
    .replace(/^\/+|\/+$/g, "");
  if (!normalizedPath) {
    return ["index.html"];
  }
  if (pathname.endsWith("/")) {
    return [`${normalizedPath}/index.html`];
  }

  const candidates = [normalizedPath];
  if (!path.posix.extname(normalizedPath)) {
    candidates.push(`${normalizedPath}.html`, `${normalizedPath}/index.html`);
  }
  return [...new Set(candidates)];
}

function resolveRoute(pathname, publicFiles) {
  return (
    routeCandidates(pathname).find((candidate) => publicFiles.has(candidate)) ??
    null
  );
}

function productionUrlRoute(rawUrl, publicFiles) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return { error: `"${rawUrl}" is not a valid absolute URL` };
  }

  if (url.origin !== productionOrigin) {
    return {
      error: `"${rawUrl}" must use ${productionOrigin}`,
    };
  }
  if (url.username || url.password) {
    return { error: `"${rawUrl}" must not include credentials` };
  }
  if (url.search || url.hash) {
    return {
      error: `"${rawUrl}" must not include a query string or fragment`,
    };
  }

  const resolved = resolveRoute(url.pathname, publicFiles);
  if (!resolved || !resolved.endsWith(".html")) {
    return {
      error: `"${rawUrl}" does not resolve to a public HTML page`,
    };
  }
  return { route: resolved };
}

function parseJsonLd(page) {
  const scriptPattern =
    /<script\b((?:"[^"]*"|'[^']*'|[^'"<>])*)>/gi;
  const closingPattern = /<\/script\s*>/gi;
  let opening;

  while ((opening = scriptPattern.exec(page.source)) !== null) {
    const attributes = parseAttributes(
      opening[1],
      opening.index + "<script".length,
    );
    const type = attributes.find((attribute) => attribute.name === "type");
    closingPattern.lastIndex = scriptPattern.lastIndex;
    const closing = closingPattern.exec(page.source);
    const isJsonLd =
      type?.value?.trim().toLowerCase() === "application/ld+json";

    if (!closing) {
      if (isJsonLd) {
        counts.jsonLdBlocks += 1;
        addFailure(
          page.relativePath,
          page.source,
          opening.index,
          "JSON-LD script block is not closed",
        );
      }
      break;
    }

    if (isJsonLd) {
      counts.jsonLdBlocks += 1;
      const jsonSource = page.source.slice(
        scriptPattern.lastIndex,
        closing.index,
      );
      try {
        JSON.parse(jsonSource);
      } catch (error) {
        addFailure(
          page.relativePath,
          page.source,
          scriptPattern.lastIndex,
          `invalid JSON-LD: ${error.message}`,
        );
      }
    }

    scriptPattern.lastIndex = closingPattern.lastIndex;
  }
}

function collectIds(page) {
  const ids = new Set();
  for (const tag of page.tags) {
    const id = findAttribute(tag, "id");
    if (id?.value !== undefined) {
      ids.add(decodeHtmlAttribute(id.value));
    }
  }
  return ids;
}

function isSkippableUrl(value) {
  return (
    value.startsWith("//") ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)
  );
}

function validateLocalLinks(page, pages, publicFiles) {
  const linkAttributeNames = new Set(["href", "poster", "src"]);
  const baseUrl = `${productionOrigin}${currentRoute(page.relativePath)}`;

  for (const tag of page.tags) {
    for (const attribute of tag.attributes) {
      if (
        !linkAttributeNames.has(attribute.name) ||
        attribute.value === undefined
      ) {
        continue;
      }

      const rawValue = decodeHtmlAttribute(attribute.value).trim();
      if (isSkippableUrl(rawValue)) {
        continue;
      }

      counts.localLinks += 1;
      let url;
      try {
        url = new URL(rawValue, baseUrl);
      } catch {
        addFailure(
          page.relativePath,
          page.source,
          attribute.index,
          `${attribute.name}="${attribute.value}" is not a valid local URL`,
        );
        continue;
      }

      if (url.origin !== productionOrigin) {
        continue;
      }

      const target = resolveRoute(url.pathname, publicFiles);
      if (!target) {
        addFailure(
          page.relativePath,
          page.source,
          attribute.index,
          `local target "${attribute.value}" does not exist`,
        );
        continue;
      }

      if (!url.hash || !target.endsWith(".html")) {
        continue;
      }

      let fragment;
      try {
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch {
        addFailure(
          page.relativePath,
          page.source,
          attribute.index,
          `fragment "${url.hash}" is not valid URL encoding`,
        );
        continue;
      }

      if (fragment && !pages.get(target)?.ids.has(fragment)) {
        addFailure(
          page.relativePath,
          page.source,
          attribute.index,
          `fragment "#${fragment}" does not exist in ${target}`,
        );
      }
    }
  }
}

function collectLocaleMetadata(page) {
  const canonical = [];
  const alternates = new Map();

  for (const tag of page.tags.filter((candidate) => candidate.name === "link")) {
    const rel = findAttribute(tag, "rel");
    if (!rel?.value) {
      continue;
    }

    const relationships = rel.value.toLowerCase().split(/\s+/);
    const href = findAttribute(tag, "href");
    if (relationships.includes("canonical")) {
      canonical.push({
        href: href?.value,
        index: href?.index ?? tag.index,
      });
    }

    if (relationships.includes("alternate")) {
      const hreflang = findAttribute(tag, "hreflang");
      if (!hreflang?.value) {
        continue;
      }
      const language = hreflang.value.toLowerCase();
      const entries = alternates.get(language) ?? [];
      entries.push({
        href: href?.value,
        index: href?.index ?? tag.index,
      });
      alternates.set(language, entries);
    }
  }

  return { canonical, alternates };
}

function requireSingleMetadataEntry(page, entries, label) {
  if (entries.length !== 1) {
    addFailure(
      page.relativePath,
      page.source,
      entries[1]?.index ?? entries[0]?.index ?? 0,
      `expected exactly one ${label}; found ${entries.length}`,
    );
    return null;
  }
  if (!entries[0].href) {
    addFailure(
      page.relativePath,
      page.source,
      entries[0].index,
      `${label} is missing href`,
    );
    return null;
  }
  return entries[0];
}

function validateLocaleMetadata(page, publicFiles) {
  const metadata = collectLocaleMetadata(page);
  const resolved = {
    canonical: null,
    en: null,
    zh: null,
    default: null,
    indexes: {},
  };

  const canonical = requireSingleMetadataEntry(
    page,
    metadata.canonical,
    "canonical link",
  );
  if (canonical) {
    const result = productionUrlRoute(
      decodeHtmlAttribute(canonical.href),
      publicFiles,
    );
    if (result.error) {
      addFailure(
        page.relativePath,
        page.source,
        canonical.index,
        `canonical ${result.error}`,
      );
    } else {
      resolved.canonical = result.route;
      if (result.route !== page.relativePath) {
        addFailure(
          page.relativePath,
          page.source,
          canonical.index,
          `canonical maps to ${result.route}, not the current page`,
        );
      }
    }
  }

  const requiredLanguages = [
    ["en", "en"],
    ["zh-hans", "zh"],
    ["x-default", "default"],
  ];
  for (const [language, key] of requiredLanguages) {
    const entry = requireSingleMetadataEntry(
      page,
      metadata.alternates.get(language) ?? [],
      `alternate link for hreflang="${language === "zh-hans" ? "zh-Hans" : language}"`,
    );
    if (!entry) {
      continue;
    }

    resolved.indexes[key] = entry.index;
    const result = productionUrlRoute(
      decodeHtmlAttribute(entry.href),
      publicFiles,
    );
    if (result.error) {
      addFailure(
        page.relativePath,
        page.source,
        entry.index,
        `hreflang="${language}" alternate ${result.error}`,
      );
    } else {
      resolved[key] = result.route;
    }
  }

  for (const entry of metadata.alternates.get("zh") ?? []) {
    addFailure(
      page.relativePath,
      page.source,
      entry.index,
      'use hreflang="zh-Hans" instead of hreflang="zh"',
    );
  }

  if (resolved.default && resolved.en && resolved.default !== resolved.en) {
    addFailure(
      page.relativePath,
      page.source,
      resolved.indexes.default,
      `x-default must point to the English counterpart (${resolved.en})`,
    );
  }
  if (
    resolved.en &&
    resolved.zh &&
    page.relativePath !== resolved.en &&
    page.relativePath !== resolved.zh
  ) {
    addFailure(
      page.relativePath,
      page.source,
      resolved.indexes.en,
      "current page must be either its English or Chinese locale target",
    );
  }

  return resolved;
}

function validateLocaleReciprocity(page, pages) {
  const locale = page.locale;
  if (!locale.en || !locale.zh || !locale.default) {
    return;
  }

  for (const target of [locale.en, locale.zh]) {
    const counterpart = pages.get(target);
    if (
      !counterpart?.locale ||
      counterpart.locale.en !== locale.en ||
      counterpart.locale.zh !== locale.zh ||
      counterpart.locale.default !== locale.en
    ) {
      addFailure(
        page.relativePath,
        page.source,
        locale.indexes.en ?? 0,
        `locale alternates do not reciprocate with ${target}`,
      );
    }
  }
}

const directFactRules = [
  {
    pattern: /\bshot\s*streamer\b/i,
    message: "prohibited competitor name: Shot Streamer",
  },
  {
    pattern: /\bcyfrtimer\b/i,
    message: "prohibited competitor name: cyfrTimer",
  },
  {
    pattern: /\bcapcut\b/i,
    message: "prohibited competitor name: CapCut",
  },
  {
    pattern: /\bmatchchaser\b/i,
    message: "prohibited competitor name: MatchChaser",
  },
  {
    pattern:
      /\b(?:one[\s-]+purchase|single[\s-]+purchase|one[\s-]+time[\s-]+purchase|lifetime[\s-]+(?:purchase|access))\b/i,
    message: "stale purchase claim",
  },
  {
    pattern: /一次\s*购买|买断|终身/i,
    message: "stale purchase claim",
  },
  {
    pattern: /\b100\s*%\s*secure\b/i,
    message: "absolute privacy claim",
  },
  {
    pattern: /\bno\s+analytics\b/i,
    message: "absolute privacy claim",
  },
  {
    pattern: /\bno\s+third\s+part(?:y|ies)\b/i,
    message: "absolute privacy claim",
  },
  {
    pattern: /\bno\s+data\s+leaves\b/i,
    message: "absolute privacy claim",
  },
  {
    pattern:
      /\beverything\s+stays\s+entirely\s+on\s+(?:the\s+)?device\b/i,
    message: "absolute privacy claim",
  },
  {
    pattern: /\ball\s+features\b.{0,40}\boffline\b|\bfull(?:y)?\s+offline\b/i,
    message: "absolute offline claim",
  },
  {
    pattern: /100\s*%\s*安全|无任何分析|无第三方|没有任何数据离开|完全离线可用/i,
    message: "absolute privacy or offline claim",
  },
];

const contextualFactRules = [
  {
    pattern:
      /(?:\bstage\s*mix\b|\bcameras?\b|\bvideos?\b|机位|视频).{0,120}(?:\b3\s*\+|three\s+or\s+more|3\s*个\s*或\s*更多|三\s*机位\s*以上)|(?:\b3\s*\+|three\s+or\s+more|3\s*个\s*或\s*更多|三\s*机位\s*以上).{0,120}(?:\bstage\s*mix\b|\bcameras?\b|\bvideos?\b|机位|视频)/i,
    message: "stale Stage Mix input-count claim",
  },
  {
    pattern:
      /\bstrings\b.{0,80}\b(?:editing\s+)?(?:mode|workflow)\b|\b(?:editing\s+)?(?:mode|workflow)s?\b.{0,80}\bstrings\b/i,
    message: 'obsolete "Strings" editing-mode claim',
  },
  {
    pattern:
      /\btiktok\b.{0,100}\b(?:direct(?:ly)?\s+upload|upload(?:ed|ing|s)?|integrat(?:e|ed|es|ing|ion)|connect(?:ed|ing|ion|s)?|share\s+(?:directly\s+)?to|post(?:ed|ing|s)?\s+to|publish(?:ed|ing|es)?\s+to)\b|(?:direct(?:ly)?\s+upload|upload(?:ed|ing|s)?|integrat(?:e|ed|es|ing|ion)|connect(?:ed|ing|ion|s)?|share\s+(?:directly\s+)?to|post(?:ed|ing|s)?\s+to|publish(?:ed|ing|es)?\s+to).{0,100}\btiktok\b/i,
    message: "TikTok direct-upload or integration claim",
  },
  {
    pattern:
      /tiktok.{0,100}(?:直传|直接上传|上传|集成|整合|连接|分享到|发布到)|(?:直传|直接上传|上传|集成|整合|连接|分享到|发布到).{0,100}tiktok/i,
    message: "TikTok direct-upload or integration claim",
  },
];

function isFactLintPage(relativePath) {
  if (relativePath === "oauth" || relativePath.startsWith("oauth/")) {
    return false;
  }
  const basename = path.posix.basename(relativePath).toLowerCase();
  return !/^(?:privacy|terms|support).*\.html$/.test(basename);
}

function visibleLine(line) {
  return line
    .replace(/<!--.*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ");
}

function validateMarketingFacts(page) {
  if (!isFactLintPage(page.relativePath)) {
    return;
  }

  const lines = page.source.split("\n");
  for (const [offset, sourceLine] of lines.entries()) {
    const line = visibleLine(sourceLine);
    for (const rule of [...directFactRules, ...contextualFactRules]) {
      if (rule.pattern.test(line)) {
        failures.push({
          relativePath: page.relativePath,
          line: offset + 1,
          message: rule.message,
        });
      }
    }

    if (
      /<(?:h[1-6]|dt|strong)\b[^>]*>\s*strings\s*<\/(?:h[1-6]|dt|strong)>/i.test(
        sourceLine,
      )
    ) {
      failures.push({
        relativePath: page.relativePath,
        line: offset + 1,
        message: 'obsolete "Strings" editing-mode heading',
      });
    }
  }
}

function decodeXmlText(text) {
  const invalidReference = text.match(
    /&(?!(?:amp|apos|gt|lt|quot|#x[0-9a-f]+|#[0-9]+);)/i,
  );
  if (invalidReference) {
    return { error: "contains an unescaped or invalid XML entity" };
  }
  return {
    value: text.replace(
      /&(amp|apos|gt|lt|quot|#x[0-9a-f]+|#[0-9]+);/gi,
      (_, reference) => decodeCharacterReference(reference),
    ),
  };
}

function parseSitemap(source) {
  const locations = [];
  const stack = [];
  const tokenPattern =
    /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[A-Za-z_][A-Za-z0-9_.:-]*(?:"[^"]*"|'[^']*'|[^'"<>])*>|[^<]+/g;
  let rootSeen = false;
  let rootClosed = false;
  let lastIndex = 0;
  let token;

  const closeNode = (node, index) => {
    if (node.localName === "loc") {
      const decoded = decodeXmlText(node.text.trim());
      if (decoded.error) {
        addFailure("sitemap.xml", source, node.index, `sitemap <loc> ${decoded.error}`);
      } else if (!decoded.value) {
        addFailure("sitemap.xml", source, node.index, "sitemap <loc> must not be empty");
      } else {
        locations.push({ value: decoded.value, index: node.index });
      }
    }
    if (node.localName === "url" && node.locCount !== 1) {
      addFailure(
        "sitemap.xml",
        source,
        node.index,
        `sitemap <url> must contain exactly one direct <loc>; found ${node.locCount}`,
      );
    }
    if (node.localName === "urlset") {
      rootClosed = true;
    }
    node.closedAt = index;
  };

  while ((token = tokenPattern.exec(source)) !== null) {
    if (token.index !== lastIndex) {
      addFailure(
        "sitemap.xml",
        source,
        lastIndex,
        "sitemap contains malformed XML syntax",
      );
    }
    lastIndex = tokenPattern.lastIndex;
    const value = token[0];

    if (value.startsWith("<!--") || value.startsWith("<?")) {
      continue;
    }
    if (value.startsWith("<![CDATA[")) {
      addFailure(
        "sitemap.xml",
        source,
        token.index,
        "CDATA is not allowed in sitemap.xml",
      );
      continue;
    }
    if (!value.startsWith("<")) {
      const current = stack.at(-1);
      if (current?.localName === "loc") {
        current.text += value;
      } else if (
        value.trim() &&
        !["changefreq", "lastmod", "priority"].includes(current?.localName)
      ) {
        addFailure(
          "sitemap.xml",
          source,
          token.index,
          "unexpected text outside sitemap <loc>",
        );
      }
      continue;
    }

    if (value.startsWith("</")) {
      const name = value.slice(2, -1).trim();
      const current = stack.at(-1);
      if (!current || current.name !== name) {
        addFailure(
          "sitemap.xml",
          source,
          token.index,
          `mismatched closing tag </${name}>`,
        );
        continue;
      }
      stack.pop();
      closeNode(current, token.index);
      continue;
    }

    const nameMatch = value.match(/^<([A-Za-z_][A-Za-z0-9_.:-]*)/);
    const name = nameMatch?.[1] ?? "";
    const localName = name.includes(":") ? name.split(":").at(-1) : name;
    const parent = stack.at(-1);
    const selfClosing = /\/\s*>$/.test(value);

    if (!parent) {
      if (rootSeen || rootClosed) {
        addFailure(
          "sitemap.xml",
          source,
          token.index,
          "sitemap must contain exactly one root element",
        );
      }
      rootSeen = true;
      if (localName !== "urlset") {
        addFailure(
          "sitemap.xml",
          source,
          token.index,
          "sitemap root element must be <urlset>",
        );
      }
    } else if (parent.localName === "urlset" && localName !== "url") {
      addFailure(
        "sitemap.xml",
        source,
        token.index,
        `<${name}> is not a valid direct child of <urlset>`,
      );
    } else if (localName === "url" && parent.localName !== "urlset") {
      addFailure(
        "sitemap.xml",
        source,
        token.index,
        "<url> must be a direct child of <urlset>",
      );
    } else if (localName === "loc" && parent.localName !== "url") {
      addFailure(
        "sitemap.xml",
        source,
        token.index,
        "<loc> must be a direct child of <url>",
      );
    } else if (parent.localName === "loc") {
      addFailure(
        "sitemap.xml",
        source,
        token.index,
        "<loc> must contain text only",
      );
    }

    const node = {
      name,
      localName,
      index: token.index,
      locCount: 0,
      text: "",
    };
    if (localName === "loc" && parent?.localName === "url") {
      parent.locCount += 1;
    }
    stack.push(node);

    if (selfClosing) {
      stack.pop();
      closeNode(node, token.index);
    }
  }

  if (lastIndex !== source.length) {
    addFailure(
      "sitemap.xml",
      source,
      lastIndex,
      "sitemap contains malformed XML syntax",
    );
  }
  if (!rootSeen) {
    addFailure("sitemap.xml", source, 0, "sitemap root <urlset> is missing");
  }
  if (stack.length) {
    addFailure(
      "sitemap.xml",
      source,
      stack.at(-1).index,
      `unclosed sitemap element <${stack.at(-1).name}>`,
    );
  }

  return locations;
}

async function validateSitemap(publicFiles) {
  let source;
  try {
    source = await readFile(absolutePath("sitemap.xml"), "utf8");
  } catch (error) {
    failures.push({
      relativePath: "sitemap.xml",
      line: 1,
      message: `cannot read sitemap.xml: ${error.message}`,
    });
    return;
  }

  if (/<!DOCTYPE/i.test(source)) {
    addFailure(
      "sitemap.xml",
      source,
      source.search(/<!DOCTYPE/i),
      "DOCTYPE is not allowed in sitemap.xml",
    );
  }

  const locations = parseSitemap(source);
  counts.sitemapLocations = locations.length;
  const seen = new Map();

  for (const location of locations) {
    let url;
    try {
      url = new URL(location.value);
    } catch {
      addFailure(
        "sitemap.xml",
        source,
        location.index,
        `sitemap location "${location.value}" is not a valid absolute URL`,
      );
      continue;
    }

    if (url.origin !== productionOrigin || url.username || url.password) {
      addFailure(
        "sitemap.xml",
        source,
        location.index,
        `sitemap location "${location.value}" must use ${productionOrigin}`,
      );
      continue;
    }
    if (url.search || url.hash) {
      addFailure(
        "sitemap.xml",
        source,
        location.index,
        `sitemap location "${location.value}" must not include a query or fragment`,
      );
    }

    if (seen.has(url.href)) {
      addFailure(
        "sitemap.xml",
        source,
        location.index,
        `duplicate sitemap location "${location.value}"`,
      );
    } else {
      seen.set(url.href, location.index);
    }

    const target = resolveRoute(url.pathname, publicFiles);
    if (!target || !target.endsWith(".html")) {
      addFailure(
        "sitemap.xml",
        source,
        location.index,
        `sitemap location "${location.value}" does not resolve to a public page`,
      );
    }
  }
}

async function main() {
  const discoveredFiles = await discoverPublicFiles();
  const publicFiles = new Set(discoveredFiles);
  const htmlFiles = discoveredFiles.filter((file) => file.endsWith(".html"));
  counts.htmlPages = htmlFiles.length;

  const pages = new Map(
    await Promise.all(
      htmlFiles.map(async (relativePath) => {
        const source = await readFile(absolutePath(relativePath), "utf8");
        const page = {
          relativePath,
          source,
          tags: scanStartTags(source),
        };
        page.ids = collectIds(page);
        return [relativePath, page];
      }),
    ),
  );

  for (const page of pages.values()) {
    parseJsonLd(page);
    validateMarketingFacts(page);
  }
  for (const page of pages.values()) {
    validateLocalLinks(page, pages, publicFiles);
  }

  const normalPages = [...pages.values()].filter(
    (page) => !page.relativePath.startsWith("oauth/"),
  );
  for (const page of normalPages) {
    page.locale = validateLocaleMetadata(page, publicFiles);
  }
  for (const page of normalPages) {
    validateLocaleReciprocity(page, pages);
  }

  await validateSitemap(publicFiles);

  failures.sort(
    (left, right) =>
      left.relativePath.localeCompare(right.relativePath) ||
      left.line - right.line ||
      left.message.localeCompare(right.message),
  );

  if (failures.length) {
    console.error(`Site validation failed with ${failures.length} error(s):`);
    for (const failure of failures) {
      console.error(
        `- ${failure.relativePath}:${failure.line} ${failure.message}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Validated ${counts.htmlPages} HTML pages, ${counts.jsonLdBlocks} JSON-LD ${
      counts.jsonLdBlocks === 1 ? "block" : "blocks"
    }, ${counts.localLinks} local link targets, and ${
      counts.sitemapLocations
    } sitemap locations.`,
  );
}

await main();
