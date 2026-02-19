// 优先使用本地 cardImages 目录的图片（不依赖 GVS/网络），缺失时回退为内联 SVG。

const LOCAL_CARD_IMAGES_BASE = '/cardImages';

/** 中文牌名 -> 本地文件名（与 cardImages 目录内一致，塔罗牌全集 78 张） */
const LOCAL_CARD_FILENAMES: Record<string, string> = {
  // 大阿尔卡纳 22 张
  '愚者': 'The Fool.jpg',
  '魔术师': 'The Magician.jpg',
  '女祭司': 'The High Priestess.jpg',
  '女皇': 'The Empress.jpg',
  '皇帝': 'The Emperor.jpg',
  '教皇': 'The Hierophant.jpg',
  '恋人': 'The Lovers.jpg',
  '战车': 'The Chariot.jpg',
  '力量': 'The Strength.jpg',
  '隐士': 'The Hermit.jpg',
  '命运之轮': 'The Wheel of Fortune.jpg',
  '正义': 'The Justice.jpg',
  '倒吊人': 'The Hanged Man.jpg',
  '死亡': 'The Death.jpg',
  '节制': 'The Temperance.jpg',
  '恶魔': 'The Devil.jpg',
  '高塔': 'The Tower.jpg',
  '星星': 'The Star.jpg',
  '月亮': 'The Moon.jpg',
  '太阳': 'The Sun.jpg',
  '审判': 'The Judgement.jpg',
  '世界': 'The World.jpg',
  // 权杖 14 张
  '权杖王牌': 'The Ace of Wands.jpg',
  '权杖二': 'The Two of Wands.jpg',
  '权杖三': '24 Three of Wands.jpg',
  '权杖四': '25 Four of Wands.jpg',
  '权杖五': '26 Five of Wands.jpg',
  '权杖六': '27 Six of Wands.jpg',
  '权杖七': '28 Seven of Wands.jpg',
  '权杖八': '29 Eight of Wands.jpg',
  '权杖九': '30 Nine of Wands.jpg',
  '权杖十': '31 Ten of Wands.jpg',
  '权杖侍从': '32 Page of Wands.jpg',
  '权杖骑士': '33 Knight of Wands.jpg',
  '权杖王后': '34 Queen of Wands.jpg',
  '权杖国王': '35 King of Wands.jpg',
  // 星币 14 张
  '星币王牌': '36 Ace of Pentacles.jpg',
  '星币二': '37 Two of Pentacles.jpg',
  '星币三': '38 Three of Pentacles.jpg',
  '星币四': '39 Four of Pentacles.jpg',
  '星币五': '40 Five of Pentacles.jpg',
  '星币六': '41 Six of Pentacles.jpg',
  '星币七': '42 Seven of Pentacles.jpg',
  '星币八': '43 Eight of Pentacles.jpg',
  '星币九': '44 Nine of Pentacles.jpg',
  '星币十': '45 Ten of Pentacles.jpg',
  '星币侍从': '46 Page of Pentacles.jpg',
  '星币骑士': '47 Knight of Pentacles.jpg',
  '星币王后': '48 Queen of Pentacles.jpg',
  '星币国王': '49 King of Pentacles.jpg',
  // 圣杯 14 张
  '圣杯王牌': '50 Ace of Cups.jpg',
  '圣杯二': '51 Two of Cups.jpg',
  '圣杯三': '52 Three of Cups.jpg',
  '圣杯四': '53 Four of Cups.jpg',
  '圣杯五': '54 Five of Cups.jpg',
  '圣杯六': '55 Six of Cups.jpg',
  '圣杯七': '56 Seven of Cups.jpg',
  '圣杯八': '57 Eight of Cups.jpg',
  '圣杯九': '58 Nine of Cups.jpg',
  '圣杯十': '59 Ten of Cups.jpg',
  '圣杯侍从': '60 Page of Cups.jpg',
  '圣杯骑士': '61 Knight of Cups.jpg',
  '圣杯王后': '62 Queen of Cups.jpg',
  '圣杯国王': '63 King of Cups.jpg',
  // 宝剑 14 张
  '宝剑王牌': '64 Ace of Swords.jpg',
  '宝剑二': '65 Two of Swords.jpg',
  '宝剑三': '66 Three of Swords.jpg',
  '宝剑四': '67 Four of Swords.jpg',
  '宝剑五': '68 Five of Swords.jpg',
  '宝剑六': '69 Six of Swords.jpg',
  '宝剑七': '70 Seven of Swords.jpg',
  '宝剑八': '71 Eight of Swords.jpg',
  '宝剑九': '72 Nine of Swords.jpg',
  '宝剑十': '73 Ten of Swords.jpg',
  '宝剑侍从': '74 Page of Swords.jpg',
  '宝剑骑士': '75 Knight of Swords.jpg',
  '宝剑王后': '76 Queen of Swords.jpg',
  '宝剑国王': '77 King of Swords.jpg',
};

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

/** 优先返回本地 cardImages 路径，无则回退 SVG */
function getCardImageUrl(cnName: string, svgFallback: string): string {
  const filename = LOCAL_CARD_FILENAMES[cnName];
  if (filename) {
    return `${LOCAL_CARD_IMAGES_BASE}/${encodeURIComponent(filename)}`;
  }
  return svgFallback;
}

const createHeroSvg = () => {
  const svg = `
    <svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heroGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#7f19e6;stop-opacity:0.35" />
          <stop offset="70%" style="stop-color:#191121;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#0d0614;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="#191121"/>
      <circle cx="400" cy="500" r="400" fill="url(#heroGrad)" />
      
      <!-- Sacred Geometry -->
      <g opacity="0.2" stroke="#7f19e6" stroke-width="1" fill="none">
        <circle cx="400" cy="500" r="300"/>
        <circle cx="400" cy="500" r="200"/>
        <path d="M400 100 L400 900 M100 500 L700 500"/>
        <path d="M188 288 L612 712 M612 288 L188 712"/>
      </g>
      
      <text x="400" y="520" dominant-baseline="middle" text-anchor="middle" fill="#7f19e6" font-size="200" opacity="0.5">✨</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

export const HERO_IMAGE = createHeroSvg();

const svgFallbacks: Record<string, string> = {
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

export const CARD_IMAGES: Record<string, string> = Object.fromEntries(
  Object.keys(LOCAL_CARD_FILENAMES).map((cn) => [
    cn,
    getCardImageUrl(cn, (svgFallbacks as Record<string, string>)[cn] ?? ''),
  ])
);
