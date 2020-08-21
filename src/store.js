import { createLogger } from "redux-logger"
import { applyMiddleware, combineReducers, createStore } from "redux"
import thunkMiddleware from "redux-thunk"

import * as reducers from "./reducers"

const loggerMiddleware = createLogger()

export function configureStore() {
  return createStore(
    combineReducers(reducers),
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  )
}
