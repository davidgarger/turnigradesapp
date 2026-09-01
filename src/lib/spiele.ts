export const SPIELE_SUBCATEGORIES = [
  "Aufwärmspiele",
  "Fangspiele",
  "Ballspiele",
  "Staffelspiele",
  "Kooperationsspiele",
  "Abschlussspiele",
] as const;

export type SpieleSubcategory = (typeof SPIELE_SUBCATEGORIES)[number];
