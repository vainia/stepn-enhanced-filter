import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import attributeFilterReducer from "./reducers/attributesFilterReducer"
import socketFilterReducer from "./reducers/socketFilterReducer"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
  socketFilters: socketFilterReducer,
  attributeFilters: attributeFilterReducer,
})

const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
})

type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
