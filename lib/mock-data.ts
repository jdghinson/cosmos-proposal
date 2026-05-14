export type ImageItem = {
  id: string;
  url: string;
  aspect: number; // width / height
  tags: string[];
};

export type ClusterCard = {
  id: string;
  title: string;
  author: string;
  verified?: boolean;
  elements: number;
  images: string[]; // 3 image URLs for the mini composition
};

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

export type SavedCollection = {
  id: string;
  title: string;
  brief: string;
  createdAt: number;
  imageUrls: string[];
  source: "ai" | "manual";
  isPrivate?: boolean;
  collaborators?: Collaborator[];
};

export const sampleCollaborators: Collaborator[] = [
  { id: "u1", name: "Alex Park", email: "alex@studio.co", avatarColor: "#EBB042" },
  { id: "u2", name: "Mira Chen", email: "mira@cosmos.so", avatarColor: "#C877CB" },
  { id: "u3", name: "Jules Rivera", email: "jules@design.dev", avatarColor: "#77CDD0" },
  { id: "u4", name: "Sasha Lin", email: "sasha@studio.co", avatarColor: "#81B386" },
  { id: "u5", name: "Theo Marshall", email: "theo@brand.house", avatarColor: "#4694F6" },
];

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const exploreClusters: ClusterCard[] = [
  {
    id: "print-papper",
    title: "print / papper",
    author: "kepler",
    verified: true,
    elements: 151,
    images: [
      u("1513519245088-0e12902e5a38"),
      u("1561214115-f2f134cc4912"),
      u("1599507593499-a3f7d7d97667"),
    ],
  },
  {
    id: "komorebi",
    title: "Komorebi | 木漏れ日",
    author: "dimitra",
    verified: true,
    elements: 233,
    images: [
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
    ],
  },
  {
    id: "nancy-meyers",
    title: "The Nancy Meyers Fantasy",
    author: "cosmos",
    verified: true,
    elements: 68,
    images: [
      u("1505691938895-1758d7feb511"),
      u("1505691723518-36a5ac3be353"),
      u("1448630360428-65456885c650"),
    ],
  },
  {
    id: "lundin-explore",
    title: "Explore",
    author: "lundinmichelle",
    verified: false,
    elements: 162,
    images: [
      u("1517760444937-f6397edcbbcd"),
      u("1551582045-6ec9c11d8697"),
      u("1493514789931-586cb221d7a7"),
    ],
  },
];

// Aspect ratios that read well in a masonry column. Mix of portrait, square,
// and a few landscape so the columns stagger naturally.
const EXPLORE_ASPECTS = [
  0.75, 1, 0.8, 1.2, 0.667, 1, 0.85, 0.75, 1.1, 0.7, 0.95, 1, 0.8, 1.3, 0.75,
];

// IDs hand-picked from picsum's catalog that read as "designerly" imagery
// (textures, architecture, portraits, still life). Used for the Explore feed
// so we can show a much larger variety than a few hand-curated Unsplash IDs.
const EXPLORE_PICSUM_IDS = [
  1, 10, 17, 20, 24, 26, 28, 33, 36, 42, 48, 49, 54, 60, 64, 65, 76, 80, 82, 88,
  91, 96, 100, 103, 110, 119, 122, 128, 130, 139, 141, 145, 152, 158, 164, 167,
  169, 175, 184, 192, 195, 200, 211, 217, 225, 232, 237, 244, 250, 260, 274,
  287, 308, 326, 342, 365, 392, 419, 447, 480,
];

function buildExploreElements(): ImageItem[] {
  return EXPLORE_PICSUM_IDS.map((id, i) => {
    const aspect = EXPLORE_ASPECTS[i % EXPLORE_ASPECTS.length];
    const w = 600;
    const h = Math.round(w / aspect);
    return {
      id: `e${id}`,
      url: `https://picsum.photos/id/${id}/${w}/${h}`,
      aspect,
      tags: [],
    };
  });
}

export const exploreElements: ImageItem[] = buildExploreElements();

// Curated keyword → image sets so brief results feel intentional.
type ResultSet = { tags: string[]; images: string[] };

