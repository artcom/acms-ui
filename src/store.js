import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import * as reducer from "./reducers"

const loggerMiddleware = createLogger()

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
})

export default store
