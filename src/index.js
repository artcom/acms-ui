import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import { loadData } from "./actions/data"
import { updatePath } from "./actions/path"
import { updateUser } from "./actions/user"

import bootstrap from "./bootstrap"
import { configureStore } from "./store"

import Application from "./components/application"

import "bootstrap/dist/css/bootstrap.min.css"

bootstrap().then(async ({ acmsApi, acmsAssets, acmsConfigPath }) => {
  const store = configureStore()

  await store.dispatch(loadData(acmsApi, acmsConfigPath))

  store.dispatch(updateUser())

  window.addEventListener("hashchange", updatePathFromHash)
  updatePathFromHash()

  function updatePathFromHash() {
    store.dispatch(updatePath(window.location.hash))
  }

  render(
    <Provider store={ store } >
      <Application
        acmsApi={ acmsApi }
        acmsAssets={ acmsAssets }
        acmsConfigPath={ acmsConfigPath } />
    </Provider>
    , document.getElementById("app"))
})
