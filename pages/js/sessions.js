import { refreshDsmTabs, createSidebarTabEl, createWorkspaceTabEl } from "./tabs.js"
import { tabGroupsDisabled } from "./footer.js"

const sessionList = document.getElementById("sidebar-sessions__list")
const saveSessionBtn = document.getElementById("sidebar-sessions__new-session-btn")
const saveSessionInput = document.getElementById("sidebar-sessions__new-session-input")
const sidebarTabList = document.getElementById("sidebar-tabs__list");
const workspaceTabList = document.getElementById("workspace-tabs__list")

saveSessionBtn.addEventListener('click', saveSession)

async function saveSession() {
  const tabsWithDSM = await chrome.tabs.query({ currentWindow: true })
  const sessions = await chrome.storage.sync.get(null)

  // @ts-ignore
  const sessionName = saveSessionInput.value.toString()

  const validationFailed = validateSession(tabsWithDSM, sessionName, sessions)
  if (validationFailed) return

  // @ts-ignore
  saveSessionInput.value = ""

  const tabs = tabsWithDSM.slice(1)
  const tabIds = tabs.map((tab) => tab.id)

  if (!tabGroupsDisabled) {
    var groupId = await chrome.tabs.group({ tabIds })
    await chrome.tabGroups.update(groupId, {
      color: "grey", // make this dynamic later
      title: sessionName
    })
  }

  const tabUrls = tabs.map((tab) => tab.url)
  const tabTitles = tabs.map((tab) => tab.title)

  chrome.storage.sync.set({
    [sessionName]: {
      tabUrls,
      tabIds,
      tabTitles,
      resources: {},
    }
  })

  fetchSessions()
}

function validateSession(tabs, sessionName, sessions) {
  if (tabs.length === 0) return window.alert("Nothing to save")
  if (sessionName.length === 0) return window.alert("No name provided")
  // @ts-ignore
  if (sessionName in sessions) return window.alert("Session already exists")

  return false
}

export async function fetchSessions() {
  const sessions = await chrome.storage.sync.get(null)

  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);

  // @ts-ignore
  for (const sessionName of Object.keys(sessions)) {
    const sessionEl = createSessionEl(sessionName)
    sessionList.appendChild(sessionEl)
  }
}

function createSessionEl(sessionName) {
  const sessionEl = document.createElement("li")
  sessionEl.id = sessionName
  sessionEl.className = "sidebar-sessions__list-item"

  // Close out all other tabs and only open this session's tabs
  const openSessionBtn = document.createElement("button")
  openSessionBtn.innerText = `${sessionName}`
  openSessionBtn.addEventListener('click', replaceTabsWithSession)

  // Add this session on top of all other tabs
  const sessionLinkBtn = document.createElement("button")
  sessionLinkBtn.innerText = '🔗'
  sessionLinkBtn.addEventListener('click', toggleSessionTabs(sessionName))

  sessionEl.appendChild(openSessionBtn)
  sessionEl.appendChild(sessionLinkBtn)
  return sessionEl
}

function replaceTabsWithSession(sessionName) {

}

function toggleSessionTabs(sessionName) {
  return async (_) => {
    const tabGroups = await chrome.tabGroups.query({ title: sessionName })
    tabGroups[0] ? closeSession(sessionName) : openSession(sessionName)
  }
}

async function closeSession(sessionName) {
  const result = await chrome.storage.sync.get(sessionName)
  await chrome.tabs.remove(result[sessionName].tabIds)
  refreshDsmTabs()
}

async function openSession(sessionName) {
  const result = await chrome.storage.sync.get(sessionName)
  const session = result[sessionName]
  const tabs = []

  for (const url of session.tabUrls) {
    const tab = await chrome.tabs.create({ url, active: false })
    tabs.push(tab)
  }

  const tabIds = tabs.map((tab) => tab.id)

  session.tabIds = tabIds

  const groupId = await chrome.tabs.group({ tabIds })
  await chrome.tabGroups.update(groupId, { title: sessionName })
  await chrome.storage.sync.set({ [sessionName]: session })
  addSessionTabs(tabs, session.tabTitles)
}

export async function addSessionTabs(tabs, tabTitles) {
  tabs.forEach((tab, i) => {
    const sidebarTabEl = createSidebarTabEl(tab, tabTitles[i])
    const workspaceTabEl = createWorkspaceTabEl(tab, tabTitles[i])
    sidebarTabList.appendChild(sidebarTabEl)
    workspaceTabList.appendChild(workspaceTabEl)
  })
}