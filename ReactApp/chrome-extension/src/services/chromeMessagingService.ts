import { TStoreState } from "../redux/store"

export type TTabMessage<T> = {
  type: "StartSearch" | "StopSearch"
  data: T
  from: "EnhancedFilterPopup"
}

export const sendMessageToCurrentTab = <T, U>(
  message: TTabMessage<T>,
  callback?: (response: U) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id
    if (!activeTab) return
    chrome.tabs.sendMessage(activeTab, message, callback)
  })
}

export const listenToChromeMessages = <
  M = TStoreState,
  C = undefined,
  R = undefined
>(
  callback: (message: TTabMessage<M>) => C,
  getResponse?: (message: TTabMessage<M>, callbackResult: C) => R
) => {
  chrome.runtime.onMessage.addListener(
    (
      message: TTabMessage<M>,
      sender: chrome.runtime.MessageSender,
      response: (response?: any) => void
    ) => {
      if (!message.from || message.from !== "EnhancedFilterPopup") return

      const callbackResult = callback(message)

      if (getResponse) {
        const responseData = getResponse(message, callbackResult)
        response(responseData)
      }
    }
  )
}
