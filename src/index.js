import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import { loadData } from "./actions/data"
import { updatePath } from "./actions/path"
import { updateUser } from "./actions/user"

import bootstrap from "./bootstrap"
import { configureStore } from "./store"

import Application from "./components/application"
import { showError } from "./actions/error"

import "bootstrap/dist/css/bootstrap.min.css"

bootstrap().then(async ({ assetServer, cmsConfigPath, configServer }) => {
  const store = configureStore()

  try {
    await store.dispatch(loadData(configServer, cmsConfigPath))
  } catch (error) {
    store.dispatch(showError("Failed to load Data", error))
  }

  store.dispatch(updateUser())

  window.addEventListener("hashchange", updatePathFromHash)
  updatePathFromHash()

  function updatePathFromHash() {
    store.dispatch(updatePath(window.location.hash))
  }

  render(
    <Provider store={ store } >
      <Application
        configServer={ configServer }
        configPath={ cmsConfigPath }
        assetServer={ assetServer } />
    </Provider>
    , document.getElementById("app"))
})
