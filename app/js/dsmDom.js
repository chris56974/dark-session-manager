import "./components/index.js"
import {
  replaceAllTabsWithSessionTabs,
  addSessionTabsToCurrentTabs,
  createNewSession,
  deleteSession,
} from "./dsmChrome.js"

/** 
 * DOM ELEMENTS
 */
const clearStorageBtn = document.querySelector(".clear-storage-btn")
const newSessionInput = document.querySelector(".session-name-input")
const createSessionBtn = document.querySelector(".new-session-btn")
const sessionGrid = document.querySelector(".sessions-grid")

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('load', () => { refreshSessionsListInTheDom() })
clearStorageBtn.addEventListener('click', () => { chrome.storage.local.clear() })
document.addEventListener('keydown', keyboardCommands)
createSessionBtn.addEventListener('click', createSessionHandler)

async function keyboardCommands(e) {
  if (e.key === "J" || e.key === "K") {
    // Give me vimium like tab navigation for keys J and K

    // don't do anything if the user is creating a new session
    if (newSessionInput === document.activeElement) return

    const tabs = await chrome.tabs.query({ currentWindow: true })

    e.key === "J" ?
      chrome.tabs.update(tabs[tabs.length - 2].id, { active: true }) :
      chrome.tabs.update(tabs[0].id, { active: true })
  }
}

export async function createSessionHandler(e) {
  e.preventDefault();

  // @ts-ignore
  const newSessionName = newSessionInput.value.toString()

  if (newSessionName.length === 0) return window.alert("No name provided")

  await createNewSession(newSessionName)
  // @ts-ignore
  newSessionInput.value = ""

  await refreshSessionsListInTheDom()
}

export async function refreshSessionsListInTheDom() {
  while (sessionGrid.firstChild)
    sessionGrid.removeChild(sessionGrid.lastChild);

  const { sessions } = await chrome.storage.local.get(['sessions'])

  // @ts-ignore
  for (const sessionName in sessions) {
    createAndAppendSessionElementToDom(sessionName, sessions[sessionName])
  }
}

export function createAndAppendSessionElementToDom(sessionName, session) {
  const sessionEl = document.createElement("session-card")
  sessionEl.setAttribute('name', sessionName)

  // @ts-ignore
  sessionEl.tabs = session.tabs

  // @ts-ignore
  sessionEl.cardHeading = sessionName

  sessionEl.addEventListener('delete-session', (event) => {
    event.preventDefault()
    deleteSession(sessionName)
  })

  sessionEl.addEventListener('replace-tabs', (event) => {
    event.preventDefault()
    replaceAllTabsWithSessionTabs(sessionName)
  })

  sessionEl.addEventListener('add-tabs', (event) => {
    event.preventDefault()
    addSessionTabsToCurrentTabs(sessionName)
  })

  // sessionGrid was query selected earlier on line 17
  sessionGrid.appendChild(sessionEl)
}

