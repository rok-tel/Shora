import { Language } from '@shora/common/models/types'
import 'server-only'
 
const locales = {
  en: () => import('./locales/en.json').then((module) => module.default),
  he: () => import('./locales/he.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: Language) => locales[locale]()