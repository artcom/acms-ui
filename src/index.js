import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import { loadData } from "./actions/data"
import { updatePath, configPath } from "./actions/path"

import { updateUser } from "./actions/user"

import bootstrap from "./bootstrap"
import store from "./store"

import Application from "./components/application"

import "bootstrap/dist/css/bootstrap.min.css"
import { listAllFiles } from "./actions/listAllFiles"

export const ApiContext = React.createContext()

bootstrap().then(async ({ acmsApi, acmsAssets, acmsConfigPath }) => {
  console.log(acmsApi, acmsAssets, acmsConfigPath)
  await store.dispatch(loadData(acmsApi, acmsConfigPath))
  await store.dispatch(configPath(acmsConfigPath))
  await store.dispatch(listAllFiles(acmsAssets))

  store.dispatch(updateUser())

  window.addEventListener("hashchange", updatePathFromHash)
  updatePathFromHash()

  function updatePathFromHash() {
    store.dispatch(updatePath(window.location.hash))
  }

  render(
    <Provider store={ store } >
      <ApiContext.Provider
        value={ { acmsApi, acmsAssets } }>
        <Application />
      </ApiContext.Provider>
    </Provider>
    , document.getElementById("app"))
})
