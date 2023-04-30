import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import fr from "./fr.json";
import pl from "./pl.json";
import ua from "./ua.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  pl: {
    translation: pl,
  },
  ua: {
    translation: ua,
  },
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
