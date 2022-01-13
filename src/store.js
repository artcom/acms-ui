import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import * as reducers from "./reducers"

const loggerMiddleware = createLogger()

console.log("reducers", reducers)

const store = configureStore({
  reducer: {
    ...reducers,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(loggerMiddleware)
})

export default store
