const colorButton = document.getElementById('new-session__color-btn')
const colorGrid = document.getElementById('color-grid')

colorButton.addEventListener('click', colorButtonhandler)
colorGrid.addEventListener('click', colorGridHandler)

async function colorButtonhandler(event) {
  event.preventDefault();
  colorGrid.classList.toggle('reveal-color-grid')
}

/**
 * Changes the color button to whatever the user picked
 * @param {object} event 
 */
async function colorGridHandler(event) {
  const colorGridCell = event.target
  const selectedColor = colorGridCell.style.backgroundColor
  colorButton.style.borderColor = selectedColor
  colorButton.dataset.selectedColor = colorGridCell.dataset.color
}

// These are the only colors chrome.tabGroups supports
function convertHexToColor(hex) {
  switch (hex) {
    case "#dadce0": return "grey"
    case "#8ab4f8": return "blue"
    case "#f28b82": return "red"
    case "#fdd663": return "yellow"
    case "#81c995": return "green"
    case "#ff8bcb": return "pink"
    case "#c58af9": return "purple"
    case "#78d9ec": return "cyan"
    case "#fcad70": return "orange"
  }
}