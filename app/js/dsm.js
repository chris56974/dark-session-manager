import { addClickHandler } from "./utility.js"
import {
  removeAllChromeTabs,
  replaceChromeTabsWithSessionTabs,
  addSessionTabsToCurrentTabs,
  createNewSessionInChromeStorage,
  deleteSessionFromChromeStorage,
} from "./chromeApi.js"


/** 
 * DOM ELEMENTS
 */
export const newSessionInput = document.querySelector(".new-session-input")
export const newSessionBtn = document.querySelector(".new-session-btn")
export const clearTabsBtn = document.querySelector(".clear-tabs-btn")
export const sessionList = document.querySelector(".sessions-list")
export const newSessionColorBtn = document.querySelector('.new-session-color-btn')
export const newSessionColorGrid = document.querySelector('.new-session-color-grid')

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('load', () => { refreshSessionsListInTheDom() })

document.addEventListener('keydown', keyboardCommands)

clearTabsBtn.addEventListener('click', removeAllChromeTabs)

newSessionColorBtn.addEventListener('click', revealColorGrid)
newSessionColorGrid.addEventListener('click', setNewSessionColor)

newSessionBtn.addEventListener('click', createNewSession)


/** 
 * DOM EVENT HANDLERS
 */
export async function keyboardCommands(e) {
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


export function revealColorGrid(e) {
  e.preventDefault();
  newSessionColorGrid.classList.toggle('reveal-color-grid')
}

export function setNewSessionColor(e) {
  e.preventDefault();
  const colorGridCell = e.target
  const selectedColor = colorGridCell.style.backgroundColor

  // @ts-ignore
  newSessionColorBtn.dataset.selectedColor = colorGridCell.dataset.color
  // @ts-ignore
  newSessionColorBtn.style.backgroundColor = selectedColor
}

export async function createNewSession(e) {
  e.preventDefault();

  // @ts-ignore
  const newSessionName = newSessionInput.value.toString()
  // @ts-ignore
  const newSessionColor = newSessionColorBtn.dataset.selectedColor

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
  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);

  const { sessions } = await chrome.storage.local.get(['sessions'])

  // @ts-ignore
  for (const sessionName in sessions) {
    createAndAppendSessionElementToDom(sessionName, sessions[sessionName])
  }
}

export function createAndAppendSessionElementToDom(sessionName, session) {
  const sessionEl = document.createElement("li")
  sessionEl.className = "sessions-list-item"
  sessionEl.dataset.tabGroupColor = session.color

  const sessionTitleElement = document.createElement("h2")
  sessionTitleElement.textContent = sessionName
  sessionEl.appendChild(sessionTitleElement)

  const replaceTabsWithSessionBtn = document.createElement("button")
  replaceTabsWithSessionBtn.innerText = "Replace Current Tabs With Session Tabs 🔃"
  replaceTabsWithSessionBtn.addEventListener('click', addClickHandler(replaceChromeTabsWithSessionTabs, sessionName))
  sessionEl.appendChild(replaceTabsWithSessionBtn)

  const addSessionToTabsBtn = document.createElement("button")
  addSessionToTabsBtn.innerText = "Link session tabs onto current tabs 🔗"
  addSessionToTabsBtn.addEventListener('click', addClickHandler(addSessionTabsToCurrentTabs, sessionName))
  sessionEl.appendChild(addSessionToTabsBtn)

  const deleteSessionBtn = document.createElement("button")
  deleteSessionBtn.innerText = "🗑️"
  deleteSessionBtn.addEventListener('click', addClickHandler(deleteSessionFromChromeStorage, sessionName))
  sessionEl.appendChild(deleteSessionBtn)

  const sessionTabsList = document.createElement('ul')

  for (let i = 0; i < session.tabTitles.length; i++) {
    const tabElement = document.createElement('li')
    const tabTitleElement = document.createElement('p')
    const tabUrlElement = document.createElement('p')

    tabTitleElement.textContent = session.tabTitles[i]
    tabUrlElement.textContent = session.tabUrls[i]

    tabElement.appendChild(tabTitleElement)
    tabElement.appendChild(tabUrlElement)
    sessionTabsList.appendChild(tabElement)
  }

  sessionEl.appendChild(sessionTabsList)
  sessionList.appendChild(sessionEl)
}


/** 
 * DEBUGGING
 */
export const revealStorageBtn = document.querySelector('.reveal-storage-btn')
revealStorageBtn.addEventListener('click', async () => {
  const foo = await chrome.storage.local.get(null)
  console.log(foo)
})

export const clearStorageBtn = document.querySelector('.clear-storage-btn')
clearStorageBtn.addEventListener('click', async () => {
  await chrome.storage.local.clear()
})