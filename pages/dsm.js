const curSessionTabs = document.getElementById("current-session-div__tabs");

function populateCurrentSessionWithTabs(currentTabs) {
  while (curSessionTabs.children) {
    curSessionTabs.removeChild(curSessionTabs.lastChild)
  }

  for (const tab of currentTabs) {
    const tabElement = createTabElement(tab)
  }
}

function createTabElement(tab) {

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tabsInit) {
    populateCurrentSessionWithTabs(request.tabsInit)
  }
});

document.addEventListener("keydown", (event) => {
  // I'll need to add another boolean check later to prevent the user from navigating while editing a note. 
  if (event.key === "J" || event.key === "K") chrome.runtime.sendMessage({ navigate: event.key })
})
