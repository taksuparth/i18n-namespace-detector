import "./App.css";
import { Suspense, useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import i18next from "i18next";
import Backend from "i18next-xhr-backend";
import { i18nextDefaultConfig } from "./i18n/config.default";
import {
  Namespace1Trans,
  useNamespace1Translation,
} from "./i18n/namespace/namespace1";

//@ts-ignore
i18next.use(initReactI18next).use(Backend).init(i18nextDefaultConfig);

function App() {
  const { t } = useTranslation();
  const { __namespace1T } = useNamespace1Translation();
  const [count, setCount] = useState(0);

  const onChange = (event: { target: { value: string | undefined } }) => {
    i18next.changeLanguage(event.target.value);
    setCount(prevCount => prevCount + 1);
  };

  return (
    <Suspense fallback="Loading....">
      <div className="App">
        <header className="App-header">
          <h1>{t("welcome")}</h1>
          <Namespace1Trans>
            <p>
              Sample{" "}
              <strong>
                <i>Text</i>
              </strong>
              .
            </p>
          </Namespace1Trans>
          <p>
            {__namespace1T("You have changed the language {{count}} times", {
              count,
            })}
          </p>
          <select name="language" onChange={onChange}>
            <option value="en">English</option>
            <option value="hn">Hindi</option>
          </select>
        </header>
      </div>
    </Suspense>
  );
}

export default App;
