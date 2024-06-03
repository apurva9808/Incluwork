// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        lng: 'en',  //if u want to change language change here
        fallbackLng: 'en',
        ns: ['common'], // common.json should be there in each lang folder
        backend : {
            loadPath:'/i18n/{{lng}}/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
