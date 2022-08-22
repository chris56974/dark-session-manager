document.addEventListener("keydown", (event) => {
  if (event.key === "J" && !(event.ctrlKey)) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[tabs.length - 1].id, { active: true })
    })
  }

  if (event.key === "K" && !(event.ctrlKey)) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[1].id, { active: true })
    })
  }
});