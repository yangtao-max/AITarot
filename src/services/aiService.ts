import { GoogleGenAI } from "@google/genai";
import { TarotSpread } from "../constants/spreads";
import { TarotCard } from "../constants/cards";
import { AISettings } from "../context/SettingsContext";

export async function interpretTarot(
  question: string,
  spread: TarotSpread,
  drawnCards: { position: string; card: TarotCard }[],
  settings: AISettings
): Promise<string> {
  const cardsInfo = drawnCards
    .map((d) => `位置: ${d.position}, 牌名: ${d.card.name}, 含义: ${d.card.meaning}, 图片地址: ${d.card.image}`)
    .join("\n");

  const prompt = `
    你是一位极具洞察力的塔罗占卜师。
    
    用户的问题: "${question}"
    牌阵: "${spread.name}"
    
    抽出的牌及其位置:
    ${cardsInfo}
    
    请提供一份精准、精炼且富有启发性的解读。
    
    要求:
    1. 解读要精准对接用户的问题，不要说废话。
    2. 语言要优美但简洁，避免冗长的开场白。
    3. 在解读每个位置的牌时，请务必插入该牌的图片，格式为: ![牌名](图片地址)
    4. 整体风格要专业、神秘且给人力量。
    5. 使用 Markdown 格式，但确保排版极其整洁。不要出现多余的符号。
    6. 最后的总结要给出一个明确的行动建议。
  `;

  if (settings.provider === 'gemini') {
    return callGemini(prompt, settings);
  } else {
    return callOpenAICompatible(prompt, settings);
  }
}

async function callGemini(prompt: string, settings: AISettings): Promise<string> {
  const apiKey = settings.apiKey || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    return "未检测到 Gemini API Key，请在设置中配置。";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: settings.model || "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "抱歉，灵感暂时中断。请稍后再试。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Handle specific RPC error message if needed
    if (error?.message?.includes('Rpc failed')) {
      return "AI 服务连接失败 (RPC Error)。请尝试切换模型或稍后再试。";
    }
    return "解读过程中发生了错误，请检查网络或稍后再试。";
  }
}

async function callOpenAICompatible(prompt: string, settings: AISettings): Promise<string> {
  const endpoints: Record<string, string> = {
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
    'qwen': 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    'kimi': 'https://api.moonshot.cn/v1/chat/completions',
  };

  const endpoint = endpoints[settings.provider];
  if (!endpoint) return "未知的服务商";

  if (!settings.apiKey) {
    return "请在设置中配置该模型的 API Key 以后再试。";
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: '你是一位极具洞察力的塔罗占卜师。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "抱歉，灵感暂时中断。请稍后再试。";
  } catch (error) {
    console.error(`${settings.provider} API Error:`, error);
    return "解读过程中发生了错误，请检查 API Key 或网络。";
  }
}