const SETS: ResultSet[] = [
  {
    tags: ["warm", "archival", "editorial", "coffee", "natural", "earthy", "vintage"],
    images: [
      u("1495474472287-4d71bcdd2085"),
      u("1442975631115-c4f7b05b8a2c"),
      u("1454486837617-ce8e1ba5ebfe"),
      u("1517336714731-489689fd1ca8"),
      u("1495474472287-4d71bcdd2085"),
      u("1444858291040-58f756a3bdd6"),
      u("1485808191679-5f86510681a2"),
      u("1559056199-641a0ac8b55e"),
      u("1521305916504-4a1121188589"),
      u("1554118811-1e0d58224f24"),
      u("1481277542470-605612bd2d61"),
      u("1495474472287-4d71bcdd2085"),
      u("1454486837617-ce8e1ba5ebfe"),
      u("1517336714731-489689fd1ca8"),
      u("1444858291040-58f756a3bdd6"),
      u("1559056199-641a0ac8b55e"),
    ],
  },
  {
    tags: ["minimal", "tech", "product", "interface", "saas", "clean", "modern"],
    images: [
      u("1517245386807-bb43f82c33c4"),
      u("1551288049-bebda4e38f71"),
      u("1518770660439-4636190af475"),
      u("1551288049-bebda4e38f71"),
      u("1517245386807-bb43f82c33c4"),
      u("1496181133206-80ce9b88a853"),
      u("1486312338219-ce68d2c6f44d"),
      u("1517336714731-489689fd1ca8"),
      u("1551288049-bebda4e38f71"),
      u("1517245386807-bb43f82c33c4"),
      u("1518770660439-4636190af475"),
      u("1496181133206-80ce9b88a853"),
      u("1486312338219-ce68d2c6f44d"),
      u("1517336714731-489689fd1ca8"),
      u("1551288049-bebda4e38f71"),
      u("1517245386807-bb43f82c33c4"),
    ],
  },
  {
    tags: ["fashion", "archival", "couture", "model", "studio", "portrait"],
    images: [
      u("1490481651871-ab68de25d43d"),
      u("1485518882345-15568b007407"),
      u("1469334031218-e382a71b716b"),
      u("1490481651871-ab68de25d43d"),
      u("1485518882345-15568b007407"),
      u("1469334031218-e382a71b716b"),
      u("1517423440428-a5a00ad493e8"),
      u("1496217590455-aa63a8350eea"),
      u("1490481651871-ab68de25d43d"),
      u("1485518882345-15568b007407"),
      u("1469334031218-e382a71b716b"),
      u("1517423440428-a5a00ad493e8"),
      u("1496217590455-aa63a8350eea"),
      u("1485518882345-15568b007407"),
      u("1517423440428-a5a00ad493e8"),
      u("1469334031218-e382a71b716b"),
    ],
  },
  {
    tags: ["brutalism", "architecture", "concrete", "raw", "structural", "monochrome"],
    images: [
      u("1481277542470-605612bd2d61"),
      u("1486718448742-163732cd1544"),
      u("1496564203457-11bb12075d90"),
      u("1473773508845-188df298d2d1"),
      u("1486718448742-163732cd1544"),
      u("1496564203457-11bb12075d90"),
      u("1481277542470-605612bd2d61"),
      u("1473773508845-188df298d2d1"),
      u("1486718448742-163732cd1544"),
      u("1481277542470-605612bd2d61"),
      u("1496564203457-11bb12075d90"),
      u("1473773508845-188df298d2d1"),
      u("1486718448742-163732cd1544"),
      u("1496564203457-11bb12075d90"),
      u("1473773508845-188df298d2d1"),
      u("1481277542470-605612bd2d61"),
    ],
  },
  {
    tags: ["botanical", "nature", "plant", "garden", "soft", "muted", "organic", "floral"],
    images: [
      u("1490750967868-88aa4486c946"),
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
      u("1502082553048-f009c37129b9"),
      u("1500382017468-9049fed747ef"),
      u("1490750967868-88aa4486c946"),
    ],
  },
];

const FALLBACK: string[] = [
  u("1495474472287-4d71bcdd2085"),
  u("1485518882345-15568b007407"),
  u("1486718448742-163732cd1544"),
  u("1490750967868-88aa4486c946"),
  u("1517245386807-bb43f82c33c4"),
  u("1469334031218-e382a71b716b"),
  u("1495474472287-4d71bcdd2085"),
  u("1500382017468-9049fed747ef"),
  u("1517336714731-489689fd1ca8"),
  u("1444858291040-58f756a3bdd6"),
  u("1481277542470-605612bd2d61"),
  u("1502082553048-f009c37129b9"),
  u("1518770660439-4636190af475"),
  u("1496181133206-80ce9b88a853"),
  u("1496217590455-aa63a8350eea"),
  u("1486312338219-ce68d2c6f44d"),
];

