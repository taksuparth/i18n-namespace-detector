//libs
import { ComponentType, ReactElement, forwardRef, Ref } from "react";

//hooks
import { useTranslation, Trans } from "react-i18next";
import hoistNonReactStatics from "hoist-non-react-statics";
import { useLoadNamespaceContext } from "./ssrLoadNamespaceContext";

//types
import type { UseTranslationResponse, TransProps } from "react-i18next";

type StringLiteral<T> = T extends `${string & T}` ? T : never;

type CustomHookReturnType<ns> = Omit<
  UseTranslationResponse<StringLiteral<ns>>,
  "t" | "ready"
> & {
  [K in `__${StringLiteral<ns>}T`]: UseTranslationResponse<
    StringLiteral<ns>
  >["t"];
} & {
  [K in `${StringLiteral<ns>}TranslationLoading`]: UseTranslationResponse<
    StringLiteral<ns>
  >["ready"];
};

type I18nUtils<ns> = {
  [P in `use${Capitalize<StringLiteral<ns>>}Translation`]: (
    options?: Parameters<typeof useTranslation>[1]
  ) => CustomHookReturnType<ns>;
} & {
  [K in `${Capitalize<StringLiteral<ns>>}Trans`]: (
    props: Omit<TransProps<any, StringLiteral<ns>>, "ns">
  ) => ReactElement;
} & {
  [K in `with${Capitalize<StringLiteral<ns>>}Translation`]: <P = any>(
    options?: Parameters<typeof useTranslation>[1]
  ) => (
    Component: ComponentType<P>
  ) => ComponentType<Omit<P, keyof CustomHookReturnType<ns>>>;
};

function convertNsToCapitalizedNs<T extends string>(ns: T): Capitalize<T> {
  return `${ns.charAt(0).toUpperCase()}${ns.slice(1)}` as Capitalize<T>;
}

/**
 * Note: namespace must be a camelCased string
 * @param namespace
 */
export function build<T>(
  namespace: StringLiteral<T>
): I18nUtils<StringLiteral<T>> {
  const hookName = `use${convertNsToCapitalizedNs(
    namespace
  )}Translation` as const;
  const transComponentName = `${convertNsToCapitalizedNs(
    namespace
  )}Trans` as const;
  const tFunctionName = `__${namespace}T` as const;
  const loadingName = `${namespace}TranslationLoading` as const;
  const hocName = `with${convertNsToCapitalizedNs(
    namespace
  )}Translation` as const;

  type hookReturnType = Omit<
    UseTranslationResponse<StringLiteral<T>>,
    "t" | "ready"
  > & {
    [K in `__${StringLiteral<T>}T`]: UseTranslationResponse<
      StringLiteral<T>
    >["t"];
  } & {
    [K in `${StringLiteral<T>}TranslationLoading`]: UseTranslationResponse<
      StringLiteral<T>
    >["ready"];
  };

  const useCustomTranslation = (
    options?: Parameters<typeof useTranslation>[1]
  ): hookReturnType => {
    useLoadNamespaceContext(namespace);

    //@ts-ignore
    const { t, ready, i18n } = useTranslation(namespace, options);

    return {
      i18n,
      [tFunctionName]: t,
      [loadingName]: !ready,
    } as unknown as hookReturnType;
  };

  return {
    [hookName]: useCustomTranslation,
    [transComponentName]: (
      props: Omit<TransProps<any, StringLiteral<T>>, "ns">
    ): ReactElement => {
      useLoadNamespaceContext(namespace);

      return <Trans<any, StringLiteral<T>> {...props} ns={namespace} />;
    },
    [hocName]: function withCustomTranslation<P = any>(
      options?: Parameters<typeof useTranslation>[1]
    ) {
      return function (Component: ComponentType<P>) {
        const TranslatedComponent = forwardRef(
          (
            props: ComponentType<Omit<P, keyof hookReturnType>>,
            ref: Ref<HTMLElement>
          ) => (
            <Component
              {...(props as unknown as P)}
              {...useCustomTranslation(options)}
              ref={ref}
            />
          )
        );

        //hoistNonReactStatics will retain static members of source component to translated component
        return hoistNonReactStatics(TranslatedComponent, Component);
      };
    },
  } as unknown as I18nUtils<StringLiteral<T>>;
}
