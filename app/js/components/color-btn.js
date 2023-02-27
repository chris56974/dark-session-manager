export class ColorButton extends HTMLElement {
  /** 
   * I use event.preventDefault() ocassionally in case the user puts this button in a form
   * I don't want the user to submit their form on accident when using this button
   */

  constructor() {
    super()
    this.attachShadow({ mode: "open", delegatesFocus: true })
    this.shadowRoot.innerHTML = `${this.css}${this.html}`

    // grab elements
    this.colorBtn = this.shadowRoot.querySelector('.color-btn')
    this.colorGrid = this.shadowRoot.querySelector('.color-grid')
    this.colorGridCells = this.shadowRoot.querySelectorAll('.color-grid button')
    this.gridOpen = false
  }

  get css() {
    return /*html*/`
      <style>
        .color-btn {
          display: grid;
          justify-content: center;
          align-content: center;

          cursor: pointer;
          background-color: #dadce0;
          width: 1em;
          height: 1em;
          border-radius: 2em;
          position: relative;

          transition: background-color 0.3s;
        }

        .color-grid {
          display: inline-grid;
          grid-template: repeat(3, 1fr) / repeat(3, 1fr);

          position: relative;
          z-index: 100;

          transform: scale(0);
          transition: transform 0.3s;
        }

        .color-grid button {
          cursor: pointer;
          height: 3em;
          width: 3em;
          border: none;
        } 

        .reveal {
          transform: scale(1);
          transition: all 0.3s;
        }
      </style>
    `
  }

  get html() {
    // You can't nest a <button> in a <button>, so I had to use a div instead.
    return /*html*/`
    <div class="container" style="display: flex; align-items: center; height: 100%;">
      <div class="color-btn" tabindex="0" role="button">
        <div class="color-grid">
          <button style="background-color: #dadce0; border-top-left-radius: 5px" data-color="grey" tabindex="-1"></button>
          <button style="background-color: #8ab4f8;" data-color="blue" tabindex="-1"></button> 
          <button style="background-color: #f28b82; border-top-right-radius: 5px;" data-color="red" tabindex="-1"></button>
          <button style="background-color: #fdd663;" data-color="yellow" tabindex="-1"></button>
          <button style="background-color: #81c995;" data-color="green" tabindex="-1"></button>
          <button style="background-color: #ff8bcb;" data-color="pink" tabindex="-1"></button>
          <button style="background-color: #c58af9; border-bottom-left-radius: 5px;" data-color="purple" tabindex="-1"></button>
          <button style="background-color: #78d9ec;" data-color="cyan" tabindex="-1"></button>
          <button style="background-color: #fcad70; border-bottom-right-radius: 5px;" data-color="orange" tabindex="-1"></button>
        </div>
      </div>
    </div>
    `
  }

  connectedCallback() {
    this.colorBtn.addEventListener('click', this.toggleGrid)
    this.colorBtn.addEventListener('keydown', this.toggleGridViaKeydown)
    this.colorGrid.addEventListener('click', this.selectColor)
    this.colorGrid.addEventListener('keydown', this.selectColorViaKeydown)
  }

  toggleGrid = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.colorGrid.classList.toggle('reveal')

    const gridCells = this.colorGridCells
    const firstGridCell = gridCells[0]

    // if the grid is open
    if (firstGridCell.getAttribute('tabindex') === "0") {
      document.removeEventListener('click', this.toggleGrid)
      gridCells.forEach((cell) => { cell.setAttribute('tabindex', '-1') })
      // @ts-ignore
      this.colorBtn.focus()

    } else {
      gridCells.forEach((cell) => { cell.setAttribute('tabindex', '0') })
      document.addEventListener('click', this.toggleGrid)
    }
  }

  toggleGridViaKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') this.toggleGrid(event)
  }

  selectColor = (event) => {
    event.stopPropagation()
    const chosenColor = event.target.dataset.color
    const chosenColorCode = event.target.style.backgroundColor

    // @ts-ignore
    this.colorBtn.dataset.color = chosenColor
    // @ts-ignore
    this.colorBtn.style.backgroundColor = chosenColorCode

    this.toggleGrid(event)
  }

  selectColorViaKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') this.selectColor(event)
  }
}
