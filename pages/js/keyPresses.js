document.addEventListener("keydown", keyPressHandler)

async function keyPressHandler(event) {
  if (event.key === "J" && !(event.ctrlKey)) {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
  }

  if (event.key === "K" && !(event.ctrlKey)) {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[1].id, { active: true })
  }
}