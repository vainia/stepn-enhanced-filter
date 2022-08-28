import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import attributeFilterReducer, {
  TAttributeFilterState,
} from "./reducers/attributesFilterReducer"
import socketFilterReducer, {
  ISocketFilterState,
} from "./reducers/socketFilterReducer"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import settingsReducer, { ISettingsState } from "./reducers/settingsReducer"

const rootReducer = combineReducers({
  socketFilters: socketFilterReducer,
  attributeFilters: attributeFilterReducer,
  settings: settingsReducer,
})

export type TStoreState = {
  attributeFilters: TAttributeFilterState
  socketFilters: ISocketFilterState
  settings: ISettingsState
}

export const persistentStorageKey = "enhancedFilter"
const persistConfig = {
  key: persistentStorageKey,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
