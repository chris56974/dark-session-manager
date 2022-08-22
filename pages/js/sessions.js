import { tabGroupsDisabled } from "./settings.js"

const sessionList = document.getElementById("saved-session-list")
const saveSessionBtn = document.getElementById("save-session-btn")
const saveSessionInput = document.getElementById("save-session-input")
const clearStorageBtn = document.getElementById("clear-storage-btn")

clearStorageBtn.addEventListener('click', clearAllSessions)
saveSessionBtn.addEventListener('click', saveNewSession)

async function clearAllSessions() {
  await chrome.storage.sync.clear()
  fetchSessions()
}

async function saveNewSession() {
  const tabsWithDSM = await chrome.tabs.query({ currentWindow: true })
  const sessions = await chrome.storage.sync.get(null)
  // @ts-ignore
  const sessionName = saveSessionInput.value.toString()

  const validationFailed = sessionValidation(tabsWithDSM, sessionName, sessions)
  if (validationFailed) return

  const tabs = tabsWithDSM.slice(1)
  const tabIds = tabs.map((tab) => tab.id)

  if (!tabGroupsDisabled) {
    const groupId = await chrome.tabs.group({ tabIds })
    await chrome.tabGroups.update(groupId, {
      color: "grey", // make this dynamic later
      title: sessionName
    })
  }

  console.log("tabs finished", tabs)

  chrome.storage.sync.set({ [sessionName]: tabs })
  fetchSessions()
}

function sessionValidation(tabs, sessionName, sessions) {
  if (tabs.length === 0) return true
  if (sessionName.length === 0) return true

  // @ts-ignore
  if (sessionName in sessions) return true

  // @ts-ignore
  saveSessionInput.value = ""

  return false
}

export async function fetchSessions() {
  const sessions = await chrome.storage.sync.get(null)
  console.log("sessions", sessions)

  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);

  // @ts-ignore
  for (const session in sessions) {
    const sessionElement = createSessionElement(session)
    sessionList.appendChild(sessionElement)
  }
}

function createSessionElement(sessionName) {
  const sessionElement = document.createElement("li")
  sessionElement.id = sessionName
  sessionElement.className = "session"
  sessionElement.textContent = sessionName

  return sessionElement
}