// A large pool of picsum.photos IDs (each maps to a real photo). Used to
// pad themed results with extra random variety so every Generate call surfaces
// fresh imagery. Picsum returns 200 for IDs 0–1084; we cherry-pick IDs that
// skew photographic / design-friendly.
const PICSUM_POOL: number[] = [
  1, 10, 11, 13, 17, 20, 21, 24, 26, 28, 29, 30, 31, 33, 36, 37, 39, 40, 42, 44,
  48, 49, 50, 54, 57, 58, 60, 64, 65, 66, 67, 68, 71, 72, 75, 76, 77, 80, 82, 84,
  88, 91, 96, 99, 100, 101, 102, 103, 104, 106, 110, 112, 116, 119, 122, 128, 129,
  130, 133, 134, 139, 141, 145, 152, 158, 160, 164, 167, 169, 175, 180, 184, 189,
  192, 195, 200, 201, 206, 211, 217, 225, 227, 232, 237, 240, 244, 250, 257, 260,
  267, 274, 280, 287, 293, 301, 308, 312, 317, 326, 333, 338, 342, 347, 351, 357,
  365, 372, 380, 386, 392, 399, 406, 412, 419, 425, 433, 439, 447, 453, 460, 467,
  474, 480, 488, 495, 501, 509, 515, 522, 529, 536, 542, 548, 553, 558, 564, 569,
  575, 581, 589, 593, 600, 605, 611, 619, 625, 633, 638, 645, 651, 657, 666, 671,
  678, 685, 693, 700, 708, 712, 717, 725, 731, 737, 744, 750, 756, 761, 768, 775,
  782, 790, 800, 807, 814, 822, 830, 836, 843, 850, 857, 864, 870, 878, 885, 894,
  901, 910, 920, 930, 940, 950, 960, 970, 980, 990, 1000, 1018, 1025, 1031, 1040,
  1050, 1062, 1074, 1080, 1084,
];

function picsumUrl(id: number, w = 600): string {
  // Vary dimensions slightly to push aspect ratio diversity from the CDN itself.
  const heights = [600, 800, 700, 900, 750, 850, 650];
  const h = heights[id % heights.length];
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  // Deterministic Fisher–Yates so the same seed yields the same order, but
  // different seeds (e.g. Date.now()) produce visibly different results.
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function resultsForBrief(brief: string, extraTags: string[] = []): string[] {
  const haystack = (brief + " " + extraTags.join(" ")).toLowerCase();
  let best: ResultSet | null = null;
  let bestScore = 0;
  for (const set of SETS) {
    const score = set.tags.reduce((acc, t) => (haystack.includes(t) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      best = set;
      bestScore = score;
    }
  }
  const seed = Date.now() + Math.floor(Math.random() * 9973);
  const themed = best?.images ?? FALLBACK;
  // Take a few themed images so the result still nods to the brief,
  // then fill the rest with random picsum images for variety.
  const themedPick = shuffle(themed, seed).slice(0, 5);
  const randomPick = shuffle(PICSUM_POOL, seed + 7).slice(0, 13).map((id) => picsumUrl(id));
  return shuffle([...themedPick, ...randomPick], seed + 13).slice(0, 16);
}

const STOPWORDS = new Set([
  "a", "an", "the", "for", "of", "with", "to", "and", "or", "on", "in", "by", "from",
]);

export function suggestTitle(brief: string): string {
  const trimmed = brief.trim();
  if (!trimmed) return "Untitled collection";
  const tokens = trimmed
    .replace(/[.,;:\n!?\-—]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const kept: string[] = [];
  for (const t of tokens) {
    if (kept.length >= 5) break;
    if (STOPWORDS.has(t.toLowerCase()) && kept.length === 0) continue;
    kept.push(t);
  }
  while (kept.length > 1 && STOPWORDS.has(kept[kept.length - 1].toLowerCase())) {
    kept.pop();
  }
  const words = (kept.length ? kept : tokens.slice(0, 5)).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export const projectTypes = [
  "Branding",
  "Product",
  "Website",
  "Editorial",
  "Identity",
  "Packaging",
] as const;
export type ProjectType = (typeof projectTypes)[number];

export const seededAICollections: SavedCollection[] = [
  {
    id: "seed-warm-archive",
    title: "Warm archival editorial",
    brief: "A warm, archival editorial for a coffee brand. Earthy, soft, type-led.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    imageUrls: resultsForBrief("warm archival editorial coffee"),
    source: "ai",
  },
  {
    id: "seed-minimal-saas",
    title: "Minimal SaaS landing",
    brief: "Clean minimal tech product interfaces for a developer tool launch.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    imageUrls: resultsForBrief("minimal tech product interface saas"),
    source: "ai",
  },
];

export const exploreCategories = [
  "Featured",
  "Shop",
  "Graphic Design",
  "Art",
  "Fashion",
  "Branding",
  "Interiors",
  "Typography",
  "Architecture",
  "Interfaces",
  "Nature",
  "Cinema",
  "Motion",
  "Technology",
  "Portraiture",
  "Quotes",
  "Emotion",
  "Symbol & Myth",
  "Weddings",
];

export const recentSearches = ["brutalism typography posters", "webinar poster", "typography poster"];
export const recentColors = ["#57612C", "#CB1E1E", "#601515", "#6BA661", "#949494"];
