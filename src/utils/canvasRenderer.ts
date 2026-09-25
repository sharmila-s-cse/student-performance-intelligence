import { EraConfig, FaceTransform } from '../types';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  era: EraConfig;
  userImage: HTMLImageElement | null;
  transform: FaceTransform;
  activeAccessories: Record<string, boolean>;
  travelerName: string;
  showGuides?: boolean;
}

export function renderHistoricalPortrait(options: RenderOptions) {
  const {
    canvas,
    era,
    userImage,
    transform,
    activeAccessories,
    travelerName,
    showGuides = false,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Define painting viewport inside the frame
  const padX = 64;
  const padTop = 56;
  const paintW = width - padX * 2;
  const paintH = height - padTop - 150; // leave room for brass plaque

  // Save outer state
  ctx.save();

  // 1. Clip to the painting area
  ctx.beginPath();
  ctx.rect(padX, padTop, paintW, paintH);
  ctx.clip();

  // 2. Draw Historical Background Scene
  drawBackgroundScene(ctx, era, padX, padTop, paintW, paintH);

  // 3. Draw Body / Costume Back & Torso
  drawCostumeTorso(ctx, era, padX, padTop, paintW, paintH);

  // 4. Draw User Face with Mask & Color Grading
  if (userImage) {
    drawBlendedUserFace(ctx, era, userImage, transform);
  } else {
    // Placeholder silhouette if no photo is taken yet
    drawFacePlaceholder(ctx, era, transform, showGuides);
  }

  // 5. Draw Costume Foreground / Collar / Shoulders Overlap
  drawCostumeForeground(ctx, era, padX, padTop, paintW, paintH);

  // 6. Draw Period Accessories & Headdresses
  drawAccessories(ctx, era, activeAccessories);

  // 7. Apply Master Period Color Glaze, Craquelure, & Vignette
  applyMasterAtmosphere(ctx, era, padX, padTop, paintW, paintH, transform);

  // 8. If showGuides is true, draw alignment guide
  if (showGuides) {
    drawAlignmentGuide(ctx, era, transform);
  }

  // Restore clip
  ctx.restore();

  // 9. Draw Ornate Period Frame and Brass Plaque
  drawMuseumFrameAndPlaque(ctx, era, width, height, padX, padTop, paintW, paintH, travelerName);
}

/* =========================================================================
   BACKGROUND DRAWING FUNCTIONS
   ========================================================================= */
function drawBackgroundScene(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  x: number,
  y: number,
  w: number,
  h: number
) {
  switch (era.id) {
    case 'high_renaissance': {
      // Sunset over Tuscan hills
      const skyGrad = ctx.createLinearGradient(x, y, x, y + h * 0.6);
      skyGrad.addColorStop(0, '#334155');
      skyGrad.addColorStop(0.4, '#B45309');
      skyGrad.addColorStop(0.7, '#D97706');
      skyGrad.addColorStop(1, '#FDE68A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(x, y, w, h);

      // Distant Tuscan rolling hills (sfumato)
      ctx.fillStyle = 'rgba(74, 90, 68, 0.45)';
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.45);
      ctx.bezierCurveTo(x + w * 0.3, y + h * 0.38, x + w * 0.7, y + h * 0.48, x + w, y + h * 0.42);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();

      ctx.fillStyle = 'rgba(46, 68, 42, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.52);
      ctx.bezierCurveTo(x + w * 0.4, y + h * 0.46, x + w * 0.65, y + h * 0.56, x + w, y + h * 0.48);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();

      // Slender Cypress trees
      drawCypress(ctx, x + w * 0.18, y + h * 0.42, 18, 90);
      drawCypress(ctx, x + w * 0.22, y + h * 0.45, 14, 75);
      drawCypress(ctx, x + w * 0.82, y + h * 0.44, 16, 85);

      // Renaissance Palazzo Loggia / Marble Arches
      ctx.fillStyle = '#292524';
      // Left pillar
      ctx.fillRect(x, y, 90, h);
      // Right pillar
      ctx.fillRect(x + w - 90, y, 90, h);
      // Top stone arch beam
      ctx.fillRect(x, y, w, 50);

      // Arch curve
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 50, w / 2 - 90, Math.PI, 0);
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#44403C';
      ctx.stroke();

      // Stone relief details
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(x + 75, y, 15, h);
      ctx.fillRect(x + w - 90, y, 15, h);
      break;
    }

    case 'ancient_egypt': {
      // Sunset over Nile with deep purple and amber
      const skyGrad = ctx.createLinearGradient(x, y, x, y + h * 0.65);
      skyGrad.addColorStop(0, '#1E1B4B');
      skyGrad.addColorStop(0.3, '#7C2D12');
      skyGrad.addColorStop(0.65, '#D97706');
      skyGrad.addColorStop(1, '#FDE68A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(x, y, w, h);

      // Nile river waters reflecting golden light
      const riverGrad = ctx.createLinearGradient(x, y + h * 0.55, x, y + h);
      riverGrad.addColorStop(0, '#78350F');
      riverGrad.addColorStop(0.5, '#451A03');
      riverGrad.addColorStop(1, '#1C1917');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(x, y + h * 0.55, w, h * 0.45);

      // Distant Great Pyramids silhouettes
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.15, y + h * 0.56);
      ctx.lineTo(x + w * 0.32, y + h * 0.38);
      ctx.lineTo(x + w * 0.48, y + h * 0.56);
      ctx.fill();

      ctx.fillStyle = '#592205';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.4, y + h * 0.56);
      ctx.lineTo(x + w * 0.52, y + h * 0.43);
      ctx.lineTo(x + w * 0.64, y + h * 0.56);
      ctx.fill();

      // Date palms on the bank
      drawPalm(ctx, x + w * 0.12, y + h * 0.55, 60);
      drawPalm(ctx, x + w * 0.88, y + h * 0.55, 70);

      // Grand Sandstone Temple Columns flanking the portrait
      const colGrad = ctx.createLinearGradient(x, y, x + 130, y);
      colGrad.addColorStop(0, '#78350F');
      colGrad.addColorStop(0.5, '#B45309');
      colGrad.addColorStop(1, '#451A03');

      // Left column with papyrus lotus capital
      ctx.fillStyle = colGrad;
      ctx.fillRect(x, y, 120, h);
      // Right column
      ctx.fillRect(x + w - 120, y, 120, h);

      // Carved gold hieroglyphs on columns
      drawHieroglyphs(ctx, x + 35, y + 100, 50, 400);
      drawHieroglyphs(ctx, x + w - 85, y + 100, 50, 400);
      break;
    }

    case 'feudal_japan': {
      // Golden Washi paper & rising sun backdrop
      const washiGrad = ctx.createLinearGradient(x, y, x, y + h);
      washiGrad.addColorStop(0, '#262626');
      washiGrad.addColorStop(0.4, '#1C1917');
      washiGrad.addColorStop(1, '#2D1515');
      ctx.fillStyle = washiGrad;
      ctx.fillRect(x, y, w, h);

      // Crimson Sun Disc (Hinomaru)
      const sunGrad = ctx.createRadialGradient(x + w * 0.5, y + h * 0.36, 10, x + w * 0.5, y + h * 0.36, 170);
      sunGrad.addColorStop(0, '#EF4444');
      sunGrad.addColorStop(0.85, '#991B1B');
      sunGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(x + w * 0.5, y + h * 0.36, 170, 0, Math.PI * 2);
      ctx.fill();

      // Mount Fuji silhouette in sumi-e wash
      ctx.fillStyle = '#171717';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.1, y + h * 0.58);
      ctx.bezierCurveTo(x + w * 0.35, y + h * 0.52, x + w * 0.44, y + h * 0.32, x + w * 0.48, y + h * 0.3);
      ctx.lineTo(x + w * 0.52, y + h * 0.3);
      ctx.bezierCurveTo(x + w * 0.56, y + h * 0.32, x + w * 0.65, y + h * 0.52, x + w * 0.9, y + h * 0.58);
      ctx.lineTo(x + w, y + h * 0.58);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();

      // Snow cap on Fuji
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(x + w * 0.45, y + h * 0.34);
      ctx.lineTo(x + w * 0.48, y + h * 0.3);
      ctx.lineTo(x + w * 0.52, y + h * 0.3);
      ctx.lineTo(x + w * 0.55, y + h * 0.34);
      ctx.lineTo(x + w * 0.52, y + h * 0.36);
      ctx.lineTo(x + w * 0.5, y + h * 0.34);
      ctx.lineTo(x + w * 0.48, y + h * 0.36);
      ctx.closePath();
      ctx.fill();

      // Cherry blossom branches framing top
      drawCherryBranch(ctx, x, y, 1);
      drawCherryBranch(ctx, x + w, y, -1);
      break;
    }

    case 'victorian_steampunk': {
      // Misty gaslit London night
      const mistGrad = ctx.createRadialGradient(x + w * 0.5, y + h * 0.3, 50, x + w * 0.5, y + h * 0.5, w);
      mistGrad.addColorStop(0, '#451A03');
      mistGrad.addColorStop(0.35, '#292524');
      mistGrad.addColorStop(1, '#0C0A09');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(x, y, w, h);

      // Distant Westminster & Big Ben silhouette
      ctx.fillStyle = '#1C1917';
      // Big Ben Tower
      const twrX = x + w * 0.72;
      ctx.fillRect(twrX, y + h * 0.15, 65, h * 0.5);
      // Pyramid spire
      ctx.beginPath();
      ctx.moveTo(twrX - 5, y + h * 0.15);
      ctx.lineTo(twrX + 32.5, y + h * 0.05);
      ctx.lineTo(twrX + 70, y + h * 0.15);
      ctx.fill();

      // Clock face with amber gas glow
      ctx.fillStyle = '#FEF08A';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(twrX + 32.5, y + h * 0.22, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Clock hands
      ctx.strokeStyle = '#1C1917';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(twrX + 32.5, y + h * 0.22);
      ctx.lineTo(twrX + 32.5, y + h * 0.22 - 10);
      ctx.moveTo(twrX + 32.5, y + h * 0.22);
      ctx.lineTo(twrX + 32.5 + 8, y + h * 0.22 + 4);
      ctx.stroke();

      // Interlocking steampunk brass clockwork gears in upper corners
      drawBrassGear(ctx, x + 60, y + 60, 55, '#B45309');
      drawBrassGear(ctx, x + 130, y + 45, 38, '#D97706');
      drawBrassGear(ctx, x + w - 60, y + 55, 48, '#B45309');
      break;
    }

    case 'roaring_twenties': {
      // Midnight Art Deco ballroom
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(x, y, w, h);

      // Gold Art Deco Sunburst Lines
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 1.8;
      const originX = x + w * 0.5;
      const originY = y + h * 0.6;
      for (let angle = Math.PI; angle <= Math.PI * 2; angle += Math.PI / 18) {
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + Math.cos(angle) * 700, originY + Math.sin(angle) * 700);
        ctx.stroke();
      }

      // Geometric Chevron arches
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
      for (let r = 180; r <= 380; r += 50) {
        ctx.beginPath();
        ctx.arc(originX, originY - 100, r, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }

      // Vertical deco skyscraper stepped silhouettes in background
      ctx.fillStyle = '#111827';
      ctx.fillRect(x + 50, y + h * 0.25, 80, h * 0.5);
      ctx.fillRect(x + 70, y + h * 0.18, 40, h * 0.1);
      ctx.fillRect(x + w - 130, y + h * 0.25, 80, h * 0.5);
      ctx.fillRect(x + w - 110, y + h * 0.18, 40, h * 0.1);
      break;
    }

    case 'apollo_lunar': {
      // Cosmic black void of space
      ctx.fillStyle = '#030712';
      ctx.fillRect(x, y, w, h);

      // Starfield
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 90; i++) {
        const sx = x + (Math.sin(i * 99) * 0.5 + 0.5) * w;
        const sy = y + (Math.cos(i * 77) * 0.5 + 0.5) * (h * 0.6);
        const sr = (i % 5 === 0) ? 1.8 : 0.9;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // The Blue Marble Earth rising
      const earthX = x + w * 0.78;
      const earthY = y + h * 0.22;
      const earthR = 52;
      const earthGrad = ctx.createRadialGradient(earthX - 15, earthY - 15, 10, earthX, earthY, earthR);
      earthGrad.addColorStop(0, '#60A5FA');
      earthGrad.addColorStop(0.5, '#1D4ED8');
      earthGrad.addColorStop(0.85, '#1E3A8A');
      earthGrad.addColorStop(1, '#000000');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fill();

      // Earth white cloud swirls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(earthX - 10, earthY - 10, 24, 0.4, 2.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(earthX + 8, earthY + 12, 18, 2.8, 4.8);
      ctx.stroke();

      // Earth atmospheric glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Desolate Lunar Surface horizon
      const moonGrad = ctx.createLinearGradient(x, y + h * 0.55, x, y + h);
      moonGrad.addColorStop(0, '#475569');
      moonGrad.addColorStop(0.4, '#334155');
      moonGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.55);
      ctx.bezierCurveTo(x + w * 0.35, y + h * 0.52, x + w * 0.7, y + h * 0.57, x + w, y + h * 0.54);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();

      // Lunar craters
      drawLunarCrater(ctx, x + w * 0.2, y + h * 0.62, 35, 12);
      drawLunarCrater(ctx, x + w * 0.75, y + h * 0.65, 45, 16);
      break;
    }

    case 'medieval_knight': {
      // Vaulted Gothic stone hall
      const stoneGrad = ctx.createLinearGradient(x, y, x, y + h);
      stoneGrad.addColorStop(0, '#1E1B4B');
      stoneGrad.addColorStop(0.5, '#1E293B');
      stoneGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = stoneGrad;
      ctx.fillRect(x, y, w, h);

      // Gothic Cathedral Rose Stained Glass Window
      const roseX = x + w * 0.5;
      const roseY = y + h * 0.24;
      const roseR = 120;

      // Backlight glow
      const glow = ctx.createRadialGradient(roseX, roseY, 20, roseX, roseY, roseR + 30);
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(roseX - roseR - 30, roseY - roseR - 30, (roseR + 30) * 2, (roseR + 30) * 2);

      // Outer stone ring
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(roseX, roseY, roseR + 14, 0, Math.PI * 2);
      ctx.fill();

      // Stained glass petals
      const petalColors = ['#DC2626', '#2563EB', '#D97706', '#059669', '#7C3AED', '#EA580C'];
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6;
        ctx.fillStyle = petalColors[i % petalColors.length];
        ctx.beginPath();
        ctx.moveTo(roseX, roseY);
        ctx.arc(roseX, roseY, roseR, ang, ang + Math.PI / 6);
        ctx.closePath();
        ctx.fill();
      }

      // Black stone tracery
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 5;
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(roseX, roseY);
        ctx.lineTo(roseX + Math.cos(ang) * roseR, roseY + Math.sin(ang) * roseR);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(roseX, roseY, 40, 0, Math.PI * 2);
      ctx.arc(roseX, roseY, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Gothic pointed stone ribs
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(x + 40, y + h * 0.7);
      ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.1, x + w * 0.5, y + 40);
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.1, x + w - 40, y + h * 0.7);
      ctx.stroke();
      break;
    }

    case 'ancient_rome': {
      // Radiant Mediterranean sky
      const skyGrad = ctx.createLinearGradient(x, y, x, y + h * 0.6);
      skyGrad.addColorStop(0, '#0284C7');
      skyGrad.addColorStop(0.5, '#38BDF8');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(x, y, w, h);

      // Distant Roman Colosseum amphitheater arches
      ctx.fillStyle = '#D6D3D1';
      const colX = x + w * 0.15;
      const colY = y + h * 0.28;
      const colW = w * 0.7;
      const colH = h * 0.28;

      ctx.beginPath();
      ctx.ellipse(colX + colW / 2, colY + colH, colW / 2, colH * 0.6, 0, Math.PI, 0);
      ctx.fill();

      // Colosseum arcades
      ctx.fillStyle = '#44403C';
      for (let arc = 0; arc < 7; arc++) {
        const ax = colX + 40 + arc * 60;
        const ay = colY + 30;
        ctx.beginPath();
        ctx.arc(ax, ay + 20, 14, Math.PI, 0);
        ctx.lineTo(ax + 14, ay + 50);
        ctx.lineTo(ax - 14, ay + 50);
        ctx.closePath();
        ctx.fill();
      }

      // Classical Fluted Corinthian Marble Columns
      const marbleGrad = ctx.createLinearGradient(x, y, x + 110, y);
      marbleGrad.addColorStop(0, '#E7E5E4');
      marbleGrad.addColorStop(0.4, '#F5F5F4');
      marbleGrad.addColorStop(0.8, '#D6D3D1');
      marbleGrad.addColorStop(1, '#A8A29E');

      ctx.fillStyle = marbleGrad;
      ctx.fillRect(x, y, 95, h);
      ctx.fillRect(x + w - 95, y, 95, h);

      // Fluting lines
      ctx.strokeStyle = 'rgba(120, 113, 108, 0.4)';
      ctx.lineWidth = 2;
      for (let f = 15; f < 85; f += 12) {
        ctx.beginPath();
        ctx.moveTo(x + f, y);
        ctx.lineTo(x + f, y + h);
        ctx.moveTo(x + w - 95 + f, y);
        ctx.lineTo(x + w - 95 + f, y + h);
        ctx.stroke();
      }

      // Architrave top beam
      ctx.fillStyle = '#E7E5E4';
      ctx.fillRect(x, y, w, 55);
      ctx.fillStyle = '#A8A29E';
      ctx.fillRect(x, y + 45, w, 10);
      break;
    }
  }
}

