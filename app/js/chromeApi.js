import {
  refreshSessionsListInTheDom,
} from "./dsm.js"

/** 
 * These functions don't have anything to do with the DOM 
 * They're only meant for manipulating chrome storage, tabs, etc.
 */

export async function createChromeTabs(tabUrls, sessionName, color) {
  const newTabIds = []

  for (const tabUrl of tabUrls) {
    const newTab = await chrome.tabs.create({ url: tabUrl, active: false })
    newTabIds.push(newTab.id)
  }

  await createTabGroup(newTabIds, sessionName, color)
}

export async function removeAllChromeTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true })

  const tabIds = tabs
    .splice(0, tabs.length - 1) // keep dsm
    .map((tab) => tab.id);

  // dsm closes automatically if it's the only tab so I create a new one to stop that
  chrome.tabs.create({ active: true });
  await chrome.tabs.remove(tabIds)
}

export async function replaceChromeTabsWithSessionTabs(sessionName) {
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) return await removeTabGroup(tabGroups[0].id)

  await removeAllChromeTabs()

  const result = await chrome.storage.sync.get(sessionName)
  const { tabUrls, color } = result[sessionName]

  await createChromeTabs(tabUrls, sessionName, color)
}

export async function addSessionTabsToCurrentTabs(sessionName) {
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) return await removeTabGroup(tabGroups[0].id)

  const result = await chrome.storage.sync.get(sessionName)
  const { tabUrls, color } = result[sessionName]

  createChromeTabs(tabUrls, sessionName, color)
}

export async function createNewSessionInChromeStorage(newSessionName, newSessionColor) {
  const [tabs, existingSessions] = await Promise.all([
    chrome.tabs.query({ currentWindow: true }),
    chrome.storage.sync.get('sessions')
  ])

  if (tabs.length === 0) return alert("Nothing to save")
  if (newSessionName in existingSessions) return alert("Session already exists")

  const { tabIds, tabUrls, tabTitles } = tabs
    .splice(0, 1)
    .reduce((acc, tab) => {
      acc.tabIds.push(tab.id);
      acc.tabUrls.push(tab.url);
      acc.tabTitles.push(tab.title);
      return acc;
    }, { tabIds: [], tabUrls: [], tabTitles: [] });

  createTabGroup(tabIds, newSessionName, newSessionColor)

  await chrome.storage.sync.set({
    sessions: {
      ...existingSessions,
      [newSessionName]: {
        tabUrls,
        tabTitles,
        newSessionColor
      }
    }
  })
}

export async function deleteSessionFromChromeStorage(sessionName) {
  if (!window.confirm("Are you sure?")) return
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) await removeTabGroup(tabGroups[0].id)
  // const result = await chrome.storage.sync.get(sessionName)
  // const session = result[sessionName]

  await chrome.storage.sync.remove(sessionName)
  refreshSessionsListInTheDom()
}

export async function createTabGroup(tabIds, sessionName, color) {
  const groupId = await chrome.tabs.group({ tabIds })
  await chrome.tabGroups.update(groupId, { color, title: sessionName })
}

export async function removeTabGroup(tabGroupId) {
  const tabs = await chrome.tabs.query({ groupId: tabGroupId })
  const tabIds = tabs.map(tab => tab.id)
  await chrome.tabs.remove(tabIds)
}

