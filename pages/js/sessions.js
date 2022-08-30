import { refreshDsmTabs } from "./tabs.js"

const colorBtn = document.getElementById("new-session__color-btn")
const newSessionBtn = document.getElementById("new-session__submit-btn")
const sessionNameInput = document.getElementById("new-session__name-input")
const sessionFolderInput = document.getElementById("new-session__folder-input")
// const folderDataList = document.getElementById("new-session__folder-input-datalist")
const sessionList = document.getElementById("sessions-list")

newSessionBtn.addEventListener('click', saveSession)

async function saveSession(event) {
  event.preventDefault();

  const tabs = await chrome.tabs.query({ currentWindow: true })
  const sessions = await chrome.storage.sync.get(null)

  const { validSession, sessionName, folderName } = validateSession(tabs, sessions)
  if (!validSession) return

  tabs.splice(0, 1)
  const tabIds = tabs.map((tab) => tab.id)
  const tabUrls = tabs.map((tab) => tab.url)
  const tabTitles = tabs.map((tab) => tab.title)
  const color = getSessionColor()

  createTabGroup(tabIds, sessionName, color)

  await chrome.storage.sync.set({
    [sessionName]: {
      tabUrls,
      tabIds,
      tabTitles,
      folderName,
      color
    }
  })

  // addFolderToDataList(folderName)
  await fetchSessions()
}

// function addFolderToDataList(folderName) {
//   const optionElement = document.createElement('option')
//   optionElement.value = folderName
//   optionElement.id = folderName
//   folderDataList.append(optionElement)
// }

// async function removeFolderFromDataList(folderName) {
//   document.getElementById(folderName).remove()
// }

function getSessionColor() {
  return colorBtn.dataset.selectedColor
}

async function createTabGroup(tabIds, sessionName, color) {
  const groupId = await chrome.tabs.group({ tabIds })
  await chrome.tabGroups.update(groupId, {
    color,
    title: sessionName
  })
}

function validateSession(tabs, sessions) {
  // @ts-ignore
  const sessionName = sessionNameInput.value.toString()

  // @ts-ignore
  const folderName = sessionFolderInput.value.toString()

  const { alert } = window
  if (tabs.length === 0) return ({ validSession: alert("Nothing to save"), sessionName, folderName })
  if (sessionName.length === 0) return ({ validSession: alert("No name provided"), sessionName, folderName })
  if (sessionName in sessions) return ({ validSession: alert("Session already exists"), sessionName, folderName })

  // @ts-ignore
  sessionNameInput.value = ""
  // @ts-ignore
  sessionFolderInput.value = ""

  return { validSession: true, sessionName, folderName }
}

export async function fetchSessions() {
  const sessions = await chrome.storage.sync.get(null)

  removeAllSessionElementsInDsm()

  // @ts-ignore
  for (const session in sessions) {
    createAndAppendSessionEl(session, sessions[session])
  }
}

function removeAllSessionElementsInDsm() {
  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);
}

function createAndAppendSessionEl(sessionName, session) {
  const sessionEl = document.createElement("li")
  sessionEl.id = sessionName
  sessionEl.className = "sessions-list-item"

  const replaceTabsWithSessionBtn = document.createElement("button")
  replaceTabsWithSessionBtn.innerText = `${sessionName}`
  replaceTabsWithSessionBtn.addEventListener('click', addClickHandler(replaceTabsWithSessionHandler, sessionName))
  sessionEl.appendChild(replaceTabsWithSessionBtn)

  const addSessionToTabsBtn = document.createElement("button")
  addSessionToTabsBtn.innerText = "🔗"
  addSessionToTabsBtn.addEventListener('click', addClickHandler(addSessionToTabsHandler, sessionName))
  sessionEl.appendChild(addSessionToTabsBtn)

  const deleteSessionBtn = document.createElement("button")
  deleteSessionBtn.innerText = "🗑️"
  deleteSessionBtn.addEventListener('click', addClickHandler(deleteSessionHandler, sessionName))
  sessionEl.appendChild(deleteSessionBtn)

  // if a folder exists, check for it in the DOM and then build a folder if it don't exist
  if (session.folderName) { }
  sessionList.appendChild(sessionEl)
}

function addClickHandler(eventHandler, ...args) {
  return async (event) => {
    event.preventDefault();
    await eventHandler(...args)
  }
}

// The user might be opening a session for the first time
// or they might have a session currently open and they now want to close it
async function replaceTabsWithSessionHandler(sessionName) {
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) return await closeTabGroup(tabGroups[0].id)

  // otherwise wipe out all the tabs and create the session
  await removeAllTabsInChrome()

  const result = await chrome.storage.sync.get(sessionName)
  const { tabUrls, color } = result[sessionName]

  await createTabsInChrome(tabUrls, sessionName, color)
  await refreshDsmTabs()
}

async function createTabsInChrome(tabUrls, sessionName, color) {
  const newTabIds = []
  for (const tabUrl of tabUrls) {
    const newTab = await chrome.tabs.create({ url: tabUrl, active: false })
    newTabIds.push(newTab.id)
  }
  await createTabGroup(newTabIds, sessionName, color)
}

async function removeAllTabsInChrome() {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  tabs.splice(0, 1)

  const tabIds = tabs.map((tab) => tab.id)
  await chrome.tabs.remove(tabIds)
}

async function closeTabGroup(tabGroupId) {
  const tabs = await chrome.tabs.query({ groupId: tabGroupId })
  const tabIds = tabs.map(tab => tab.id)
  await chrome.tabs.remove(tabIds)
}

async function addSessionToTabsHandler(sessionName) {
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) return await closeTabGroup(tabGroups[0].id)

  const result = await chrome.storage.sync.get(sessionName)
  const { tabUrls, color } = result[sessionName]

  createTabsInChrome(tabUrls, sessionName, color)
}

async function deleteSessionHandler(sessionName) {
  if (!window.confirm("Are you sure?")) return
  const tabGroups = await chrome.tabGroups.query({ title: sessionName })
  if (tabGroups.length === 1) await closeTabGroup(tabGroups[0].id)
  // const result = await chrome.storage.sync.get(sessionName)
  // const session = result[sessionName]
  // removeFolderFromDataList(session.folderName)

  await chrome.storage.sync.remove(sessionName)
  fetchSessions()
}
