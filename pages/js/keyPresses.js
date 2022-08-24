const saveSessionInput = document.getElementById("sidebar-sessions__new-session-input")

document.addEventListener("keydown", keyDownHandler)

async function keyDownHandler(event) {
  if (
    event.key === "J" &&
    !(event.ctrlKey) &&
    saveSessionInput !== document.activeElement
  ) {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
  }

  if (
    event.key === "K" &&
    !(event.ctrlKey) &&
    saveSessionInput !== document.activeElement
  ) {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[1].id, { active: true })
  }
}