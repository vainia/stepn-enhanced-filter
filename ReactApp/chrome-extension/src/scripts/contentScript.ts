import { inChromeExtensionPopupContext } from "../services/chromeExtensionService"
import { listenToChromeMessages } from "../services/chromeMessagingService"
import { sendWindowMessage } from "../services/windowMessagingService"

const loadContentPrivilegedScript = () => {
  const scriptUrl = "static/js/contentPrivileged.js"
  window.onload = () => {
    const injectScript = (filePath: string, tag: string) => {
      const script = document.createElement("script")
      script.setAttribute("type", "text/javascript")
      script.setAttribute("src", filePath)
      document.getElementsByTagName(tag)[0].appendChild(script)
    }
    injectScript(chrome.runtime.getURL(scriptUrl), "body")
  }
}

if (!inChromeExtensionPopupContext()) {
  listenToChromeMessages((message) => {
    const { data, type } = message
    sendWindowMessage(data, type)
  })

  // listenToWindowMessages((type, data) => {
  //   if (type === "StopSearch") {
  //     const message = data as string
  //     console.log(message)
  //   }
  // })

  loadContentPrivilegedScript()
}
