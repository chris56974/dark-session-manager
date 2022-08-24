const sidebarTabList = document.getElementById("sidebar-tabs__list");
const workspaceTabList = document.getElementById("workspace-tabs__list")
const clearTabsBtn = document.getElementById("sidebar-tabs__clear-btn");

clearTabsBtn.addEventListener('click', clearTabsBtnHandler)

async function clearTabsBtnHandler() {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const tabIds = tabs.map((tab) => tab.id).slice(1)
  chrome.tabs.remove(tabIds)

  clearTabs()
}

function clearTabs() {
  while (sidebarTabList.firstChild) {
    sidebarTabList.removeChild(sidebarTabList.lastChild)
    workspaceTabList.removeChild(workspaceTabList.lastChild)
  }
}

export async function refreshDsmTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true })

  clearTabs()

  for (let i = 1; i < tabs.length; i++) {
    const sidebarTabEl = createSidebarTabEl(tabs[i])
    const workspaceTabEl = createWorkspaceTabEl(tabs[i])
    sidebarTabList.appendChild(sidebarTabEl)
    workspaceTabList.appendChild(workspaceTabEl)
  }
}

export function createSidebarTabEl(tab, preferredTitle = null) {
  const tabTitle = preferredTitle ? preferredTitle : tab.title
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "sidebar-tabs__list-item"

  const tabBtn = document.createElement('button')
  tabBtn.textContent = `${tabTitle.length > 0 ? tabTitle : "New Tab"}`
  tabBtn.addEventListener('click', () => {
    chrome.tabs.update(tab.id, { active: true })
  })

  tabElement.appendChild(tabBtn)
  return tabElement
}

export function createWorkspaceTabEl(tab, preferredTitle) {
  const tabTitle = preferredTitle ? preferredTitle : tab.title
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "sidebar-tabs__list-item"

  const tabBtn = document.createElement('button')
  tabBtn.textContent = `${tabTitle.length > 0 ? tabTitle : "New Tab"}`
  tabBtn.addEventListener('click', () => {
    chrome.tabs.update(tab.id, { active: true })
  })

  tabElement.appendChild(tabBtn)
  return tabElement
}
