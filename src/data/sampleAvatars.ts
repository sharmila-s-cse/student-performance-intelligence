// Code-generated sample face portraits created with pure Canvas 2D drawings

export interface SampleAvatar {
  id: string;
  name: string;
  subtitle: string;
  getDataUrl: () => string;
}

function createVectorFace(
  skinTone: string,
  hairColor: string,
  hairStyle: 'short' | 'curly' | 'sleek' | 'wavy',
  eyeColor: string,
  eyebrows: string,
  shirtColor: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - neutral studio portrait gradient
  const bgGrad = ctx.createRadialGradient(200, 220, 40, 200, 250, 300);
  bgGrad.addColorStop(0, '#5A5652');
  bgGrad.addColorStop(1, '#242220');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 400, 500);

  // Shoulders & Simple T-shirt
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.moveTo(80, 500);
  ctx.bezierCurveTo(90, 410, 140, 380, 200, 380);
  ctx.bezierCurveTo(260, 380, 310, 410, 320, 500);
  ctx.fill();

  // Neck
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.moveTo(170, 320);
  ctx.lineTo(170, 390);
  ctx.bezierCurveTo(180, 405, 220, 405, 230, 390);
  ctx.lineTo(230, 320);
  ctx.fill();

  // Neck shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(200, 325, 45, 16, 0, 0, Math.PI);
  ctx.fill();

  // Head Oval
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(200, 230, 78, 102, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks soft blush
  const blushGrad = ctx.createRadialGradient(160, 250, 5, 160, 250, 35);
  blushGrad.addColorStop(0, 'rgba(230, 100, 100, 0.22)');
  blushGrad.addColorStop(1, 'rgba(230, 100, 100, 0)');
  ctx.fillStyle = blushGrad;
  ctx.fillRect(120, 220, 80, 60);

  const blushGradR = ctx.createRadialGradient(240, 250, 5, 240, 250, 35);
  blushGradR.addColorStop(0, 'rgba(230, 100, 100, 0.22)');
  blushGradR.addColorStop(1, 'rgba(230, 100, 100, 0)');
  ctx.fillStyle = blushGradR;
  ctx.fillRect(200, 220, 80, 60);

  // Eyes
  const drawEye = (x: number, y: number) => {
    // Sclera
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Upper eyelid line
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y - 1, 15, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  };

  drawEye(168, 220);
  drawEye(232, 220);

  // Eyebrows
  ctx.strokeStyle = eyebrows;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(150, 206);
  ctx.quadraticCurveTo(168, 200, 185, 207);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(215, 207);
  ctx.quadraticCurveTo(232, 200, 250, 206);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = 'rgba(70, 40, 20, 0.35)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(200, 218);
  ctx.lineTo(198, 248);
  ctx.lineTo(206, 252);
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = 'rgba(60, 30, 15, 0.4)';
  ctx.beginPath();
  ctx.arc(194, 254, 2.5, 0, Math.PI * 2);
  ctx.arc(206, 254, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth / Lips
  ctx.fillStyle = '#C27474';
  ctx.beginPath();
  ctx.ellipse(200, 280, 16, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#853A3A';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(184, 280);
  ctx.quadraticCurveTo(200, 283, 216, 280);
  ctx.stroke();

  // Hair
  ctx.fillStyle = hairColor;
  if (hairStyle === 'short') {
    ctx.beginPath();
    ctx.arc(200, 185, 82, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(200, 150, 120, 200);
    ctx.fill();
  } else if (hairStyle === 'curly') {
    for (let angle = Math.PI * 0.8; angle <= Math.PI * 2.2; angle += 0.2) {
      const cx = 200 + Math.cos(angle) * 82;
      const cy = 190 + Math.sin(angle) * 82;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (hairStyle === 'wavy') {
    ctx.beginPath();
    ctx.arc(200, 180, 84, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(285, 330);
    ctx.quadraticCurveTo(260, 350, 230, 300);
    ctx.lineTo(200, 170);
    ctx.lineTo(170, 300);
    ctx.quadraticCurveTo(140, 350, 115, 330);
    ctx.closePath();
    ctx.fill();
  } else {
    // sleek
    ctx.beginPath();
    ctx.ellipse(200, 175, 85, 60, 0, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
  }

  // Subtle vignette over portrait
  const vig = ctx.createRadialGradient(200, 250, 120, 200, 250, 260);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, 400, 500);

  return canvas.toDataURL('image/png');
}

export const SAMPLE_AVATARS: SampleAvatar[] = [
  {
    id: 'avatar_alex',
    name: 'Alex',
    subtitle: 'Warm Brown Eyes · Short Hair',
    getDataUrl: () => createVectorFace('#E0A97E', '#2D241E', 'short', '#4D3622', '#1E1916', '#334155'),
  },
  {
    id: 'avatar_elena',
    name: 'Elena',
    subtitle: 'Hazel Eyes · Wavy Brunette',
    getDataUrl: () => createVectorFace('#F0C8A0', '#4A2A1A', 'wavy', '#5C6F4E', '#321D12', '#475569'),
  },
  {
    id: 'avatar_marcus',
    name: 'Marcus',
    subtitle: 'Deep Obsidian · Curly Coils',
    getDataUrl: () => createVectorFace('#8A5333', '#111010', 'curly', '#2A1B14', '#0D0C0C', '#1E293B'),
  },
  {
    id: 'avatar_mei',
    name: 'Mei-Ling',
    subtitle: 'Almond Eyes · Sleek Dark Hair',
    getDataUrl: () => createVectorFace('#F5D5B8', '#1A1817', 'sleek', '#28231D', '#151312', '#374151'),
  },
];
