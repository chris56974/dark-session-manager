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
const newSessionInput = document.querySelector(".new-session-name-input")
const newSessionBtn = document.querySelector(".create-new-session-btn")
const clearTabsBtn = document.querySelector(".clear-tabs-btn")
const sessionGrid = document.querySelector(".sessions-grid")
const newSessionColorBtn = document.querySelector('.new-session-color-btn')
const newSessionColorGrid = document.querySelector('.new-session-color-grid')

/** 
 * DOM EVENT LISTENERS
 */
window.addEventListener('load', () => { refreshSessionsListInTheDom() })
document.addEventListener('keydown', keyboardCommands)
clearTabsBtn.addEventListener('click', removeAllChromeTabs)
newSessionColorBtn.addEventListener('click', revealColorGrid)
newSessionColorGrid.addEventListener('click', setNewSessionColor)
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

function revealColorGrid(e) {
  e.preventDefault();
  newSessionColorGrid.classList.toggle('reveal-color-grid')
  document.addEventListener('click', closeGridAndRemoveListener)
}

function closeGridAndRemoveListener(e) {
  // if the user clicks outside the color grid, the color grid should close
  if (newSessionColorBtn.contains(e.target)) return
  newSessionColorGrid.classList.toggle('reveal-color-grid')
  document.removeEventListener('click', closeGridAndRemoveListener)
}

export function setNewSessionColor(e) {
  // stopPropagation to stop revealColorGrid() from getting called 
  // Because this color grid is inside the button that revealed it
  e.preventDefault()
  e.stopPropagation()

  const colorGridCell = e.target
  const selectedColor = colorGridCell.style.backgroundColor

  // @ts-ignore
  newSessionColorBtn.dataset.selectedColor = colorGridCell.dataset.color
  // @ts-ignore
  newSessionColorBtn.style.backgroundColor = selectedColor

  newSessionColorGrid.classList.toggle('reveal-color-grid')
  document.removeEventListener('click', closeGridAndRemoveListener)
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
  const sessionEl = document.createElement("div")
  sessionEl.setAttribute('role', 'article')
  sessionEl.className = "session-card"
  sessionEl.dataset.tabGroupColor = session.color

  const { tabTitles, tabUrls } = session

  sessionEl.innerHTML = `
    <h2 class="session-card-heading">${sessionName}</h2>

    <button class="delete-session-btn">🗑️</button>

    <ul class="session-card-tabs">
      ${tabTitles[0] ?
      `<li class="session-card-tab">
        <a class="session-card-tab__url" href="${tabUrls[0]}" target="_blank">${tabTitles[0]}</a>
      </li>` : ``}
      ${tabTitles[1] ?
      `<li class="session-card-tab">
        <a class="session-card-tab__url" href="${tabUrls[1]}" target="_blank">${tabTitles[1]}</a>
      </li>` : ``}
      ${tabTitles[2] ?
      `<li class="session-card-tab">
        <a class="session-card-tab__url" href="${tabUrls[2]}" target="_blank">${tabTitles[2]}</a>
      </li>` : ``}
    </ul>
    
    <button class="replace-tabs-btn">Replace Tabs 🔃</button>
    <button class="add-tabs-btn">Add Tabs 🔗</button>
  `

  const deleteSessionBtn = sessionEl.querySelector('.delete-session-btn')
  const replaceTabsBtn = sessionEl.querySelector('.replace-tabs-btn')
  const addTabsBtn = sessionEl.querySelector('.add-tabs-btn')

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