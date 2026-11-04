import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
let language = 'ar';
try {
  const saved = localStorage.getItem('blue-language');
  if (['ar', 'en'].includes(saved)) language = saved;
} catch {
  /* Language storage is optional. */
}
i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: language,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
  returnNull: false,
});
const sync = (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  try {
    localStorage.setItem('blue-language', lng);
  } catch {
    /* Private browsing can deny storage. */
  }
};
sync(language);
i18n.on('languageChanged', sync);
export default i18n;
