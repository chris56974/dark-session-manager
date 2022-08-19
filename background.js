const extensionURL = "chrome - extension://hhmaoaobfenfigibpjglhdelfdfnjnip/pages/dsm.html"

function dsmInit() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs[0].url === extensionURL) return
  })

  chrome.tabs.create({
    url: 'pages/dsm.html',
    active: false,
    pinned: true,
    index: 0
  })

  let dsmTab = null;
  let currentTabs = null;

  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    dsmTab = tabs[0]
    currentTabs = tabs

    chrome.tabs.sendMessage(dsmTab.id, { tabsInit: currentTabs });
  })


  return dsmTab
}

function navigateTabs(position) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length === 1) return; // no tabs to jump to
    position > 0 ?
      chrome.tabs.update(tabs[1].id, { active: true }) :
      chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
  });
}

chrome.windows.onCreated.addListener(() => {
  dsmInit()
})

chrome.action.onClicked.addListener(() => {
  const dsmTab = dsmInit()
  chrome.tabs.update(dsmTab.id, { active: true })
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-dsm") {
    const dsmTab = dsmInit()
    chrome.tabs.update(dsmTab.id, { active: true })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.navigate === "J") navigateTabs(-1)
  if (request.navigate === "K") navigateTabs(+1)
});