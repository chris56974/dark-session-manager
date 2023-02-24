import { addClickHandler } from "./utility.js"
import { ColorButton, SessionCard } from "./components/index.js"
import {
  removeAllChromeTabs,
  replaceChromeTabsWithSessionTabs,
  addSessionTabsToCurrentTabs,
  createNewSessionInChromeStorage,
  deleteSessionFromChromeStorage,
} from "./chromeApi.js"

customElements.define('color-btn', ColorButton)
customElements.define('session-card', SessionCard)

/** 
 * DOM ELEMENTS
 */
const newSessionInput = document.querySelector(".new-session-name-input")
const newSessionBtn = document.querySelector(".create-new-session-btn")
const clearTabsBtn = document.querySelector(".clear-tabs-btn")
const sessionGrid = document.querySelector(".sessions-grid")
const newSessionColorBtn = document.querySelector("color-btn")
const newSessionColorGrid = newSessionColorBtn.shadowRoot.querySelector('.new-session-color-grid')

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('load', () => { refreshSessionsListInTheDom() })
document.addEventListener('keydown', keyboardCommands)
clearTabsBtn.addEventListener('click', removeAllChromeTabs)
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
  while (sessionGrid.firstChild)
    sessionGrid.removeChild(sessionGrid.lastChild);

  const { sessions } = await chrome.storage.local.get(['sessions'])

  // @ts-ignore
  for (const sessionName in sessions) {
    createAndAppendSessionElementToDom(sessionName, sessions[sessionName])
  }
}

export function createAndAppendSessionElementToDom(sessionName, session) {
  const { tabTitles, tabUrls } = session

  const sessionEl = document.createElement("session-card")
  sessionEl.dataset.color = session.color

  const tabsList = sessionEl.shadowRoot.querySelector('.session-tabs')
  tabsList.innerHTML = `
     ${tabTitles[0] ? `<li class="session-tab">
        <a class="session-tab__title" href="${tabUrls[0]}" target="_blank">${tabTitles[0]}</a>
      </li>` : ``}
      ${tabTitles[1] ?
      `<li class="session-tab">
        <a class="session-tab__title" href="${tabUrls[1]}" target="_blank">${tabTitles[1]}</a>
      </li>` : ``}
      ${tabTitles[2] ?
      `<li class="session-tab">
        <a class="session-tab__title" href="${tabUrls[2]}" target="_blank">${tabTitles[2]}</a>
      </li>` : ``}
  `

  const deleteSessionBtn = sessionEl.shadowRoot.querySelector('.delete-session-btn')
  const replaceTabsBtn = sessionEl.shadowRoot.querySelector('.replace-tabs-btn')
  const addTabsBtn = sessionEl.shadowRoot.querySelector('.add-tabs-btn')

  deleteSessionBtn.addEventListener('click', addClickHandler(deleteSessionFromChromeStorage, sessionName))
  replaceTabsBtn.addEventListener('click', addClickHandler(replaceChromeTabsWithSessionTabs, sessionName))
  addTabsBtn.addEventListener('click', addClickHandler(addSessionTabsToCurrentTabs, sessionName))

  // sessionGrid was query selected earlier on line 17
  sessionGrid.appendChild(sessionEl)
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