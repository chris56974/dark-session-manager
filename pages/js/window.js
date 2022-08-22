import { refreshTabs } from "./tabs.js"
import { fetchSessions } from "./sessions.js"

console.log("running")

window.addEventListener('focus', () => {
  refreshTabs()
  fetchSessions()
})

window.addEventListener('load', () => {
  refreshTabs()
  fetchSessions()
})