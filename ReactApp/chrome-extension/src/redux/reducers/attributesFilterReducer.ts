import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TAttribute } from "../../services/stepnAttributesService"
import { RootState } from "../store"

export type TAttributeFilterState = {
  attrs: {
    [key in TAttribute]: {
      usedBy?: number
      minBase?: number
      minAssigned?: number
    }
  }
  onlyBaseAttributes: boolean
}

const initialState: TAttributeFilterState = {
  attrs: {
    comfort: {},
    efficiency: {},
    luck: {},
    resilience: {},
  },
  onlyBaseAttributes: false,
}

const removeByFilterId = (state: TAttributeFilterState, usedBy: number) => {
  for (const key in state.attrs) {
    if (state.attrs[key as TAttribute].usedBy === usedBy) {
      const oldData = state.attrs[key as TAttribute]
      state.attrs[key as TAttribute] = {}
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
      state.attrs[newType] = data
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
      state.attrs[type] = { ...state.attrs[type], minBase, minAssigned }
    },
    removeUsedByFilterId: (
      state,
      action: PayloadAction<{ usedBy: number }>
    ) => {
      removeByFilterId(state, action.payload.usedBy)
    },
    updateOnlyBaseAttributes: (state, action: PayloadAction<boolean>) => {
      state.onlyBaseAttributes = action.payload
    },
  },
})

export const selectAttributeFilters = (state: RootState) =>
  state.attributeFilters

export const selectAvailableAttributeTypes = (state: RootState) =>
  Object.keys(state.attributeFilters.attrs)
    .map((key) => {
      if (
        typeof state.attributeFilters.attrs[key as TAttribute].usedBy ===
        "undefined"
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
  Object.keys(state.attributeFilters.attrs)
    .map((key) => {
      const filter = state.attributeFilters.attrs[key as TAttribute]
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
