/**
 * Korean Josa (조사) Utility for natural grammar
 */

export function hasJongseong(word: string): boolean {
  if (!word || typeof word !== 'string') return false;
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 > 0;
}

/**
 * 인명 + 이/가
 * 예: 민재 -> 민재가, 하은 -> 하은이가, 도현 -> 도현이가
 */
export function josaIga(name: string): string {
  if (!name) return '';
  return hasJongseong(name) ? `${name}이가` : `${name}가`;
}

/**
 * 인명 + 은/는
 * 예: 민재 -> 민재는, 하은 -> 하은이는, 도현 -> 도현이는
 */
export function josaEunNeun(name: string): string {
  if (!name) return '';
  return hasJongseong(name) ? `${name}이는` : `${name}는`;
}

/**
 * 인명 + 을/를
 * 예: 민재 -> 민재를, 하은 -> 하은이를, 도현 -> 도현이를
 */
export function josaEulReul(name: string): string {
  if (!name) return '';
  return hasJongseong(name) ? `${name}이를` : `${name}를`;
}

/**
 * 인명 + 과/와
 * 예: 민재 -> 민재와, 하은 -> 하은이와, 도현 -> 도현이와
 */
export function josaGwaWa(name: string): string {
  if (!name) return '';
  return hasJongseong(name) ? `${name}이와` : `${name}와`;
}

/**
 * 인명 호칭 (아/야)
 * 예: 민재 -> 민재야, 하은 -> 하은아, 도현 -> 도현아, 예은 -> 예은아
 */
export function josaCalling(name: string): string {
  if (!name) return '';
  return hasJongseong(name) ? `${name}아` : `${name}야`;
}
