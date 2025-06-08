import 'server-only'
import { Locales } from '@/const/locales'
 
const translations = {
  'en': () => import('@/dictionaries/en.json').then((module) => module.default),
  'ja': () => import('@/dictionaries/ja.json').then((module) => module.default),
}
 
export const getTranslations = async (locale: Locales) => translations[locale]();
