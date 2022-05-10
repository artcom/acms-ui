import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import { loadData } from "./actions/data"
import { updatePath, configPath } from "./actions/path"

import { updateUser } from "./actions/user"

import bootstrap from "./bootstrap"
import store from "./store"

import Application from "./components/application"

import "bootstrap/dist/css/bootstrap.min.css"

export const ApiContext = React.createContext()

bootstrap().then(async ({ acmsApi, acmsAssets, acmsConfigPath }) => {
  await store.dispatch(loadData(acmsApi, acmsConfigPath))
  await store.dispatch(configPath(acmsConfigPath))

  store.dispatch(updateUser())

  window.addEventListener("hashchange", updatePathFromHash)
  updatePathFromHash()

  function updatePathFromHash() {
    store.dispatch(updatePath(window.location.hash))
  }

  const container = document.getElementById("app")
  const root = createRoot(container)

  root.render(
    <Provider store={ store } >
      <ApiContext.Provider
        value={ { acmsApi, acmsAssets } }>
        <Application />
      </ApiContext.Provider>
    </Provider>)
})
