const curTabsList = document.getElementById("current-tabs-list");
const clearTabsBtn = document.getElementById("clear-all-tabs-btn");

clearTabsBtn.addEventListener('click', () => { });

(function init() {
  chrome.tabs.query({ currentWindow: true })
    .then((tabs) => {
      const tabsHash = {}
      for (const tab of tabs) {
        tabsHash[tab.id] = {
          // groupId: tab.groupId,
          index: tab.index,
          title: tab.title,
          url: tab.url
        }
      }
      chrome.storage.sync.set({ tabs: tabsHash })

      for (let i = 1; i < tabs.length; i++) {
        const tabElement = createTabElement(tabs[i])
        curTabsList.appendChild(tabElement)
      }
    })
})();

function createTabElement(tab) {
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "current-tab"
  tabElement.textContent = `${tab.title.length > 0 ? tab.title : "New Tab"}`
  return tabElement
}

document.addEventListener("keydown", (event) => {
  if (event.key === "J" || event.key === "K") {
    chrome.tabs.query({ currentWindow: true }).then((tabs) => {
      event.key === "J" ?
        chrome.tabs.update(tabs[tabs.length - 1].id, { active: true }) :
        chrome.tabs.update(tabs[1].id, { active: true })
    })
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // if it already exists, then change the title to whatever's new
    // if it doesn't already exist, then add it and change the DOM
    chrome.storage.sync.get(['tabs']).then()
  }
})

chrome.tabs.onRemoved.addListener((tabId, _) => {
  chrome.storage.sync.get(['tabs'], (tabs) => {
    const { tabId, ...remainingTabs } = tabs
    chrome.storage.sync.set({ tabs: remainingTabs })
  })

  document.getElementById(`${tabId}`).remove()
})
