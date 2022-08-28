const newSessionInputs = document.getElementsByClassName("new-session__input")

document.addEventListener("keydown", keyDownHandler)

async function keyDownHandler(event) {

  if (event.key === "J" && !(event.ctrlKey)) {
    for (let i = 0; i < newSessionInputs.length; i++)
      if (newSessionInputs.item(i) === document.activeElement) return;

    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
  }

  if (event.key === "K" && !(event.ctrlKey)) {
    for (let i = 0; i < newSessionInputs.length; i++)
      if (newSessionInputs.item(i) === document.activeElement) return;

    const tabs = await chrome.tabs.query({ currentWindow: true })
    chrome.tabs.update(tabs[1].id, { active: true })
  }

}