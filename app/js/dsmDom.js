import "./components/index.js"
import {
  replaceChromeTabsWithSessionTabs,
  addSessionTabsToCurrentTabs,
  createNewSessionInChromeStorage,
  deleteSessionFromChromeStorage,
} from "./dsmChrome.js"

/** 
 * DOM ELEMENTS
 */
const newSessionInput = document.querySelector(".session-name-input")
const newSessionBtn = document.querySelector(".create-session-btn")
const sessionGrid = document.querySelector(".sessions-grid")
const newSessionColorBtn = document.querySelector("color-btn")

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('load', () => { refreshSessionsListInTheDom() })
document.addEventListener('keydown', keyboardCommands)
newSessionBtn.addEventListener('click', createNewSession)

async function keyboardCommands(e) {
  // Give me vimium like tab navigation for J and K
  if (e.key === "J" || e.key === "K") {

    // don't do anything if the user is creating a new session
    if (newSessionInput === document.activeElement) return

    const tabs = await chrome.tabs.query({ currentWindow: true })

    e.key === "J" ?
      chrome.tabs.update(tabs[tabs.length - 2].id, { active: true }) :
      chrome.tabs.update(tabs[0].id, { active: true })
  }
}

export async function createNewSession(e) {
  e.preventDefault();

  // @ts-ignore
  const newSessionName = newSessionInput.value.toString()
  // @ts-ignore
  const newSessionColor = newSessionColorBtn.dataset.color

  if (newSessionName.length === 0) return window.alert("No name provided")

  await createNewSessionInChromeStorage(newSessionName, newSessionColor)
  await prepareDomForTheNextSession()
}

/** 
 * DOM SIDE EFFECT METHODS
 */
export async function prepareDomForTheNextSession() {
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
    deleteSessionFromChromeStorage(sessionName)
  })

  sessionEl.addEventListener('replace-tabs', (event) => {
    event.preventDefault()
    replaceChromeTabsWithSessionTabs(sessionName)
  })

  sessionEl.addEventListener('add-tabs', (event) => {
    event.preventDefault()
    addSessionTabsToCurrentTabs(sessionName)
  })

  // sessionGrid was query selected earlier on line 17
  sessionGrid.appendChild(sessionEl)
}

/** 
 * DEBUGGING
 */
export const revealStorageBtn = document.querySelector('.reveal-storage-btn')
revealStorageBtn.addEventListener('click', async () => {
  const foo = await chrome.storage.local.get(null)
})

export const clearStorageBtn = document.querySelector('.clear-storage-btn')
clearStorageBtn.addEventListener('click', async () => {
  await chrome.storage.local.clear()
})
