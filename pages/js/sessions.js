const sessionList = document.getElementById("saved-session-list")
const saveSessionBtn = document.getElementById("save-session-btn")
const saveSessionInput = document.getElementById("save-session-input")

saveSessionBtn.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true })
  const sessions = await chrome.storage.sync.get(null)
  if (tabs.length === 0) return

  // @ts-ignore
  const sessionName = saveSessionInput.value.toString()
  if (sessionName.length === 0) return
  // @ts-ignore
  if (sessionName in sessions) return

  // @ts-ignore
  saveSessionInput.value = ""
  chrome.storage.sync.set({ [sessionName]: tabs })
  fetchSessions()
})

export async function fetchSessions() {
  const sessions = await chrome.storage.sync.get(null)
  console.log("sessions", sessions)

  while (sessionList.firstChild)
    sessionList.removeChild(sessionList.lastChild);

  // @ts-ignore
  for (const session in sessions) {
    const sessionElement = createSessionElement(session)
    sessionList.appendChild(sessionElement)
  }
}

function createSessionElement(sessionName) {
  console.log(sessionName)
  const sessionElement = document.createElement("li")
  sessionElement.id = sessionName
  sessionElement.className = "session"
  sessionElement.textContent = sessionName

  return sessionElement
}
