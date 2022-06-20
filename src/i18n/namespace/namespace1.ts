import { build } from "../i18NamespaceFactory";

export const NAMSPACE1 = "namespace1" as const;

const { useNamespace1Translation, Namespace1Trans } = build(NAMSPACE1);

export { useNamespace1Translation, Namespace1Trans };

export type TranslationFn = ReturnType<
  typeof useNamespace1Translation
>["__namespace1T"];
