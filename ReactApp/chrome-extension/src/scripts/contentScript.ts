import { TStoreState } from "../redux/store"
import { inChromeExtensionPopupContext } from "../services/chromeExtensionService"
import {
  listenToChromeMessages,
  sendRuntimeMessage,
} from "../services/chromeMessagingService"
import {
  listenToWindowMessages,
  sendWindowMessage,
} from "../services/windowMessagingService"

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
  listenToChromeMessages<TStoreState>((message) => {
    const { data, type, from } = message
    if (from !== "ReactApp") return

    sendWindowMessage(data, type, "ContentScript")
  })

  listenToWindowMessages((type, data, from) => {
    if (from !== "HostSiteScript") return

    if (type === "CheckSession") {
      sendRuntimeMessage({
        data,
        from: "ContentScript",
        type: "CheckSession",
      })
    }
  })

  loadContentPrivilegedScript()
}
