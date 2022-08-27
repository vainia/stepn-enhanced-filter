import { TMessageFrom, TMessageType } from "../types/messageTypes"

export const listenToWindowMessages = (
  callback: (type: TMessageType, message: any, from: TMessageFrom) => void
) => {
  window.addEventListener(
    "message",
    async (event: {
      data: {
        from: TMessageFrom
        type: TMessageType
        message: any
      }
    }) => {
      const eventData = event.data
      callback(eventData.type, eventData.message, eventData.from)
    }
  )
}

export const sendWindowMessage = <M>(
  data: M,
  type: TMessageType,
  from: TMessageFrom
) => {
  window.postMessage({
    from,
    type,
    message: data,
  })
}
