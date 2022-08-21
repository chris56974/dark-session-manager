const currentTabList = document.getElementById("current-tab-list");
const clearTabsBtn = document.getElementById("clear-all-tabs-btn");
const sessionList = document.getElementById("saved-session-list")
const saveSessionBtn = document.getElementById("save-session-btn")
const saveSessionInput = document.getElementById("save-session-input")
const clearAllSessions = document.getElementById("clear-all-sessions-btn")
const settingsBtn = document.getElementById("settings-btn")

window.addEventListener('focus', () => {
  refreshTabs()
  fetchSessions()
})

// if the user refreshes the page
window.addEventListener('load', async () => {
  refreshTabs()
  fetchSessions()
})

document.addEventListener("keydown", (event) => {
  if (event.key === "J" && !(event.ctrlKey)) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
    })
  }

  if (event.key === "K" && !(event.ctrlKey)) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[1].id, { active: true })
    })
  }
});

clearTabsBtn.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const tabIds = tabs.map((tab) => tab.id).slice(1)
  chrome.tabs.remove(tabIds)

  while (currentTabList.firstChild) {
    currentTabList.removeChild(currentTabList.lastChild)
  }
})

saveSessionBtn.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  // @ts-ignore
  const sessionName = saveSessionInput.value.toString()
  // @ts-ignore
  saveSessionInput.value = ""
  chrome.storage.sync.set({ [sessionName]: tabs })
  fetchSessions()
})

settingsBtn.addEventListener('click', async () => {
  const sessions = await chrome.storage.sync.get(null)
  console.log(sessions)
})

async function refreshTabs() {
  while (currentTabList.firstChild) {
    currentTabList.removeChild(currentTabList.lastChild)
  }
  const tabs = await chrome.tabs.query({ currentWindow: true })
  for (let i = 1; i < tabs.length; i++) {
    const tabElement = createTabElement(tabs[i])
    currentTabList.appendChild(tabElement)
  }
}

async function fetchSessions() {
  while (sessionList.firstChild) {
    sessionList.removeChild(sessionList.lastChild)
  }
  const sessions = await chrome.storage.sync.get(null)
  // @ts-ignore
  for (const session in sessions) {
    const sessionElement = createSessionElement(session)
    sessionList.appendChild(sessionElement)
  }
}

function createTabElement(tab) {
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "tab"
  tabElement.textContent = `${tab.title.length > 0 ? tab.title : "New Tab"}`
  return tabElement
}

function createSessionElement(sessionName) {
  const sessionElement = document.createElement("li")
  sessionElement.id = sessionName
  sessionElement.className = "session"
  sessionName.textContent = sessionName
  return sessionElement
}