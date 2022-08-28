import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { EGemQuality, EGemType } from "../../services/stepnGemService"
import { RootState } from "../store"

interface ISocketFilter {
  index: number
  type: EGemType
  quality: EGemQuality
}

export interface ISocketFilterState {
  sockets: ISocketFilter[]
  followOrder: boolean
}

const initialState: ISocketFilterState = {
  sockets: [],
  followOrder: false,
}

export const socketFilterSlice = createSlice({
  name: "socketFilter",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ISocketFilter>) => {
      state.sockets.push(action.payload)
    },
    update: (state, action: PayloadAction<ISocketFilter>) => {
      state.sockets = state.sockets.map((socket) => {
        if (socket.index === action.payload.index) {
          return action.payload
        }
        return socket
      })
    },
    removeLast: (state) => {
      state.sockets.pop()
    },
    setFollowOrder: (state, action: PayloadAction<boolean>) => {
      state.followOrder = action.payload
    },
  },
})

export const selectSocketFilters = (state: RootState) => state.socketFilters

const socketFilterReducer = socketFilterSlice.reducer
export default socketFilterReducer
