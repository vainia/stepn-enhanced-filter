import { CssVarsProvider } from "@mui/joy"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import "./index.scss"
import MainPopupSectionComp from "./sections/MainPopupSectionComp"
import store from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <CssVarsProvider />
        <MainPopupSectionComp />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
