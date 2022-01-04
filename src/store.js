import { createLogger } from "redux-logger"
import { applyMiddleware, combineReducers, createStore, compose } from "redux"
import thunkMiddleware from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"


import * as reducers from "./reducers"

const loggerMiddleware = createLogger()

export function configureStore() {
  return createStore(
    combineReducers(reducers),
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, loggerMiddleware))
  )
}
