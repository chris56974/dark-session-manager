const clearStorageBtn = document.getElementById("clear-storage-btn")
const settingsBtn = document.getElementById("settings-btn")

settingsBtn.addEventListener('click', async () => {
  const sessions = await chrome.storage.sync.get(null)
  console.log(sessions)
})

clearStorageBtn.addEventListener('click', async () => {
  await chrome.storage.sync.clear()
})