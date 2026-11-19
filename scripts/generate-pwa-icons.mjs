import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve("./public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp Islamic mosque icon SVG
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#07231a"/>
  <rect x="12" y="12" width="488" height="488" rx="98" fill="none" stroke="#10b981" stroke-width="6" stroke-opacity="0.4"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#07231a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#glow)"/>
  
  <!-- Crescent Moon & Star -->
  <path d="M 285 105 A 48 48 0 1 0 325 185 A 38 38 0 1 1 285 105 Z" fill="#fbbf24"/>
  <polygon points="340,115 344,127 356,127 346,134 350,146 340,138 330,146 334,134 324,127 336,127" fill="#fbbf24"/>
  
  <!-- Mosque Central Dome -->
  <path d="M 256 160 C 220 185 195 235 195 285 L 317 285 C 317 235 292 185 256 160 Z" fill="#10b981"/>
  <!-- Finial -->
  <line x1="256" y1="135" x2="256" y2="160" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
  <circle cx="256" cy="132" r="6" fill="#fbbf24"/>

  <!-- Left Minaret -->
  <rect x="135" y="240" width="28" height="150" rx="4" fill="#047857"/>
  <path d="M 130 240 L 149 205 L 168 240 Z" fill="#fbbf24"/>
  <circle cx="149" cy="200" r="3" fill="#fbbf24"/>
  
  <!-- Right Minaret -->
  <rect x="349" y="240" width="28" height="150" rx="4" fill="#047857"/>
  <path d="M 344 240 L 363 205 L 382 240 Z" fill="#fbbf24"/>
  <circle cx="363" cy="200" r="3" fill="#fbbf24"/>

  <!-- Mosque Main Body -->
  <rect x="180" y="285" width="152" height="105" fill="#065f46"/>
  <!-- Central Arched Doorway -->
  <path d="M 230 390 L 230 335 C 230 320 282 320 282 335 L 282 390 Z" fill="#022c22"/>
  
  <!-- Base Foundation -->
  <rect x="110" y="390" width="292" height="22" rx="6" fill="#fbbf24"/>
</svg>
`;

async function main() {
  const svgBuffer = Buffer.from(svgIcon);

  // Write SVG
  fs.writeFileSync(path.join(publicDir, "icon.svg"), svgIcon.trim());

  // Generate 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));

  // Generate 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  // Generate favicon
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, "favicon.png"));

  console.log("PWA Icons generated successfully in public/!");
}

main().catch(console.error);
