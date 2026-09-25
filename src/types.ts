export type EraId =
  | 'ancient_egypt'
  | 'feudal_japan'
  | 'high_renaissance'
  | 'victorian_steampunk'
  | 'roaring_twenties'
  | 'apollo_lunar'
  | 'medieval_knight'
  | 'ancient_rome';

export interface FaceTransform {
  x: number; // offset in px relative to era face center
  y: number;
  scale: number; // 0.5 to 2.5
  rotate: number; // -45 to 45 deg
  widthRatio: number; // oval aspect ratio (0.75 to 1.35)
  feather: number; // 0 to 40 px edge blur
  brightness: number; // 0.6 to 1.4
  contrast: number; // 0.6 to 1.5
  warmth: number; // -50 (cool/cyan) to +50 (warm/amber)
  saturation: number; // 0 (monochrome) to 1.8 (rich)
  eraFilterStrength: number; // 0 to 1
}

export interface EraAccessory {
  id: string;
  name: string;
  defaultEnabled: boolean;
}

export interface EraConfig {
  id: EraId;
  name: string;
  epoch: string;
  location: string;
  curatorialNote: string;
  historicalQuote: string;
  themeColor: string;
  accentColor: string;
  badgeText: string;
  frameType:
    | 'gilded_baroque'
    | 'lacquer_brass'
    | 'art_deco_gold'
    | 'daguerreotype'
    | 'nasa_plaque'
    | 'roman_marble'
    | 'medieval_iron'
    | 'egyptian_sandstone';
  // Face positioning anchor on the 1000x1250 canvas coordinate system
  facePlacement: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    angle?: number;
  };
  accessories: EraAccessory[];
  defaultTonalStyle: {
    warmth: number;
    contrast: number;
    saturation: number;
    grain: number;
    vignette: number;
    tintColor?: string;
  };
}

export interface SavedPortrait {
  id: string;
  eraId: EraId;
  eraName: string;
  epoch: string;
  location: string;
  travelerName: string;
  timestamp: number;
  dataUrl: string;
}

export interface PhotoStripItem {
  eraId: EraId;
  label: string;
}
