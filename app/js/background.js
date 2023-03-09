/** 
 * EVENT LISTENERS
 */
chrome.windows.onCreated.addListener(() => { dsmInit() })

chrome.tabs.onAttached.addListener(moveDsmToEnd)
chrome.tabs.onCreated.addListener(moveDsmToEnd)
chrome.tabs.onMoved.addListener(moveDsmToEnd)
chrome.tabs.onRemoved.addListener(onRemovedHandler)

chrome.commands.onCommand.addListener(runCommand)

chrome.action.onClicked.addListener(actionHandler)

let extensionEnabled = false

/** 
 * EVENT HANDLERS
 */
const chromeExtensionUrl = chrome.runtime.getURL('app/dsm.html')

async function dsmInit(active = false) {
  if (!extensionEnabled) return
  // if DSM is already open do nothing
  const tabs = await chrome.tabs.query({ currentWindow: true })
  if (tabs[tabs.length - 1].title === "dsm") return

  // open DSM
  const { id, windowId } = await chrome.tabs.create({ url: 'app/dsm.html', active })
  await chrome.storage.session.set({ [windowId]: id })
}

async function moveDsmToEnd() {
  if (!extensionEnabled) return

  const { id: windowId } = await chrome.windows.getCurrent()
  const result = await chrome.storage.session.get(windowId.toString())
  if (!result[windowId]) return
  await chrome.tabs.move(result[windowId], { index: -1 })
}

async function onRemovedHandler(tabId, removeInfo) {
  if (!extensionEnabled) return

  // the window that had its tab removed
  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved
  const { windowId } = removeInfo

  const [allTabs, [activeTab], result] = await Promise.all([
    chrome.tabs.query({ currentWindow: true }),
    chrome.tabs.query({ active: true, currentWindow: true }),
    chrome.storage.session.get(windowId.toString())
  ])

  const dsmTabId = result[windowId.toString()]

  // if DSM was closed open it back up again
  if (tabId === dsmTabId) {
    return dsmInit()
  }

  // If DSM is the only tab left
  if (allTabs.length === 1) {
    if (!allTabs[0]) return
    await chrome.tabs.remove(allTabs[0].id)
  }

  // If DSM is not the only tab left, and if user is currently on DSM after deleting some tab 
  // focus the tab to the left of DSM
  const dsmTab = allTabs[allTabs.length - 1]
  if (dsmTab && activeTab.id === dsmTab.id) {
    const dsmPreTab = allTabs[allTabs.length - 2]
    if (dsmPreTab) await chrome.tabs.update(dsmPreTab.id, { active: true })
  }
}

async function runCommand(command) {
  if (command === "open-dsm") {
    if (extensionEnabled) navigateToDSM()
  }
}

async function navigateToDSM() {
  if (!extensionEnabled) return
  // This just navigates to the final tab
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const finalTab = tabs[tabs.length - 1]

  chrome.tabs.update(finalTab.id, { active: true })
}

async function actionHandler() {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const finalTab = tabs[tabs.length - 1]

  if (finalTab.title === "dsm") {
    extensionEnabled = false
    chrome.tabs.remove(finalTab.id)
  } else {
    extensionEnabled = true
    dsmInit(true)
  }

  chrome.tabs.update(finalTab.id, { active: true })
}