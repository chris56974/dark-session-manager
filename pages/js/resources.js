const workspaceResourceList = document.getElementById("workspace-resources__list")

function createWorkspaceResourceEl(tab) {
  const tabElement = document.createElement("li")
  tabElement.id = tab.id
  tabElement.className = "sidebar-tabs__list-item"

  const tabBtn = document.createElement('button')
  tabBtn.textContent = `${tab.title.length > 0 ? tab.title : "New Tab"}`
  tabBtn.addEventListener('click', () => {
    chrome.tabs.update(tab.id, { active: true })
  })

  tabElement.appendChild(tabBtn)
  return tabElement
}
