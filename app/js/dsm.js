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
export const newSessionInput = document.getElementById("new-session-input")
export const newSessionBtn = document.getElementById("new-session-btn")
export const clearTabsBtn = document.getElementById("clear-tabs-btn")
export const sessionList = document.getElementById("sessions-list")
export const newSessionColorBtn = document.querySelector('.new-session-color-btn')
export const newSessionColorGrid = document.querySelector('.new-session-color-grid')

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('focus', () => { refreshSessionsListInTheDom() })
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
  newSessionColorBtn.style.borderColor = selectedColor
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
  sessionNameInput.value = ""

  await refreshSessionsListInTheDom()
}

export async function refreshSessionsListInTheDom() {
  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);

  const result = await chrome.storage.sync.get('sessions')

  // @ts-ignore
  for (const session in result) {
    createAndAppendSessionElementToDom(session, result[session])
  }
}

export function createAndAppendSessionElementToDom(sessionName, session) {
  const sessionEl = document.createElement("li")
  sessionEl.id = sessionName
  sessionEl.className = "sessions-list-item"

  const replaceCurrentTabsWithSessionTabsBtn = document.createElement("button")
  replaceCurrentTabsWithSessionTabsBtn.innerText = "Replace Current Tabs With Session Tabs 🔃"
  replaceCurrentTabsWithSessionTabsBtn.addEventListener('click', addClickHandler(replaceChromeTabsWithSessionTabs, sessionName))
  sessionEl.appendChild(replaceCurrentTabsWithSessionTabsBtn)

  const addSessionTabsToCurrentTabsBtn = document.createElement("button")
  addSessionTabsToCurrentTabsBtn.innerText = "Link session tabs onto current tabs 🔗"
  addSessionTabsToCurrentTabsBtn.addEventListener('click', addClickHandler(addSessionTabsToCurrentTabs, sessionName))
  sessionEl.appendChild(addSessionTabsToCurrentTabsBtn)

  const deleteSessionBtn = document.createElement("button")
  deleteSessionBtn.innerText = "🗑️"
  deleteSessionBtn.addEventListener('click', addClickHandler(deleteSessionFromChromeStorage, sessionName))
  sessionEl.appendChild(deleteSessionBtn)

  const sessionTabsList = document.createElement('ul')

  for (const tab of session.tabTitles.length) {
    const tabElement = document.createElement('li')
    const tabTitle = document.createElement('p')
    const tabId = document.createElement('p')

    tabTitle.textContent = session.tabTitle
    tabId.textContent = session.tabId

    tabElement.appendChild(tabTitle)
    tabElement.appendChild(tab)
    sessionTabsList.appendChild(tabElement)
  }

  sessionList.appendChild(sessionEl)
}