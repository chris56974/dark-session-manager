import { refreshTabs } from "./tabs.js"
import { fetchSessions } from "./sessions.js"

window.addEventListener('focus', () => {
  refreshTabs()
  fetchSessions()
})

window.addEventListener('load', () => {
  refreshTabs()
  fetchSessions()
})