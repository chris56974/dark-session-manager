const settingsBtn = document.getElementById("settings-btn")

settingsBtn.addEventListener('click', openUpSettings)

async function openUpSettings() {
  const sessions = await chrome.storage.sync.get(null)
}

export const tabGroupsDisabled = false