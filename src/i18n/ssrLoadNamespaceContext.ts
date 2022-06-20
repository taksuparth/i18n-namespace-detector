import { createContext, useContext, useRef } from "react";
import { Namespaces } from "./types";

// Only Used when rendering on the server side while mounting the app tree to prefetch all the namespaces encountered
export const LoadNamespaceContext = createContext<
  undefined | ((ns: Namespaces) => void)
>(undefined);

export const useLoadNamespaceContext = (ns: Namespaces): void => {
  const loadNamespace = useContext(LoadNamespaceContext);

  const shouldLoadNamespaceRef = useRef(true);
  // Load the namespace only initially
  // Do not use useEffect - invoked only on the server side
  if (shouldLoadNamespaceRef.current && loadNamespace) {
    shouldLoadNamespaceRef.current = false;
    loadNamespace(ns);
  }
};
