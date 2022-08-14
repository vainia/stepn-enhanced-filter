import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import attributeFilterReducer from "./reducers/attributesFilterReducer"
import socketFilterReducer from "./reducers/socketFilterReducer"

const store = configureStore({
  reducer: {
    socketFilters: socketFilterReducer,
    attributeFilters: attributeFilterReducer,
  },
})

type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
