export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  tag?: string;
  tagType?: 'basic' | 'hot' | 'expert';
  category: 'daily' | 'love' | 'career' | 'general' | 'year';
  description: string;
  fullDescription: string;
  cardCount: number;
  duration: string;
  positions: SpreadPosition[];
  layoutType: 'single' | 'triangle' | 'hexagram' | 'cross';
}

export const SPREADS: TarotSpread[] = [
  {
    id: 'single',
    name: '单张牌',
    tag: '基础',
    tagType: 'basic',
    category: 'daily',
    description: '每日运势或简单指引',
    fullDescription: '单张牌占卜是最基础也是最直接的占卜方式。它适合用于获取每日的整体运势，或者针对一个非常具体的问题寻求快速的建议和启示。',
    cardCount: 1,
    duration: '~2 分钟',
    layoutType: 'single',
    positions: [
      { id: 1, name: '核心启示', description: '代表当前问题的核心状况或今日的整体能量指引。' }
    ]
  },
  {
    id: 'triangle',
    name: '圣三角',
    tag: '热门',
    tagType: 'hot',
    category: 'general',
    description: '过去、现在、未来 • 适合简单是非问题',
    fullDescription: '圣三角牌阵是塔罗占卜中最经典、应用最广泛的牌阵之一。它通过三个维度来剖析事物的发展脉络，帮助你理清现状并预见未来。',
    cardCount: 3,
    duration: '~5 分钟',
    layoutType: 'triangle',
    positions: [
      { id: 1, name: '过去', description: '导致现状的原因或背景。' },
      { id: 2, name: '现在', description: '目前面临的状况、挑战或机会。' },
      { id: 3, name: '未来', description: '如果保持现状，事情可能的发展结果。' }
    ]
  },
  {
    id: 'hexagram',
    name: '六芒星',
    category: 'general',
    description: '特定问题深度洞察 • 关系与环境',
    fullDescription: '六芒星牌阵（又称大卫之星）是一个非常平衡的牌阵，适合用于深入分析特定问题，特别是涉及人际关系、环境影响以及个人内心状态的复杂情况。',
    cardCount: 7,
    duration: '~10 分钟',
    layoutType: 'hexagram',
    positions: [
      { id: 1, name: '过去', description: '问题的根源。' },
      { id: 2, name: '现在', description: '当前的进展。' },
      { id: 3, name: '未来', description: '未来的趋势。' },
      { id: 4, name: '对策', description: '解决问题的建议。' },
      { id: 5, name: '环境', description: '周围人或环境的影响。' },
      { id: 6, name: '障碍', description: '面临的困难或干扰。' },
      { id: 7, name: '结论', description: '最终的预测结果。' }
    ]
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    tag: '专家',
    tagType: 'expert',
    category: 'general',
    description: '全方位深度解析复杂状况',
    fullDescription: '凯尔特十字是塔罗牌中历史最悠久、最著名且最复杂的牌阵之一。它能提供极其详尽的信息，涵盖了问题的现状、挑战、潜意识影响、过去、近期未来、个人态度、环境因素、希望与恐惧，以及最终结果。',
    cardCount: 10,
    duration: '~20 分钟',
    layoutType: 'cross',
    positions: [
      { id: 1, name: '现状', description: '问题的核心。' },
      { id: 2, name: '挑战', description: '阻碍或交叉影响。' },
      { id: 3, name: '潜意识', description: '深层的动机或根源。' },
      { id: 4, name: '过去', description: '已发生的影响。' },
      { id: 5, name: '意识', description: '你的目标或可能的最佳结果。' },
      { id: 6, name: '近期未来', description: '即将发生的事情。' },
      { id: 7, name: '自我', description: '你对问题的态度。' },
      { id: 8, name: '环境', description: '他人的看法或外部影响。' },
      { id: 9, name: '希望/恐惧', description: '你的内心期望或担忧。' },
      { id: 10, name: '最终结果', description: '长期的发展趋向。' }
    ]
  }
];
