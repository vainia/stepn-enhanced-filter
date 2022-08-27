import { TMessageFrom, TMessageType } from "../types/messageTypes"

export type TTabMessage<T> = {
  type: TMessageType
  data: T
  from: TMessageFrom
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

export const sendRuntimeMessage = <T, U>(
  message: TTabMessage<T>,
  callback?: (response: U) => void
) => {
  if (callback) chrome.runtime.sendMessage(message, callback)
  else chrome.runtime.sendMessage(message)
}

export const listenToChromeMessages = <M = string, R = void>(
  callback: (message: TTabMessage<M>) => R
) => {
  chrome.runtime.onMessage.addListener(
    (
      message: TTabMessage<M>,
      sender: chrome.runtime.MessageSender,
      response: (response?: any) => void
    ) => {
      const callbackResult = callback(message)

      if (callbackResult) {
        response(callbackResult)
      }
    }
  )
}
