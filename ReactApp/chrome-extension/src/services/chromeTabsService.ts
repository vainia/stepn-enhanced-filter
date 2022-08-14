export const sendMessageToCurrentTab = <T, U>(message: T, callback?: (response: U) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs[0].id
        if (!activeTab) return
        chrome.tabs.sendMessage(activeTab, message, callback)
    });
}