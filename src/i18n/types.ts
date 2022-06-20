import { i18n, Resource, InitOptions, TFunction } from "i18next";
import { i18nextDefaultConfig } from "./config.default";

export type I18nextInstance = i18n;

export type I18nextResource = Resource;

export type I18nextTFunction = TFunction;

export type Namespaces = string | Array<string>;

export type I18nextInitOptions = InitOptions & typeof i18nextDefaultConfig;

export type I18nextProps = {
  initialI18nStore: I18nextResource;
  initialLocale: string;
  namespaces: Namespaces;
  customI18nextConfig: I18nextInitOptions;
};

export type NextI18nextPageProps = {
  _nextI18Next: I18nextProps;
};

export type WithI18nextProps<IP> =
  | (IP & NextI18nextPageProps)
  | NextI18nextPageProps;

export type I18nextInstanceMiddleware = (
  i18nInstance: I18nextInstance
) => I18nextInstance;

export type CreateClientParams = {
  locale: string;
  namespaces: Namespaces;
  customI18nextConfig: I18nextInitOptions;
  getI18nextInstanceMiddleware?: () => I18nextInstanceMiddleware;
};

export type TLocalisationKeyObj = {
  key: string;
  value: string;
  namespace: string;
  appType: string;
  locale?: string;
};
