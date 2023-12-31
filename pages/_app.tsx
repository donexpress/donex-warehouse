import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { LanguageProvider } from "../src/app/components/LanguageContextCmpt";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import messages from "../messages";
import { Languages } from "../src/types/index";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router.query;
  const { asPath } = router;
  const [language, setLanguage] = useState<string | undefined>("es");

  useEffect(() => {
    if (locale !== undefined) {
      const language: string | undefined = Array.isArray(locale)
        ? locale[0]
        : locale;
      setLanguage(language);

      // Si el idioma no está en la URL, redirecciona a la URL con el idioma
      if (!isTypeOfLanguages(language)) {
        router.push("/es/oms");
      }
    }
  }, [locale]);

  if (
    (locale === undefined ||
      !isTypeOfLanguages(Array.isArray(locale) ? locale[0] : locale)) &&
    asPath.startsWith("/[locale]")
  ) {
    return (
      <div
        className="flex justify-center align-center items-center content-center"
        style={{ height: "100vh" }}
      >
        <h1 className="text-base font-bold">Cargando...</h1>
      </div>
    );
  }

  return (
    <NextUIProvider>
      <IntlProvider
        locale={getLocale(language)}
        messages={getMessages(getLocale(language) as Languages)}
      >
        <LanguageProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </LanguageProvider>
      </IntlProvider>
    </NextUIProvider>
  );
}

function getMessages(locale: Languages) {
  return messages[locale] || messages.en;
}

function getLocale(locale: string | undefined): string {
  return isTypeOfLanguages(locale) ? (locale as string) : "en";
}

function isTypeOfLanguages(locale: string | undefined): boolean {
  const languages: Languages[] = Object.keys(messages) as Languages[];
  const allowedLanguages: ReadonlyArray<Languages> = languages;
  return (
    locale !== undefined && allowedLanguages.indexOf(locale as Languages) !== -1
  );
}

export default MyApp;
