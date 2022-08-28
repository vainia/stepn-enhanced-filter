// Webpack bundles this service into popup's headers. Avoid script execution when ran from the popup
export const inChromeExtensionPopupContext = () =>
  window.location.origin.indexOf("chrome-extension") > -1
