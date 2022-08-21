const curTabsList = document.getElementById("current-tabs-list");
const clearTabsBtn = document.getElementById("clear-all-tabs-btn");

clearTabsBtn.addEventListener('click', async () => {
  const tabs = await chrome.storage.sync.get(['tabs'])
  console.log(tabs)
});

(function init() {
  chrome.tabs.query({ currentWindow: true })
    .then((tabs) => {
      const tabsHash = {}
      tabsHash.numOfTabs = 0 // tabsHash.length

      for (const tab of tabs) {
        tabsHash.numOfTabs += 1
        tabsHash[tab.id] = {
          groupId: tab.groupId,
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
})

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get(['tabs'], ({ tabs }) => {
    tabs.numOfTabs += 1
    tabs[tab.id] = {
      groupId: tab.groupId,
      index: tab.index,
      title: tab.title,
      url: tab.url
    }
    chrome.storage.sync.set({ tabs: tabs })
  })

  const tabElement = createTabElement(tab)
  curTabsList.appendChild(tabElement)
})

// Mutates
chrome.tabs.onRemoved.addListener((tabId, _) => {
  chrome.storage.sync.get(['tabs'], ({ tabs }) => {
    tabs.numOfTabs -= 1
    delete tabs[tabId]
    chrome.storage.sync.set({ tabs: tabs })
  })
  document.getElementById(`${tabId}`).remove()
})

chrome.tabs.onMoved.addListener(() => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (let i = 1; i < tabs.length; i++) {
      curTabsList.children.item(i - 1).textContent = `${tabs[i].title.length > 0 ? tabs[i].title : "New Tab"}`
    }
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.sync.get(['tabs'], ({ tabs }) => {
      tabs[tabId] = {
        groupId: tab.groupId,
        index: tab.index,
        title: tab.title,
        url: tab.url
      }
      chrome.storage.sync.set({ tabs: tabs })
    })

    const updatedTab = document.getElementById(`${tabId}`)

    if (updatedTab) {
      updatedTab.textContent = `${tab.title.length > 0 ? tab.title : "New Tab"}`
    }
  }
})

