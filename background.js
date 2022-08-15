// chrome.

// Events
chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup fired")
})

chrome.runtime.onConnect.addListener(() => {
  console.log("onConnect fired")
})

chrome.runtime.onSuspend.addListener(() => {
  console.log("onSuspend fired")
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage fired")
  console.log(message)
  console.log(sender)
  console.log(sendResponse)
})

chrome.windows.onCreated.addListener(() => {
  console.log("window created")
  chrome.tabs.create({
    url: 'pages/index.html',
    active: false,
    pinned: true,
  })
})
