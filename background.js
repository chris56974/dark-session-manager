chrome.windows.onCreated.addListener(() => {
  chrome.tabs.create({
    url: 'pages/index.html',
    active: false,
    pinned: true,
  })
})
