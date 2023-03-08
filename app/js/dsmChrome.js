import { refreshSessionsListInTheDom } from "./dsmDom.js"

export async function replaceChromeTabsWithSessionTabs(sessionName) {
  // grab the current tabs so I can delete them later
  const tabsWithDsm = await chrome.tabs.query({ currentWindow: true })
  const tabIds = tabsWithDsm
    .slice(0, -1)
    .reduce((prev, cur) => {
      prev.push(cur.id)
      return prev
    }, [])

  // create the new tabs
  addSessionTabsToCurrentTabs(sessionName)

  // remove the previous tabs
  await chrome.tabs.remove(tabIds)
}

export async function addSessionTabsToCurrentTabs(sessionName) {
  // create the new tabs
  const { sessions } = await chrome.storage.local.get('sessions')
  const { tabs } = sessions[sessionName]

  for (const tab of tabs) {
    await chrome.tabs.create({ url: tab.url, active: false })
  }
}

export async function createNewSessionInChromeStorage(newSessionName, newSessionColor) {
  // grab current tabs and stored sessions
  let [tabs, { sessions: existingSessions }] = await Promise.all([
    chrome.tabs.query({ currentWindow: true }),
    chrome.storage.local.get('sessions')
  ])

  // validation
  if (tabs.length === 0) return alert("Nothing to save")
  if (existingSessions && newSessionName in existingSessions) {
    return alert(`The session ${newSessionName} already exists`)
  }

  // Only grab the titles/urls from all the tabs (except DSM)
  tabs = tabs
    .splice(0, tabs.length - 1) // skip DSM
    .reduce((prev, tab) => {
      prev.push({ title: tab.title, url: tab.url })
      return prev;
    }, []);

  await chrome.storage.local.set({
    sessions: {
      ...existingSessions,
      [newSessionName]: {
        tabs,
        color: newSessionColor
      }
    }
  })
}

export async function deleteSessionFromChromeStorage(sessionName) {
  const { sessions } = await chrome.storage.local.get("sessions")
  const newSessions = { ...sessions }
  delete newSessions[sessionName]
  await chrome.storage.local.set({ sessions: newSessions })
  refreshSessionsListInTheDom()
}
