export const LOCALES = ['ja', 'en'] as const;
export const DEFAULT_LOCALE = LOCALES[0];

export type Locales = typeof LOCALES[number];
