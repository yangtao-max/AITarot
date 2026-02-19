import { CARD_IMAGES } from './cardImages';

export interface TarotCard {
  name: string;
  nameEn: string;
  image: string;
  meaning: string;
}

export const TAROT_CARDS: TarotCard[] = [
  { name: '愚者', nameEn: 'The Fool', image: CARD_IMAGES['愚者'], meaning: '开始、自由、纯真、冒险。' },
  { name: '魔术师', nameEn: 'The Magician', image: CARD_IMAGES['魔术师'], meaning: '创造力、行动、潜能、意志力。' },
  { name: '女祭司', nameEn: 'The High Priestess', image: CARD_IMAGES['女祭司'], meaning: '直觉、神秘、潜意识、智慧。' },
  { name: '女皇', nameEn: 'The Empress', image: CARD_IMAGES['女皇'], meaning: '丰饶、母性、自然、感官享受。' },
  { name: '皇帝', nameEn: 'The Emperor', image: CARD_IMAGES['皇帝'], meaning: '权威、结构、稳定、领导力。' },
  { name: '教皇', nameEn: 'The Hierophant', image: CARD_IMAGES['教皇'], meaning: '传统、信仰、教育、精神指引。' },
  { name: '恋人', nameEn: 'The Lovers', image: CARD_IMAGES['恋人'], meaning: '爱、和谐、关系、价值观。' },
  { name: '战车', nameEn: 'The Chariot', image: CARD_IMAGES['战车'], meaning: '意志、胜利、自律、控制。' },
  { name: '力量', nameEn: 'Strength', image: CARD_IMAGES['力量'], meaning: '勇气、耐心、内在力量、同情。' },
  { name: '隐士', nameEn: 'The Hermit', image: CARD_IMAGES['隐士'], meaning: '内省、寻求真理、孤独、指引。' },
  { name: '命运之轮', nameEn: 'Wheel of Fortune', image: CARD_IMAGES['命运之轮'], meaning: '运气、转折、轮回、不可控。' },
  { name: '正义', nameEn: 'Justice', image: CARD_IMAGES['正义'], meaning: '公平、真相、因果、平衡。' },
  { name: '倒吊人', nameEn: 'The Hanged Man', image: CARD_IMAGES['倒吊人'], meaning: '暂停、牺牲、新视角、放手。' },
  { name: '死亡', nameEn: 'Death', image: CARD_IMAGES['死亡'], meaning: '结束、转变、过渡、重生。' },
  { name: '节制', nameEn: 'Temperance', image: CARD_IMAGES['节制'], meaning: '平衡、节制、融合、耐心。' },
  { name: '恶魔', nameEn: 'The Devil', image: CARD_IMAGES['恶魔'], meaning: '束缚、成瘾、物质主义、诱惑。' },
  { name: '高塔', nameEn: 'The Tower', image: CARD_IMAGES['高塔'], meaning: '剧变、灾难、觉醒、解放。' },
  { name: '星星', nameEn: 'The Star', image: CARD_IMAGES['星星'], meaning: '希望、灵感、宁静、更新。' },
  { name: '月亮', nameEn: 'The Moon', image: CARD_IMAGES['月亮'], meaning: '不安、幻觉、直觉、波动。' },
  { name: '太阳', nameEn: 'The Sun', image: CARD_IMAGES['太阳'], meaning: '成功、快乐、活力、自信。' },
  { name: '审判', nameEn: 'Judgement', image: CARD_IMAGES['审判'], meaning: '重生、觉醒、决定、赦免。' },
  { name: '世界', nameEn: 'The World', image: CARD_IMAGES['世界'], meaning: '完成、达成、旅行、圆满。' },
];
