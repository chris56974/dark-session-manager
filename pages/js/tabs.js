const workspaceTabList = document.getElementById("workspace-tabs__list")
const clearTabsBtn = document.getElementById("sidebar-clear-btn");

clearTabsBtn.addEventListener('click', clearTabsBtnHandler)

chrome.tabs.onRemoved.addListener(() => {
  refreshDsmTabs()
})

async function clearTabsBtnHandler() {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const tabIds = tabs.map((tab) => tab.id).slice(1)
  chrome.tabs.remove(tabIds)

  clearDsmTabs()
}

function clearDsmTabs() {
  while (workspaceTabList.firstChild) {
    workspaceTabList.removeChild(workspaceTabList.lastChild)
  }
}

export async function refreshDsmTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true })

  clearDsmTabs()

  for (let i = 1; i < tabs.length; i++) {
    const tabEl = createTabEl(tabs[i])
    workspaceTabList.appendChild(tabEl)
  }
}

export function createTabEl(tab, preferredTitle = null) {
  const tabTitle = preferredTitle ? preferredTitle : tab.title
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "workspace-tabs-list-item"

  const tabBtn = document.createElement('button')
  tabBtn.textContent = `${tabTitle.length > 0 ? tabTitle : "New Tab"}`
  tabBtn.addEventListener('click', () => {
    chrome.tabs.update(tab.id, { active: true })
  })

  tabElement.appendChild(tabBtn)
  return tabElement
}

chrome.tabGroups.onUpdated.addListener(tabGroupHandler)

async function tabGroupHandler(group) { 
  console.log(group)
  console.log("fired")
}