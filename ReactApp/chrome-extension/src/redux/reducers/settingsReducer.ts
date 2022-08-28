import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { defaultRequestParams } from "../../services/stepnApiService"
import { RootState } from "../store"

export interface ISettingsState {
  includedRequestParams: string[]
  requestTimeoutSeconds: number
  limitResultsCount: number
}

const initialState: ISettingsState = {
  includedRequestParams: defaultRequestParams,
  requestTimeoutSeconds: 0.5,
  limitResultsCount: 1,
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<ISettingsState>) => {
      const {
        includedRequestParams,
        requestTimeoutSeconds,
        limitResultsCount,
      } = action.payload
      state.includedRequestParams =
        includedRequestParams ?? state.includedRequestParams
      state.requestTimeoutSeconds =
        requestTimeoutSeconds ?? state.requestTimeoutSeconds
      state.limitResultsCount = limitResultsCount ?? state.limitResultsCount
    },
    restore: (state) => (state = initialState),
  },
})

export const selectSettings = (state: RootState) => state.settings

const settingsReducer = settingsSlice.reducer
export default settingsReducer
