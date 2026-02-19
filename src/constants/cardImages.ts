// Simple SVG representations of Tarot cards to ensure no network access is needed.
// In a real app, these would be high-quality PNG/WebP files in the public folder.

const toBase64 = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  } catch (e) {
    return '';
  }
};

const createCardSvg = (name: string, color: string, symbol: string) => {
  const svg = `
    <svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad_${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
        </linearGradient>
        <filter id="glow_${name}">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Card Base -->
      <rect width="400" height="600" fill="url(#cardGrad_${name})" rx="20"/>
      
      <!-- Decorative Border -->
      <rect x="20" y="20" width="360" height="560" fill="none" stroke="${color}" stroke-width="1" rx="15" opacity="0.3"/>
      <rect x="30" y="30" width="340" height="540" fill="none" stroke="${color}" stroke-width="2" rx="12" opacity="0.6"/>
      
      <!-- Corner Ornaments -->
      <path d="M40 40 L80 40 M40 40 L40 80" stroke="${color}" stroke-width="2" fill="none"/>
      <path d="M360 40 L320 40 M360 40 L360 80" stroke="${color}" stroke-width="2" fill="none"/>
      <path d="M40 560 L80 560 M40 560 L40 520" stroke="${color}" stroke-width="2" fill="none"/>
      <path d="M360 560 L320 560 M360 560 L360 520" stroke="${color}" stroke-width="2" fill="none"/>
      
      <!-- Center Symbol -->
      <g filter="url(#glow_${name})">
        <circle cx="200" cy="280" r="120" fill="none" stroke="${color}" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.4"/>
        <circle cx="200" cy="280" r="100" fill="none" stroke="${color}" stroke-width="1" opacity="0.2"/>
        <text x="200" y="300" dominant-baseline="middle" text-anchor="middle" fill="${color}" font-size="100">${symbol}</text>
      </g>
      
      <!-- Card Name -->
      <text x="200" y="500" dominant-baseline="middle" text-anchor="middle" fill="${color}" font-family="serif" font-style="italic" font-size="28" letter-spacing="4" filter="url(#glow_${name})">${name}</text>
      
      <!-- Decorative Lines -->
      <path d="M100 530 L300 530" stroke="${color}" stroke-width="0.5" opacity="0.5"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

const createHeroSvg = () => {
  const svg = `
    <svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heroGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#4bee2b;stop-opacity:0.3" />
          <stop offset="70%" style="stop-color:#132210;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#132210;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="#132210"/>
      <circle cx="400" cy="500" r="400" fill="url(#heroGrad)" />
      
      <!-- Sacred Geometry -->
      <g opacity="0.2" stroke="#4bee2b" stroke-width="1" fill="none">
        <circle cx="400" cy="500" r="300"/>
        <circle cx="400" cy="500" r="200"/>
        <path d="M400 100 L400 900 M100 500 L700 500"/>
        <path d="M188 288 L612 712 M612 288 L188 712"/>
      </g>
      
      <text x="400" y="520" dominant-baseline="middle" text-anchor="middle" fill="#4bee2b" font-size="200" opacity="0.6">✨</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

export const HERO_IMAGE = createHeroSvg();

export const CARD_IMAGES: Record<string, string> = {
  '愚者': createCardSvg('The Fool', '#E5E5E5', '🃏'),
  '魔术师': createCardSvg('The Magician', '#FFD700', '🪄'),
  '女祭司': createCardSvg('The High Priestess', '#C0C0C0', '🌙'),
  '女皇': createCardSvg('The Empress', '#FF69B4', '👑'),
  '皇帝': createCardSvg('The Emperor', '#CD7F32', '⚔️'),
  '教皇': createCardSvg('The Hierophant', '#F0E68C', '⛪'),
  '恋人': createCardSvg('The Lovers', '#FF1493', '❤️'),
  '战车': createCardSvg('The Chariot', '#4682B4', '🏎️'),
  '力量': createCardSvg('Strength', '#DAA520', '🦁'),
  '隐士': createCardSvg('The Hermit', '#708090', '🕯️'),
  '命运之轮': createCardSvg('Wheel of Fortune', '#FFD700', '🎡'),
  '正义': createCardSvg('Justice', '#B0C4DE', '⚖️'),
  '倒吊人': createCardSvg('The Hanged Man', '#9370DB', '👣'),
  '死亡': createCardSvg('Death', '#696969', '💀'),
  '节制': createCardSvg('Temperance', '#AFEEEE', '🍷'),
  '恶魔': createCardSvg('The Devil', '#8B0000', '🔥'),
  '高塔': createCardSvg('The Tower', '#FFA500', '⚡'),
  '星星': createCardSvg('The Star', '#FFFACD', '⭐'),
  '月亮': createCardSvg('The Moon', '#E6E6FA', '🌑'),
  '太阳': createCardSvg('The Sun', '#FF8C00', '☀️'),
  '审判': createCardSvg('Judgement', '#F5F5F5', '🎺'),
  '世界': createCardSvg('The World', '#32CD32', '🌍'),
};
