const currentTabList = document.getElementById("current-tab-list");
const clearTabsBtn = document.getElementById("clear-tabs-btn");

clearTabsBtn.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const tabIds = tabs.map((tab) => tab.id).slice(1)
  chrome.tabs.remove(tabIds)

  while (currentTabList.firstChild) {
    currentTabList.removeChild(currentTabList.lastChild)
  }
})

export async function refreshTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true })

  while (currentTabList.firstChild)
    currentTabList.removeChild(currentTabList.lastChild);

  for (let i = 1; i < tabs.length; i++) {
    const tabElement = createTabElement(tabs[i])
    currentTabList.appendChild(tabElement)
  }
}

function createTabElement(tab) {
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "tab"
  tabElement.textContent = `${tab.title.length > 0 ? tab.title : "New Tab"}`
  return tabElement
}