/* =========================================================================
   COSTUME DRAWING (BODY & TORSO)
   ========================================================================= */
function drawCostumeTorso(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  _padX: number,
  _padTop: number,
  _paintW: number,
  _paintH: number
) {
  const { cx, cy } = era.facePlacement;

  ctx.save();

  switch (era.id) {
    case 'high_renaissance': {
      // Crimson velvet doublet with gold embroidered trim
      ctx.fillStyle = '#7F1D1D'; // deep velvet crimson
      ctx.beginPath();
      ctx.moveTo(cx - 240, cy + 500);
      ctx.bezierCurveTo(cx - 220, cy + 240, cx - 120, cy + 180, cx, cy + 180);
      ctx.bezierCurveTo(cx + 120, cy + 180, cx + 220, cy + 240, cx + 240, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Gold filigree front placket
      ctx.fillStyle = '#D97706';
      ctx.fillRect(cx - 24, cy + 185, 48, 400);

      // Emerald jewel buttons
      for (let b = cy + 220; b <= cy + 460; b += 55) {
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.arc(cx, b, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      break;
    }

    case 'ancient_egypt': {
      // Shoulders with royal pleated white linen and golden wesekh broad collar base
      ctx.fillStyle = '#FEF3C7'; // pleated fine linen
      ctx.beginPath();
      ctx.moveTo(cx - 250, cy + 500);
      ctx.bezierCurveTo(cx - 230, cy + 220, cx - 140, cy + 170, cx, cy + 170);
      ctx.bezierCurveTo(cx + 140, cy + 170, cx + 230, cy + 220, cx + 250, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Broad collar foundation (lapis, turquoise, carnelian)
      const wesekhGrad = ctx.createRadialGradient(cx, cy + 150, 40, cx, cy + 150, 200);
      wesekhGrad.addColorStop(0, '#1E3A8A'); // lapis
      wesekhGrad.addColorStop(0.35, '#0D9488'); // turquoise
      wesekhGrad.addColorStop(0.7, '#B45309'); // gold
      wesekhGrad.addColorStop(1, '#991B1B'); // carnelian
      ctx.fillStyle = wesekhGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + 150, 195, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.lineTo(cx, cy + 190);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'feudal_japan': {
      // Kamishimo / Haori shoulders (wide flared samurai shoulders)
      ctx.fillStyle = '#18181B'; // rich black lacquered silk
      ctx.beginPath();
      ctx.moveTo(cx - 290, cy + 500);
      ctx.lineTo(cx - 290, cy + 210); // wing shoulder
      ctx.lineTo(cx - 110, cy + 175);
      ctx.lineTo(cx, cy + 210);
      ctx.lineTo(cx + 110, cy + 175);
      ctx.lineTo(cx + 290, cy + 210);
      ctx.lineTo(cx + 290, cy + 500);
      ctx.closePath();
      ctx.fill();

      // White silk inner kimono collar overlap (left over right)
      ctx.fillStyle = '#FAFAFA';
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 175);
      ctx.lineTo(cx + 35, cy + 290);
      ctx.lineTo(cx + 8, cy + 300);
      ctx.lineTo(cx - 70, cy + 185);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 50, cy + 175);
      ctx.lineTo(cx - 35, cy + 290);
      ctx.lineTo(cx - 8, cy + 300);
      ctx.lineTo(cx + 70, cy + 185);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'victorian_steampunk': {
      // Charcoal tweed wool frock coat and silk vest
      ctx.fillStyle = '#1C1917';
      ctx.beginPath();
      ctx.moveTo(cx - 250, cy + 500);
      ctx.bezierCurveTo(cx - 230, cy + 240, cx - 130, cy + 185, cx, cy + 185);
      ctx.bezierCurveTo(cx + 130, cy + 185, cx + 230, cy + 240, cx + 250, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Burgundy silk brocade vest
      ctx.fillStyle = '#450A0A';
      ctx.beginPath();
      ctx.moveTo(cx - 65, cy + 195);
      ctx.lineTo(cx, cy + 340);
      ctx.lineTo(cx + 65, cy + 195);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'roaring_twenties': {
      // Tailored black dinner tuxedo jacket
      ctx.fillStyle = '#09090B';
      ctx.beginPath();
      ctx.moveTo(cx - 250, cy + 500);
      ctx.bezierCurveTo(cx - 230, cy + 230, cx - 130, cy + 185, cx, cy + 185);
      ctx.bezierCurveTo(cx + 130, cy + 185, cx + 230, cy + 230, cx + 250, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Crisp pleated white tuxedo shirt
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy + 185);
      ctx.lineTo(cx - 15, cy + 360);
      ctx.lineTo(cx + 15, cy + 360);
      ctx.lineTo(cx + 55, cy + 185);
      ctx.closePath();
      ctx.fill();

      // Satin peak lapels
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy + 220);
      ctx.lineTo(cx - 30, cy + 350);
      ctx.lineTo(cx - 65, cy + 340);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 130, cy + 220);
      ctx.lineTo(cx + 30, cy + 350);
      ctx.lineTo(cx + 65, cy + 340);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'apollo_lunar': {
      // White pressurized Beta cloth Apollo A7L torso
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy + 500);
      ctx.bezierCurveTo(cx - 240, cy + 250, cx - 150, cy + 200, cx, cy + 200);
      ctx.bezierCurveTo(cx + 150, cy + 200, cx + 240, cy + 250, cx + 260, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Blue & Red umbilical connectors
      ctx.fillStyle = '#2563EB'; // Blue oxygen connector
      ctx.beginPath();
      ctx.arc(cx - 75, cy + 285, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#DC2626'; // Red water connector
      ctx.beginPath();
      ctx.arc(cx - 30, cy + 285, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // RCU chest pack box
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(cx - 85, cy + 320, 170, 110);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 85, cy + 320, 170, 110);
      break;
    }

    case 'medieval_knight': {
      // Polished steel plate and chainmail torso
      ctx.fillStyle = '#1E1B4B'; // Royal medieval blue surcoat base
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy + 500);
      ctx.bezierCurveTo(cx - 240, cy + 230, cx - 140, cy + 185, cx, cy + 185);
      ctx.bezierCurveTo(cx + 140, cy + 185, cx + 240, cy + 230, cx + 260, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Crimson & Gold heraldic surcoat split
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      ctx.moveTo(cx, cy + 185);
      ctx.lineTo(cx + 250, cy + 500);
      ctx.lineTo(cx, cy + 500);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'ancient_rome': {
      // White Roman tunic
      ctx.fillStyle = '#F5F5F4';
      ctx.beginPath();
      ctx.moveTo(cx - 240, cy + 500);
      ctx.bezierCurveTo(cx - 220, cy + 230, cx - 130, cy + 180, cx, cy + 180);
      ctx.bezierCurveTo(cx + 130, cy + 180, cx + 220, cy + 230, cx + 240, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Tyrian Purple Toga Praetexta drape over left shoulder
      ctx.fillStyle = '#581C87'; // imperial purple
      ctx.beginPath();
      ctx.moveTo(cx - 240, cy + 500);
      ctx.bezierCurveTo(cx - 210, cy + 200, cx - 120, cy + 170, cx - 40, cy + 190);
      ctx.bezierCurveTo(cx + 20, cy + 260, cx + 160, cy + 320, cx + 220, cy + 500);
      ctx.lineTo(cx - 240, cy + 500);
      ctx.closePath();
      ctx.fill();

      // Gold embroidered border on toga
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 7;
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

/* =========================================================================
   USER FACE BLENDING & TONAL FILTERING
   ========================================================================= */
function drawBlendedUserFace(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  userImg: HTMLImageElement,
  t: FaceTransform
) {
  const { cx: baseCx, cy: baseCy, rx: baseRx, ry: baseRy } = era.facePlacement;

  // Actual center position with user transform offsets
  const faceCx = baseCx + t.x;
  const faceCy = baseCy + t.y;
  const radX = baseRx * t.scale * t.widthRatio;
  const radY = baseRy * t.scale;

  // Offscreen canvas for processed face
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = 1000;
  faceCanvas.height = 1250;
  const fCtx = faceCanvas.getContext('2d');
  if (!fCtx) return;

  // Save fCtx
  fCtx.save();

  // 1. Draw User Image Centered & Transformed
  fCtx.translate(faceCx, faceCy);
  fCtx.rotate((t.rotate * Math.PI) / 180);

  // Compute image draw dimensions
  const imgW = radX * 2.8;
  const imgH = (imgW * userImg.height) / userImg.width;

  // Apply CSS-like filter parameters on canvas context
  // Brightness, Contrast, Saturation
  const br = Math.round(t.brightness * 100);
  const ct = Math.round(t.contrast * 100);
  const sat = Math.round(t.saturation * 100);

  // Era tone warm / sepia calculation
  let sepia = 0;
  let hue = 0;
  if (era.id === 'victorian_steampunk') {
    sepia = Math.round(70 * t.eraFilterStrength);
  } else if (era.id === 'high_renaissance') {
    sepia = Math.round(35 * t.eraFilterStrength);
  } else if (era.id === 'roaring_twenties') {
    sepia = Math.round(20 * t.eraFilterStrength);
  }

  if (t.warmth > 0) {
    hue = Math.round(t.warmth * 0.4);
  } else if (t.warmth < 0) {
    hue = Math.round(t.warmth * 0.6);
  }

  fCtx.filter = `brightness(${br}%) contrast(${ct}%) saturate(${sat}%) sepia(${sepia}%) hue-rotate(${hue}deg)`;
  fCtx.drawImage(userImg, -imgW / 2, -imgH / 2, imgW, imgH);
  fCtx.filter = 'none';

  fCtx.restore();

  // 2. Feathered Oval Masking via Destination-In
  fCtx.save();
  fCtx.globalCompositeOperation = 'destination-in';

  // Radial gradient oval for smooth skin boundary feathering
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = 1000;
  maskCanvas.height = 1250;
  const mCtx = maskCanvas.getContext('2d');
  if (mCtx) {
    mCtx.save();
    mCtx.translate(faceCx, faceCy);
    mCtx.rotate((t.rotate * Math.PI) / 180);
    mCtx.scale(radX, radY);

    const featherStart = Math.max(0.6, 1.0 - t.feather / 40);
    const grad = mCtx.createRadialGradient(0, 0, featherStart, 0, 0, 1.05);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(featherStart, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    mCtx.fillStyle = grad;
    mCtx.beginPath();
    mCtx.arc(0, 0, 1.05, 0, Math.PI * 2);
    mCtx.fill();
    mCtx.restore();

    fCtx.drawImage(maskCanvas, 0, 0);
  }
  fCtx.restore();

  // 3. Draw processed face to main canvas
  ctx.drawImage(faceCanvas, 0, 0);
}

function drawFacePlaceholder(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  t: FaceTransform,
  showGuides: boolean
) {
  const { cx: baseCx, cy: baseCy, rx: baseRx, ry: baseRy } = era.facePlacement;
  const faceCx = baseCx + t.x;
  const faceCy = baseCy + t.y;
  const radX = baseRx * t.scale * t.widthRatio;
  const radY = baseRy * t.scale;

  ctx.save();
  ctx.translate(faceCx, faceCy);
  ctx.rotate((t.rotate * Math.PI) / 180);

  // Soft silhouette fill
  const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, radY);
  grad.addColorStop(0, 'rgba(235, 215, 195, 0.45)');
  grad.addColorStop(0.85, 'rgba(180, 150, 130, 0.35)');
  grad.addColorStop(1, 'rgba(120, 90, 80, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dashed outline if in capture mode
  if (showGuides) {
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

/* =========================================================================
   COSTUME FOREGROUND / COLLARS / OVERLAYS
   ========================================================================= */
function drawCostumeForeground(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  _padX: number,
  _padTop: number,
  _paintW: number,
  _paintH: number
) {
  const { cx, cy, ry } = era.facePlacement;
  const chinY = cy + ry * 0.92;

  ctx.save();

  switch (era.id) {
    case 'high_renaissance': {
      // Large Pleated Elizabethan / Florentine White Linen Ruff Collar
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;

      const ruffCount = 18;
      const ruffRadiusX = 140;
      const ruffRadiusY = 55;
      const ruffCenterY = chinY + 22;

      for (let i = 0; i < ruffCount; i++) {
        const ang = Math.PI * 0.15 + (i * (Math.PI * 0.7)) / (ruffCount - 1);
        const rx = cx + Math.cos(ang) * ruffRadiusX;
        const ryPos = ruffCenterY + Math.sin(ang) * ruffRadiusY;

        ctx.beginPath();
        ctx.arc(rx, ryPos, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'ancient_egypt': {
      // Golden Nemes headdress cloth framing both cheeks
      const nemesGrad = ctx.createLinearGradient(cx - 160, cy, cx - 90, cy);
      nemesGrad.addColorStop(0, '#1E3A8A');
      nemesGrad.addColorStop(0.5, '#F59E0B');
      nemesGrad.addColorStop(1, '#1E3A8A');

      // Left lappet hanging over chest
      ctx.fillStyle = nemesGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 95, cy - 20);
      ctx.lineTo(cx - 120, chinY + 110);
      ctx.lineTo(cx - 75, chinY + 110);
      ctx.lineTo(cx - 70, cy + 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right lappet
      ctx.beginPath();
      ctx.moveTo(cx + 95, cy - 20);
      ctx.lineTo(cx + 120, chinY + 110);
      ctx.lineTo(cx + 75, chinY + 110);
      ctx.lineTo(cx + 70, cy + 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold wesekh inner neckline bead band
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, chinY + 10, 85, 0.18 * Math.PI, 0.82 * Math.PI);
      ctx.stroke();
      break;
    }

    case 'feudal_japan': {
      // Haori front lapel crossing neck
      ctx.fillStyle = '#09090B';
      ctx.beginPath();
      ctx.moveTo(cx - 70, chinY + 10);
      ctx.lineTo(cx - 30, chinY + 130);
      ctx.lineTo(cx + 40, chinY + 130);
      ctx.lineTo(cx + 70, chinY + 10);
      ctx.closePath();
      ctx.fill();

      // Golden crest (Mon) on chest lapel
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 130, chinY + 70, 18, 0, Math.PI * 2);
      ctx.arc(cx + 130, chinY + 70, 18, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'victorian_steampunk': {
      // High starched wing collar and black silk ascot cravat
      ctx.fillStyle = '#FFFFFF';
      // Left collar wing
      ctx.beginPath();
      ctx.moveTo(cx - 60, chinY - 10);
      ctx.lineTo(cx - 15, chinY + 25);
      ctx.lineTo(cx - 50, chinY + 35);
      ctx.closePath();
      ctx.fill();

      // Right collar wing
      ctx.beginPath();
      ctx.moveTo(cx + 60, chinY - 10);
      ctx.lineTo(cx + 15, chinY + 25);
      ctx.lineTo(cx + 50, chinY + 35);
      ctx.closePath();
      ctx.fill();

      // Black silk ascot cravat puff
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.moveTo(cx - 30, chinY + 15);
      ctx.bezierCurveTo(cx - 40, chinY + 65, cx + 40, chinY + 65, cx + 30, chinY + 15);
      ctx.closePath();
      ctx.fill();

      // Gold tie pin with pearl
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx, chinY + 38, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(cx - 1, chinY + 37, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'roaring_twenties': {
      // Crisp black silk bow tie
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      // Center knot
      ctx.roundRect(cx - 8, chinY + 16, 16, 16, 3);
      ctx.fill();

      // Left wing
      ctx.beginPath();
      ctx.moveTo(cx - 8, chinY + 24);
      ctx.lineTo(cx - 48, chinY + 12);
      ctx.lineTo(cx - 48, chinY + 36);
      ctx.closePath();
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(cx + 8, chinY + 24);
      ctx.lineTo(cx + 48, chinY + 12);
      ctx.lineTo(cx + 48, chinY + 36);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'apollo_lunar': {
      // Metallic red neck ring sealing helmet to EMU suit
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.ellipse(cx, chinY + 45, 155, 42, 0, 0, Math.PI);
      ctx.stroke();

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 4;
      ctx.stroke();
      break;
    }

    case 'medieval_knight': {
      // Fluted polished steel plate gorget framing the neck and chin
      const gorgetGrad = ctx.createLinearGradient(cx - 100, chinY, cx + 100, chinY);
      gorgetGrad.addColorStop(0, '#475569');
      gorgetGrad.addColorStop(0.5, '#CBD5E1');
      gorgetGrad.addColorStop(1, '#475569');
      ctx.fillStyle = gorgetGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 120, chinY + 55);
      ctx.bezierCurveTo(cx - 90, chinY + 5, cx + 90, chinY + 5, cx + 120, chinY + 55);
      ctx.bezierCurveTo(cx + 80, chinY + 100, cx - 80, chinY + 100, cx - 120, chinY + 55);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      break;
    }

    case 'ancient_rome': {
      // Gold laurel brooch / fibula fastening the toga on left shoulder
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx - 110, chinY + 35, 18, 0, Math.PI * 2);
      ctx.fill();

      // Embossed eagle on fibula
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.moveTo(cx - 110, chinY + 26);
      ctx.lineTo(cx - 118, chinY + 40);
      ctx.lineTo(cx - 102, chinY + 40);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

/* =========================================================================
   PERIOD ACCESSORIES & HEADDRESSES
   ========================================================================= */
function drawAccessories(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  activeAccessories: Record<string, boolean>
) {
  const { cx, cy, rx, ry } = era.facePlacement;
  const browY = cy - ry * 0.72;

  ctx.save();

  switch (era.id) {
    case 'high_renaissance': {
      // Medici Velvet Beret with ostrich feather
      if (activeAccessories['beret'] !== false) {
        ctx.fillStyle = '#881337'; // deep velvet wine
        ctx.beginPath();
        ctx.ellipse(cx + 10, browY - 28, rx * 1.35, 42, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // White ostrich plume
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 70, browY - 20);
        ctx.bezierCurveTo(cx - 120, browY - 60, cx - 80, browY - 90, cx - 20, browY - 70);
        ctx.stroke();

        // Pearl jewel cluster on beret
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(cx - 65, browY - 22, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(cx - 65, browY - 22, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Golden Chain of Honor
      if (activeAccessories['gold_chain'] !== false) {
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy + ry + 40, 110, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      }
      break;
    }

    case 'ancient_egypt': {
      // Golden Uraeus Crown on forehead
      if (activeAccessories['uraeus_cobra'] !== false) {
        // Gold forehead circlet
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, rx * 1.05, 1.25 * Math.PI, 1.75 * Math.PI);
        ctx.stroke();

        // Sacred Uraeus Cobra rearing up
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(cx - 8, browY - 5);
        ctx.bezierCurveTo(cx - 16, browY - 35, cx + 16, browY - 50, cx, browY - 75);
        ctx.lineTo(cx + 8, browY - 70);
        ctx.bezierCurveTo(cx - 6, browY - 45, cx + 12, browY - 30, cx + 8, browY - 5);
        ctx.closePath();
        ctx.fill();

        // Ruby cobra eye
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(cx + 2, browY - 68, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ceremonial Golden False Beard
      if (activeAccessories['ceremonial_beard']) {
        const beardGrad = ctx.createLinearGradient(cx, cy + ry, cx, cy + ry + 90);
        beardGrad.addColorStop(0, '#B45309');
        beardGrad.addColorStop(1, '#D97706');
        ctx.fillStyle = beardGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + ry * 0.95);
        ctx.lineTo(cx - 10, cy + ry + 85);
        ctx.lineTo(cx + 10, cy + ry + 85);
        ctx.lineTo(cx + 15, cy + ry * 0.95);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;
    }

    case 'feudal_japan': {
      // Samurai Kabuto clan crest
      if (activeAccessories['samurai_crest'] !== false) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        // Golden crescent horn crest (Maedate)
        ctx.moveTo(cx, browY - 35);
        ctx.bezierCurveTo(cx - 80, browY - 75, cx - 110, browY - 20, cx - 120, browY - 10);
        ctx.bezierCurveTo(cx - 95, browY - 45, cx - 40, browY - 60, cx, browY - 20);
        ctx.bezierCurveTo(cx + 40, browY - 60, cx + 95, browY - 45, cx + 120, browY - 10);
        ctx.bezierCurveTo(cx + 110, browY - 20, cx + 80, browY - 75, cx, browY - 35);
        ctx.closePath();
        ctx.fill();
      }

      // Floating Sakura petals
      if (activeAccessories['sakura_petals'] !== false) {
        drawSakuraPetal(ctx, cx - 140, cy - 80, 0.4);
        drawSakuraPetal(ctx, cx + 150, cy + 30, -0.6);
        drawSakuraPetal(ctx, cx - 80, cy + 180, 0.8);
        drawSakuraPetal(ctx, cx + 110, cy + 220, 0.2);
      }
      break;
    }

    case 'victorian_steampunk': {
      // Silk Stovepipe Top Hat
      if (activeAccessories['top_hat'] !== false) {
        // Hat brim
        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.ellipse(cx, browY - 15, rx * 1.5, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hat crown
        ctx.beginPath();
        ctx.moveTo(cx - rx * 1.05, browY - 18);
        ctx.lineTo(cx - rx * 0.95, browY - 170);
        ctx.lineTo(cx + rx * 0.95, browY - 170);
        ctx.lineTo(cx + rx * 1.05, browY - 18);
        ctx.closePath();
        ctx.fill();

        // Satin ribbon band with brass buckle
        ctx.fillStyle = '#78350F';
        ctx.fillRect(cx - rx * 1.05, browY - 38, rx * 2.1, 20);

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 16, browY - 38, 32, 20);
      }

      // Brass Loupe Monocle
      if (activeAccessories['brass_monocle'] !== false) {
        const eyeX = cx + rx * 0.42;
        const eyeY = cy - ry * 0.15;

        // Monocle brass rim
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Lens glint
        ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 26, 0, Math.PI * 2);
        ctx.fill();

        // Hanging brass chain
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(eyeX + 26, eyeY + 10);
        ctx.quadraticCurveTo(eyeX + 45, eyeY + 70, eyeX + 15, eyeY + 150);
        ctx.stroke();
      }
      break;
    }

    case 'roaring_twenties': {
      // Dapper Fedora
      if (activeAccessories['deco_fedora'] !== false) {
        ctx.fillStyle = '#18181B';
        // Fedora curved brim
        ctx.beginPath();
        ctx.ellipse(cx, browY - 14, rx * 1.45, 28, -0.08, 0, Math.PI * 2);
        ctx.fill();

        // Fedora pinched crown
        ctx.beginPath();
        ctx.moveTo(cx - rx * 1.0, browY - 16);
        ctx.bezierCurveTo(cx - rx * 0.9, browY - 110, cx - 20, browY - 95, cx, browY - 105);
        ctx.bezierCurveTo(cx + 20, browY - 95, cx + rx * 0.9, browY - 110, cx + rx * 1.0, browY - 16);
        ctx.closePath();
        ctx.fill();

        // Gold & Black grosgrain ribbon
        ctx.fillStyle = '#EAB308';
        ctx.fillRect(cx - rx * 0.98, browY - 32, rx * 1.96, 16);
      }
      break;
    }

    case 'apollo_lunar': {
      // Curved Gold Bubble Visor Glass Reflection
      if (activeAccessories['visor_tint'] !== false) {
        ctx.save();
        // Helmet outer bubble outline
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(cx, cy, rx * 1.55, 0, Math.PI * 2);
        ctx.stroke();

        // Gold reflective glass gradient overlay
        const visorGrad = ctx.createLinearGradient(cx - rx * 1.4, cy - ry * 1.4, cx + rx * 1.4, cy + ry * 1.4);
        visorGrad.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
        visorGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.15)');
        visorGrad.addColorStop(0.7, 'rgba(30, 58, 138, 0.1)');
        visorGrad.addColorStop(1, 'rgba(234, 179, 8, 0.35)');

        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, rx * 1.45, 0, Math.PI * 2);
        ctx.fill();

        // Curved specular highlight on glass
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, rx * 1.35, 1.15 * Math.PI, 1.45 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'medieval_knight': {
      // Riveted chainmail coif framing the face
      if (activeAccessories['chainmail_coif'] !== false) {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 1.18, ry * 1.12, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Steel brow band
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(cx - rx * 1.1, browY - 15, rx * 2.2, 22);
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - rx * 1.1, browY - 15, rx * 2.2, 22);
      }
      break;
    }

    case 'ancient_rome': {
      // Golden Laurel Wreath Crown
      if (activeAccessories['laurel_wreath'] !== false) {
        drawLaurelWreath(ctx, cx, browY - 10, rx * 1.25);
      }
      break;
    }
  }

  ctx.restore();
}

/* =========================================================================
   PERIOD ATMOSPHERE, CRAQUELURE, FILM GRAIN, & VIGNETTE
   ========================================================================= */
function applyMasterAtmosphere(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  x: number,
  y: number,
  w: number,
  h: number,
  t: FaceTransform
) {
  ctx.save();

  // 1. Period Color Wash
  if (era.defaultTonalStyle.tintColor) {
    ctx.fillStyle = era.defaultTonalStyle.tintColor;
    ctx.fillRect(x, y, w, h);
  }

  // 2. Craquelure / Oil Painting Cracks (for Renaissance, Egypt, Rome)
  if (era.id === 'high_renaissance' || era.id === 'ancient_egypt' || era.id === 'ancient_rome') {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 0.8;
    for (let c = 0; c < 15; c++) {
      const startX = x + (c * 67) % w;
      const startY = y + (c * 83) % h;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 40, startY + 30);
      ctx.lineTo(startX + 75, startY + 25);
      ctx.stroke();
    }
  }

  // 3. Vignette
  const vigGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, w * 0.25, x + w / 2, y + h / 2, w * 0.7);
  const vigOpacity = 0.35 + (t.contrast - 1) * 0.2;
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vigGrad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.85, Math.max(0.1, vigOpacity))})`);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(x, y, w, h);

  // 4. Subtle Film/Plate Grain
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 160;
  grainCanvas.height = 160;
  const gCtx = grainCanvas.getContext('2d');
  if (gCtx) {
    const imgData = gCtx.createImageData(160, 160);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = Math.random() * 22; // subtle grain opacity
    }
    gCtx.putImageData(imgData, 0, 0);

    const pattern = ctx.createPattern(grainCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(x, y, w, h);
    }
  }

  ctx.restore();
}

/* =========================================================================
   ALIGNMENT GUIDE OVERLAY
   ========================================================================= */
function drawAlignmentGuide(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  t: FaceTransform
) {
  const { cx: baseCx, cy: baseCy, rx: baseRx, ry: baseRy } = era.facePlacement;
  const faceCx = baseCx + t.x;
  const faceCy = baseCy + t.y;
  const radX = baseRx * t.scale * t.widthRatio;
  const radY = baseRy * t.scale;

  ctx.save();
  ctx.translate(faceCx, faceCy);
  ctx.rotate((t.rotate * Math.PI) / 180);

  // Crosshairs
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(15, 0);
  ctx.moveTo(0, -15);
  ctx.lineTo(0, 15);
  ctx.stroke();

  // Eye line guide
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(-radX * 0.7, -radY * 0.15);
  ctx.lineTo(radX * 0.7, -radY * 0.15);
  ctx.stroke();

  // Face oval target
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/* =========================================================================
   MUSEUM FRAME & CURATORIAL BRASS PLAQUE
   ========================================================================= */
function drawMuseumFrameAndPlaque(
  ctx: CanvasRenderingContext2D,
  era: EraConfig,
  w: number,
  h: number,
  padX: number,
  padTop: number,
  paintW: number,
  paintH: number,
  travelerName: string
) {
  ctx.save();

  // 1. Draw Outer Frame Border
  switch (era.frameType) {
    case 'gilded_baroque': {
      // Multi-tier gilded gold frame
      const goldGrad = ctx.createLinearGradient(0, 0, w, h);
      goldGrad.addColorStop(0, '#B45309');
      goldGrad.addColorStop(0.25, '#F59E0B');
      goldGrad.addColorStop(0.5, '#FEF08A');
      goldGrad.addColorStop(0.75, '#D97706');
      goldGrad.addColorStop(1, '#78350F');

      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, w, padTop); // top
      ctx.fillRect(0, h - (h - padTop - paintH), w, h - padTop - paintH); // bottom
      ctx.fillRect(0, 0, padX, h); // left
      ctx.fillRect(w - padX, 0, padX, h); // right

      // Carved molding bevels
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.strokeRect(padX - 4, padTop - 4, paintW + 8, paintH + 8);
      break;
    }

    case 'lacquer_brass': {
      // Japanese black lacquer with polished brass corners
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, w, h);

      // Brass corner brackets
      drawBrassCorner(ctx, 16, 16, 50, 0);
      drawBrassCorner(ctx, w - 16, 16, 50, Math.PI * 0.5);
      drawBrassCorner(ctx, w - 16, h - 16, 50, Math.PI);
      drawBrassCorner(ctx, 16, h - 16, 50, Math.PI * 1.5);
      break;
    }

    case 'art_deco_gold': {
      // Black & gold geometric chevron inlay frame
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      ctx.strokeRect(28, 28, w - 56, h - 56);
      break;
    }

    case 'daguerreotype': {
      // Embossed Victorian brass mat
      ctx.fillStyle = '#292524';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      break;
    }

    case 'nasa_plaque': {
      // Brushed aerospace titanium
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.strokeRect(14, 14, w - 28, h - 28);
      // Screws/rivets
      drawRivet(ctx, 24, 24);
      drawRivet(ctx, w - 24, 24);
      drawRivet(ctx, w - 24, h - 24);
      drawRivet(ctx, 24, h - 24);
      break;
    }

    case 'roman_marble': {
      // Carved travertine marble
      ctx.fillStyle = '#E7E5E4';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#78716C';
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      break;
    }

    case 'medieval_iron':
    case 'egyptian_sandstone':
    default: {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, w - 36, h - 36);
      break;
    }
  }

  // 2. Inner Frame Shadow on painting
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeRect(padX, padTop, paintW, paintH);
  ctx.shadowBlur = 0;

  // 3. Curatorial Plaque (Centered below painting)
  const plaqueW = 540;
  const plaqueH = 92;
  const plaqueX = (w - plaqueW) / 2;
  const plaqueY = padTop + paintH + 24;

  // Plaque brass background
  const pGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + plaqueH);
  pGrad.addColorStop(0, '#D97706');
  pGrad.addColorStop(0.4, '#FDE68A');
  pGrad.addColorStop(0.8, '#B45309');
  pGrad.addColorStop(1, '#78350F');

  ctx.fillStyle = pGrad;
  ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);

  // Plaque dark inner bevel
  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 2;
  ctx.strokeRect(plaqueX + 3, plaqueY + 3, plaqueW - 6, plaqueH - 6);

  // Screws on corners of plaque
  drawRivet(ctx, plaqueX + 12, plaqueY + 12);
  drawRivet(ctx, plaqueX + plaqueW - 12, plaqueY + 12);
  drawRivet(ctx, plaqueX + 12, plaqueY + plaqueH - 12);
  drawRivet(ctx, plaqueX + plaqueW - 12, plaqueY + plaqueH - 12);

  // Plaque Typography
  ctx.textAlign = 'center';

  // Title / Era Name
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 15px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillText(era.name.toUpperCase(), w / 2, plaqueY + 28);

  // Traveler Subject Name
  ctx.fillStyle = '#451A03';
  ctx.font = 'italic 600 21px "Cormorant Garamond", Georgia, serif';
  const nameToDisplay = travelerName.trim() ? travelerName : 'The Time Traveler';
  ctx.fillText(`“${nameToDisplay}”`, w / 2, plaqueY + 54);

  // Epoch & Location
  ctx.fillStyle = '#292524';
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${era.epoch}  ·  ${era.location}`, w / 2, plaqueY + 76);

  ctx.restore();
}

/* =========================================================================
   HELPER VECTOR DRAWING FUNCTIONS
   ========================================================================= */
function drawCypress(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#142918';
  ctx.beginPath();
  ctx.ellipse(x, y - h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 2, y - 5, 4, 10);
}

function drawPalm(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  // Trunk
  ctx.strokeStyle = '#291708';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 10, y - h / 2, x + 8, y - h);
  ctx.stroke();

  // Fronds
  ctx.strokeStyle = '#1D3B16';
  ctx.lineWidth = 3;
  for (let a = -1.2; a <= 1.2; a += 0.4) {
    ctx.beginPath();
    ctx.moveTo(x + 8, y - h);
    ctx.quadraticCurveTo(x + 8 + a * 30, y - h - 15, x + 8 + a * 45, y - h + 15);
    ctx.stroke();
  }
}

function drawHieroglyphs(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(253, 230, 138, 0.4)';
  for (let py = y; py < y + h; py += 36) {
    // Ankh or eye or bird motif
    ctx.beginPath();
    ctx.arc(x + w / 2, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + w / 2 - 2, py + 6, 4, 14);
    ctx.fillRect(x + w / 2 - 8, py + 10, 16, 3);
  }
}

function drawCherryBranch(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number) {
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.quadraticCurveTo(x + dir * 120, y + 60, x + dir * 180, y + 140);
  ctx.stroke();

  // Blossom flowers
  const fX = x + dir * 130;
  const fY = y + 70;
  for (let i = 0; i < 5; i++) {
    const ang = (i * Math.PI * 2) / 5;
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(fX + Math.cos(ang) * 9, fY + Math.sin(ang) * 9, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBrassGear(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Teeth
  const teeth = 12;
  ctx.lineWidth = 6;
  ctx.strokeStyle = color;
  for (let i = 0; i < teeth; i++) {
    const ang = (i * Math.PI * 2) / teeth;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * (r - 2), y + Math.sin(ang) * (r - 2));
    ctx.lineTo(x + Math.cos(ang) * (r + 8), y + Math.sin(ang) * (r + 8));
    ctx.stroke();
  }

  // Inner cutout
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawLunarCrater(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, Math.PI * 0.8, Math.PI * 1.8);
  ctx.stroke();
}

function drawSakuraPetal(ctx: CanvasRenderingContext2D, x: number, y: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = 'rgba(244, 114, 182, 0.8)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLaurelWreath(ctx: CanvasRenderingContext2D, cx: number, browY: number, r: number) {
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;

  // Left arc
  ctx.beginPath();
  ctx.arc(cx - r * 0.1, browY + 10, r * 0.9, Math.PI * 0.7, Math.PI * 1.35);
  ctx.stroke();

  // Right arc
  ctx.beginPath();
  ctx.arc(cx + r * 0.1, browY + 10, r * 0.9, Math.PI * 1.65, Math.PI * 2.3);
  ctx.stroke();

  // Golden laurel leaves
  ctx.fillStyle = '#F59E0B';
  for (let ang = Math.PI * 0.75; ang <= Math.PI * 1.3; ang += 0.15) {
    const lx = cx - r * 0.1 + Math.cos(ang) * r * 0.9;
    const ly = browY + 10 + Math.sin(ang) * r * 0.9;
    ctx.beginPath();
    ctx.ellipse(lx, ly, 11, 4, ang + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let ang = Math.PI * 1.7; ang <= Math.PI * 2.25; ang += 0.15) {
    const lx = cx + r * 0.1 + Math.cos(ang) * r * 0.9;
    const ly = browY + 10 + Math.sin(ang) * r * 0.9;
    ctx.beginPath();
    ctx.ellipse(lx, ly, 11, 4, ang - 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBrassCorner(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.lineTo(size, 14);
  ctx.lineTo(14, 14);
  ctx.lineTo(14, size);
  ctx.lineTo(0, size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRivet(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FDE68A';
  ctx.beginPath();
  ctx.arc(x - 1, y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
