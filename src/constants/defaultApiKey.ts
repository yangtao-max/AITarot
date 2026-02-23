/** 默认 API Key（当前为 DeepSeek，Base64 编码存储，运行时解码） */
const ENCODED = "c2stYmIzZTYxZjZhZDc2NGEzYjlmMDA5ZjdhYTM4ZThjMzk=";

export function getDefaultApiKey(): string {
  try {
    return typeof atob !== "undefined" ? atob(ENCODED) : "";
  } catch {
    return "";
  }
}
