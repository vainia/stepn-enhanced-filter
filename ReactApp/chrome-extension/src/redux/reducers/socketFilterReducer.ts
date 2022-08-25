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
}

const initialState: ISocketFilterState = {
  sockets: [],
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
  },
})

export const selectSocketFilters = (state: RootState) =>
  state.socketFilters.sockets

const socketFilterReducer = socketFilterSlice.reducer
export default socketFilterReducer
