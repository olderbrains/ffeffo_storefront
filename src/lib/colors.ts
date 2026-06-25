/**
 * Maps human colour names (as stored on product variants) to swatch hex values.
 * Resolution order:
 *   1. Exact match in BRAND_COLORS (speffo palette)
 *   2. Native CSS color name via canvas (browser) or lookup table (server)
 *   3. Hex string passed directly (#abc or #aabbcc)
 *   4. Keyword extraction — "dark blue" → darken navy, "light pink" → lighten etc.
 *   5. Word-level fuzzy match against the brand palette
 *   6. Neutral stone fallback
 */

const BRAND_COLORS: Record<string, string> = {
  sage: '#9CAF88',
  oatmeal: '#D9CFBC',
  black: '#1C1C1C',
  clay: '#B5663F',
  charcoal: '#3A3A3A',
  olive: '#6B6B47',
  sand: '#D8C4A0',
  'dusty rose': '#C08A86',
  ecru: '#E4DBCA',
  navy: '#2A3650',
  stone: '#B8AE9C',
  forest: '#39492F',
  mustard: '#C99A2E',
  sky: '#A7C4D6',
  cream: '#F3EBDD',
  slate: '#5A6470',
  rust: '#A8552E',
  white: '#FBFAF6',
  khaki: '#B3A179',
  indigo: '#3B4A6B',
  // extended common names
  red: '#C0392B',
  blue: '#2C5F8A',
  green: '#2E7D32',
  yellow: '#F9C02A',
  orange: '#D9651A',
  pink: '#E87F9A',
  purple: '#6B3FA0',
  brown: '#795548',
  grey: '#9E9E9E',
  gray: '#9E9E9E',
  beige: '#D6C4A1',
  maroon: '#7B2246',
  teal: '#00796B',
  coral: '#E8735A',
  burgundy: '#6D1E3A',
  'off white': '#F3EBDD',
  'off-white': '#F3EBDD',
  ivory: '#F8F4E9',
  'bottle green': '#1B5E20',
  'dark green': '#1B5E20',
  'light blue': '#82B4D0',
  'dark blue': '#1A2D45',
  'sky blue': '#A7C4D6',
  'royal blue': '#2044A0',
  'baby blue': '#B8D8E8',
  'light pink': '#F0AABB',
  'hot pink': '#D63178',
  'dark red': '#8B0000',
  'dark brown': '#4A2C1A',
  'light grey': '#D4D4D4',
  'light gray': '#D4D4D4',
  'dark grey': '#555555',
  'dark gray': '#555555',
  silver: '#C0C0C0',
  gold: '#C9A84C',
  camel: '#C19A6B',
  tan: '#D2B48C',
  nude: '#E3C19F',
  peach: '#FFCBA4',
  lavender: '#B59DC8',
  lilac: '#C8A2C8',
  mauve: '#B08A90',
  mint: '#A8D8B9',
  turquoise: '#40B4C0',
  cyan: '#00BCD4',
  magenta: '#C2185B',
  violet: '#7C3AED',
  wine: '#722F37',
  rose: '#C07080',
  blush: '#DE9BAE',
  cobalt: '#1640A8',
  denim: '#3E5C8A',
  khakhi: '#B3A179',
  taupe: '#8B7D6B',
  mocha: '#7B5B45',
  latte: '#C4A882',
  espresso: '#3E2010',
  'forest green': '#39492F',
  'olive green': '#6B6B47',
  'army green': '#4B5320',
  'hunter green': '#355E3B',
  emerald: '#2ECC71',
  'mint green': '#A8D8B9',
  aqua: '#00BCD4',
  'light green': '#A5D6A7',
  lime: '#CDDC39',
  chartreuse: '#ADFF2F',
  amber: '#FFC107',
  ochre: '#CC7700',
  saffron: '#F4C430',
  crimson: '#DC143C',
  scarlet: '#FF2400',
  vermillion: '#E34234',
  terracotta: '#C1440E',
  copper: '#B87333',
  bronze: '#CD7F32',
  champagne: '#F7E7CE',
  pearl: '#F5F0E8',
  'raw umber': '#826644',
  mahogany: '#C04000',
  walnut: '#5D3A1A',
  chocolate: '#5C3317',
};

/** Modifier adjustments — shifts lightness */
const LIGHT_MODS = new Set(['light', 'pale', 'pastel', 'baby', 'powder', 'soft']);
const DARK_MODS = new Set(['dark', 'deep', 'rich', 'bold', 'strong', 'bright']);

function adjustHex(hex: string, amount: number): string {
  const n = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(n.slice(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(n.slice(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(n.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function isHex(s: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s);
}

function expandShortHex(hex: string): string {
  if (hex.length === 4) {
    return '#' + hex[1]! + hex[1]! + hex[2]! + hex[2]! + hex[3]! + hex[3]!;
  }
  return hex;
}

export function colorHex(name: string): string {
  const raw = name.trim();
  const lower = raw.toLowerCase();

  // 1. Exact brand match
  if (BRAND_COLORS[lower]) return BRAND_COLORS[lower]!;

  // 2. Direct hex input
  if (isHex(raw)) return expandShortHex(raw);
  if (isHex('#' + raw)) return expandShortHex('#' + raw);

  // 3. Multi-word exact match already covered above.
  //    Now try modifier + base: "dark navy", "light pink", "pale sage"
  const words = lower.split(/[\s\-_]+/);
  if (words.length >= 2) {
    const mod = words[0]!;
    const base = words.slice(1).join(' ');
    const baseHex = BRAND_COLORS[base];
    if (baseHex) {
      if (LIGHT_MODS.has(mod)) return adjustHex(baseHex, 40);
      if (DARK_MODS.has(mod)) return adjustHex(baseHex, -40);
    }
    // also try last word as base with first as modifier
    const firstBase = words[0]!;
    const modSuffix = words[words.length - 1]!;
    const firstHex = BRAND_COLORS[firstBase];
    if (firstHex) {
      if (LIGHT_MODS.has(modSuffix)) return adjustHex(firstHex, 40);
      if (DARK_MODS.has(modSuffix)) return adjustHex(firstHex, -40);
    }
  }

  // 4. Fuzzy word match — any word in the name matches a brand color key
  for (const word of words) {
    if (BRAND_COLORS[word]) return BRAND_COLORS[word]!;
  }

  // 5. Substring match — "forestgreen" → "forest"
  for (const [key, hex] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(key) || key.includes(lower)) return hex;
  }

  // 6. Neutral fallback
  return '#B8AE9C';
}

/** Lighter colours need a visible ring so the swatch reads against cream backgrounds. */
export function colorNeedsBorder(name: string): boolean {
  const hex = colorHex(name);
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.75;
}
