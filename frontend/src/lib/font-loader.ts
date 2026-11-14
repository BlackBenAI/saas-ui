export const SYSTEM_FONTS = [
  "Calibri",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Courier New",
];

export const GOOGLE_FONT_CATEGORIES = {
  "Sans serif": [
    "Inter",
    "Manrope",
    "DM Sans",
    "Work Sans",
    "Source Sans 3",
    "Public Sans",
    "IBM Plex Sans",
    "Plus Jakarta Sans",
    "Space Grotesk",
    "Outfit",
    "Sora",
    "Figtree",
    "Archivo",
    "Barlow",
    "Rubik",
    "Poppins",
    "Montserrat",
    "Nunito Sans",
    "Open Sans",
    "Lato",
    "Karla",
    "Mulish",
    "Noto Sans",
    "Raleway",
    "Jost",
    "Urbanist",
    "Onest",
    "Instrument Sans",
    "Schibsted Grotesk",
    "Albert Sans",
    "Be Vietnam Pro",
    "Epilogue",
    "Hanken Grotesk",
    "Lexend",
  ],
  Serif: [
    "Source Serif 4",
    "Lora",
    "Merriweather",
    "Playfair Display",
    "DM Serif Display",
    "Fraunces",
    "Libre Baskerville",
    "Crimson Pro",
    "Newsreader",
    "Spectral",
    "Cormorant Garamond",
    "Bitter",
    "Zilla Slab",
    "IBM Plex Serif",
    "Instrument Serif",
    "Literata",
    "Petrona",
  ],
  Display: [
    "Bebas Neue",
    "Anton",
    "Archivo Black",
    "Syne",
    "Unbounded",
    "Bodoni Moda",
    "Abril Fatface",
    "Righteous",
    "Oswald",
    "Chivo",
  ],
  Monospace: [
    "JetBrains Mono",
    "IBM Plex Mono",
    "Source Code Pro",
    "Fira Code",
    "Space Mono",
    "DM Mono",
    "Roboto Mono",
    "Inconsolata",
    "Ubuntu Mono",
    "Red Hat Mono",
  ],
  Handwriting: [
    "Caveat",
    "Dancing Script",
    "Kalam",
    "Patrick Hand",
    "Sacramento",
    "Great Vibes",
  ],
} as const;

export const GOOGLE_FONTS_POPULAR = Object.values(GOOGLE_FONT_CATEGORIES).flat();

export const FONT_OPTIONS = [...new Set([...SYSTEM_FONTS, ...GOOGLE_FONTS_POPULAR])];

const loaded = new Set<string>();

export function isSystemFont(fontFamily: string): boolean {
  return SYSTEM_FONTS.includes(fontFamily);
}

export function loadGoogleFont(fontFamily: string, weights: number[] = [400, 500, 600, 700]): void {
  if (typeof document === "undefined" || loaded.has(fontFamily) || isSystemFont(fontFamily)) {
    return;
  }
  const id = `font-${fontFamily.toLowerCase().replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) {
    loaded.add(fontFamily);
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@${weights.join(";")}&display=swap`;
  document.head.appendChild(link);
  loaded.add(fontFamily);
}

export function unloadGoogleFont(fontFamily: string): void {
  if (typeof document === "undefined") {
    return;
  }
  const id = `font-${fontFamily.toLowerCase().replace(/\s+/g, "-")}`;
  document.getElementById(id)?.remove();
  loaded.delete(fontFamily);
}
