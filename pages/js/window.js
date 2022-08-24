import { refreshDsmTabs } from "./tabs.js"
import { fetchSessions } from "./sessions.js"

window.addEventListener('focus', () => {
  refreshDsmTabs()
  fetchSessions()
})

window.addEventListener('load', () => {
  refreshDsmTabs()
  fetchSessions()
})