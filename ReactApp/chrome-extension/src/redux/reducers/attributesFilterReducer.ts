import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TAttribute } from "../../services/stepnAttributesService"
import { RootState } from "../store"

export type TAttributeFilterState = {
  [key in TAttribute]: {
    usedBy?: number
    minBase?: number
    minAssigned?: number
  }
}

const initialState: TAttributeFilterState = {
  comfort: {},
  efficiency: {},
  luck: {},
  resilience: {},
}

const removeByFilterId = (state: TAttributeFilterState, usedBy: number) => {
  for (const key in state) {
    if (state[key as TAttribute].usedBy === usedBy) {
      const oldData = state[key as TAttribute]
      state[key as TAttribute] = {}
      return oldData
    }
  }
}

export const attributeFilterSlice = createSlice({
  name: "attributeFilters",
  initialState,
  reducers: {
    replaceUsedTypeByFilterId: (
      state,
      action: PayloadAction<{ usedBy: number; newType: TAttribute }>
    ) => {
      const { usedBy, newType } = action.payload
      const data = removeByFilterId(state, usedBy) || { usedBy }
      state[newType] = data
    },
    setTypeValues: (
      state,
      action: PayloadAction<{
        type: TAttribute
        minBase: number
        minAssigned: number
      }>
    ) => {
      const { type, minBase, minAssigned } = action.payload
      state[type] = { ...state[type], minBase, minAssigned }
    },
    removeUsedByFilterId: (
      state,
      action: PayloadAction<{ usedBy: number }>
    ) => {
      removeByFilterId(state, action.payload.usedBy)
    },
  },
})

export const selectAttributeFilters = (state: RootState) =>
  state.attributeFilters

export const selectAvailableAttributeTypes = (state: RootState) =>
  Object.keys(state.attributeFilters)
    .map((key) => {
      if (
        typeof state.attributeFilters[key as TAttribute].usedBy === "undefined"
      ) {
        return key as TAttribute
      }
      return null
    })
    .filter((key) => key) as TAttribute[]

interface IActiveAttributeFilter {
  usedBy: number
  type: TAttribute
  minBase?: number
  minAssigned?: number
}
export const selectAttributeFiltersActive = (state: RootState) =>
  Object.keys(state.attributeFilters)
    .map((key) => {
      const filter = state.attributeFilters[key as TAttribute]
      if (typeof filter.usedBy !== "undefined") {
        return {
          usedBy: filter.usedBy,
          minBase: filter.minBase,
          minAssigned: filter.minAssigned,
          type: key as TAttribute,
        }
      }
      return null
    })
    .filter((v) => v)
    .sort((one, two) =>
      one!.usedBy > two!.usedBy ? -1 : 1
    ) as IActiveAttributeFilter[]

const attributeFilterReducer = attributeFilterSlice.reducer
export default attributeFilterReducer
