export const isPageTarget = url => url && url.includes("m.stepn.com")

export const getActiveTabUrl = async () => {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    })
    return tabs[0]
}
