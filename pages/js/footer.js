import { fetchSessions } from "./sessions.js"

const settingsBtn = document.getElementById("footer__settings-btn")
const clearStorageBtn = document.getElementById("footer__clear-storage-btn")

export let tabGroupsDisabled = false
export let userIsEditing = false

settingsBtn.addEventListener('click', openUpSettings)
clearStorageBtn.addEventListener('click', clearAllSessions)

async function openUpSettings() {
  const sessions = await chrome.storage.sync.get(null)
  console.log(sessions)
}

async function clearAllSessions() {
  await chrome.storage.sync.clear()
  fetchSessions()
}