import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { defaultRequestParams } from "../../services/stepnInterceptorService"
import { RootState } from "../store"

export interface ISettingsState {
  includedRequestParams: string[]
  requestTimeoutSeconds: number
  limitResultsCount: number
  sortDropdownBtnSelector: string
  availableSortOptionBtnSelector: string
}

const initialState: ISettingsState = {
  includedRequestParams: defaultRequestParams,
  requestTimeoutSeconds: 0.5,
  limitResultsCount: 1,
  sortDropdownBtnSelector:
    "#__next > main > div:last-child > div:last-child [id^='headlessui-listbox-button']",
  availableSortOptionBtnSelector:
    "li[id^=headlessui-listbox-option]:not([aria-selected])",
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<ISettingsState>) =>
      (state = action.payload),
    restore: (state) => (state = initialState),
  },
})

export const selectSettings = (state: RootState) => state.settings

const settingsReducer = settingsSlice.reducer
export default settingsReducer
