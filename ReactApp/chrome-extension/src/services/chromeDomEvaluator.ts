const messagesFromReactAppListener = (message: any, sender: chrome.runtime.MessageSender, response: (response?: any) => void) => {
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (
        sender.id === chrome.runtime.id &&
        message.from === "React" &&
        message.message === 'Hello from React') {
        response('Hello from content.js');
    }

    if (
        sender.id === chrome.runtime.id &&
        message.from === "React" &&
        message.message === "delete logo") {
            alert("delete logo")
    }
}

// Fired when a message is sent from either an extension process or a content script
chrome.runtime.onMessage.addListener(messagesFromReactAppListener)

export default {}