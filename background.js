/** 
 * EVENT LISTENERS
 */
chrome.windows.onCreated.addListener(dsmInit)

chrome.tabs.onAttached.addListener(moveDsmToEnd)
chrome.tabs.onCreated.addListener(moveDsmToEnd)
chrome.tabs.onMoved.addListener(moveDsmToEnd)
chrome.tabs.onRemoved.addListener(closeDsmIfEmpty)

chrome.commands.onCommand.addListener(navigateToDsm)

/** 
 * EVENT HANDLERS
 */
const chromeExtensionUrl = chrome.runtime.getURL('app/dsm.html')

async function dsmInit() {
  const { id, windowId } = await chrome.tabs.create({ url: 'app/dsm.html', active: false })
  await chrome.storage.session.set({ [windowId]: id })
}

async function moveDsmToEnd() {
  const { id: windowId } = await chrome.windows.getCurrent()
  const result = await chrome.storage.session.get(`${windowId}`)
  await chrome.tabs.move(result[windowId], { index: -1 })
}

async function navigateToDsm(command) {
  if (command === "open-dsm") {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    await chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
  }
}

async function closeDsmIfEmpty() {
  const [allTabs, [activeTab]] = await Promise.all([
    chrome.tabs.query({ currentWindow: true }),
    chrome.tabs.query({ active: true, currentWindow: true })
  ])

  if (allTabs.length === 1) chrome.tabs.remove(allTabs[0].id)

  if (activeTab.id === allTabs[allTabs.length - 1].id) {
    await chrome.tabs.update(allTabs[allTabs.length - 2].id, { active: true })
  }
}