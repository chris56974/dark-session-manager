const extensionURL = "chrome-extension://hhmaoaobfenfigibpjglhdelfdfnjnip/pages/dsm.html"

chrome.windows.onCreated.addListener(async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  if (tabs[0].url === extensionURL) return
  chrome.tabs.create({
    url: 'pages/dsm.html',
    active: false,
    pinned: true,
    index: 0,
  })
})

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  if (tabs[0].url === extensionURL) return chrome.tabs.update(tabs[0].id, { active: true })
  chrome.tabs.create({
    url: 'pages/dsm.html',
    active: false,
    pinned: true,
    index: 0,
  })
});

// chrome.tabs.onRemoved.addListener(async () => {
//   const tabs = await chrome.tabs.query({ currentWindow: true })
//   if (tabs.length === 1 ) chrome.tabs.remove(tabs[0].id)
// })