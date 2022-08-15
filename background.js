let dsm_tab;

chrome.windows.onCreated.addListener(() => {
  dsm_tab = chrome.tabs.create({
    url: 'pages/index.html',
    active: false,
    pinned: true,
  })
  console.log(dsm_tab)
})

chrome.contextMenus.onClicked.addListener(() => {
  console.log("Test")
})

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-dsm") {
    console.log("open-dsm fired")
  }
})