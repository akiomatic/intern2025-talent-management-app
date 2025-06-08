import 'server-only'
import { Locales } from '@/const/locales'
 
const dictionaries = {
  'en': () => import('@/dictionaries/en.json').then((module) => module.default),
  'ja': () => import('@/dictionaries/ja.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: Locales) => dictionaries[locale]();
