/** 默认 Gemini API Key（Base64 编码存储，运行时解码，不读环境变量） */
const ENCODED = "QUl6YVN5RDhIVlgzSGcxUDNzMkJUTUJpZFZJV2U2aGg4VThpUDNz";

export function getDefaultGeminiKey(): string {
  try {
    return typeof atob !== "undefined" ? atob(ENCODED) : "";
  } catch {
    return "";
  }
}
