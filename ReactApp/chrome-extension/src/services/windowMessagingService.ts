export type TMessageFrom = "HostSiteScript"
export type TMessageType = "StartSearch" | "StopSearch"

export const listenToWindowMessages = (
  callback: (type: TMessageType, message: any) => void
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
      if (eventData.from !== "HostSiteScript") return
      callback(eventData.type, eventData.message)
    }
  )
}

export const sendWindowMessage = <M>(
  data: M,
  type: TMessageType,
  from: TMessageFrom = "HostSiteScript"
) => {
  window.postMessage({
    from,
    type,
    message: data,
  })
}
