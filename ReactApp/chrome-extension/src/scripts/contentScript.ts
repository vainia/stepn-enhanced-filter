import { inChromeExtensionPopupContext } from "../services/chromeExtensionService"

const messagesFromReactAppListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  response: (response?: any) => void
) => {
  console.log(message)

  if (message.from === "Enhanced Filter") {
    window.postMessage({
      from: "content.js",
      signal: "actionCall",
      data: message.data,
    })
    response("Done")
  }
}

const messagesFromPrivilegedScript = async (event: {
  data: {
    from: string
    type: string
  }
}) => {
  if (
    event.data.from === "contentPrivileged.js" &&
    event.data.type === "resultFound"
  ) {
    // TODO: Post to popup maybe
  }
}

const loadContentPrivilegedScript = () => {
  window.onload = () => {
    const injectScript = (filePath: string, tag: string) => {
      const script = document.createElement("script")
      script.setAttribute("type", "text/javascript")
      script.setAttribute("src", filePath)
      document.getElementsByTagName(tag)[0].appendChild(script)
    }
    injectScript(
      chrome.runtime.getURL("static/js/contentPrivileged.js"),
      "body"
    )
  }
}

if (!inChromeExtensionPopupContext()) {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
  window.addEventListener("message", messagesFromPrivilegedScript)
  loadContentPrivilegedScript()
}
