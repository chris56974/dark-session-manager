export class ColorButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open", delegatesFocus: true })
    this.render()
    this.gridOpen = false
  }

  get styles() {
    return /*html*/`
      <style>
        :host {
          display: inline-block;
        }

        :host * {
          box-sizing: border-box;
        }

        .new-session-color-btn {
          /* relative for the grid */
          position: relative;

          height: 2em;
          width: 2em; 
          border-radius: 2em;

          background-color: #dadce0;
          border: none;
          cursor: pointer;
        }

        .new-session-color-grid {
          /* reveal grid cells */
          display: flex;
          flex-wrap: wrap;

          /* absolute for grid */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.3s;
        }

        .new-session-color-grid-cell {
          /* They need to say at 32% of the grid width */
          flex: 0 0 32%;
          width: 7em;
          height: 2em;
        }

        .reveal-color-grid {
          transform: translate(-50%, -50%) scale(1) !important;
          z-index: 100 !important;
        }

        .reveal-color-cells {
          display: inline-block !important;
        }
      </style>
    `
  }

  get template() {
    return /*html*/`
      <button class="new-session-color-btn" data-selected-color="grey">
        <div class="new-session-color-grid">
          <div
            class="new-session-color-grid-cell"
            style="background-color: #dadce0; border-top-left-radius: 5px"
            data-color="grey"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #8ab4f8"
            data-color="blue"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #f28b82; border-top-right-radius: 5px"
            data-color="red"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #fdd663"
            data-color="yellow"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #81c995"
            data-color="green"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #ff8bcb"
            data-color="pink"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #c58af9; border-bottom-left-radius: 5px"
            data-color="purple"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #78d9ec"
            data-color="cyan"
          ></div>
          <div
            class="new-session-color-grid-cell"
            style="background-color: #fcad70; border-bottom-right-radius: 5px"
            data-color="orange"
          ></div>
        </div>
      </button>
    `
  }

  render() {
    this.shadowRoot.innerHTML = `${this.styles}${this.template}`
  }

  connectedCallback() {
    // grab elements
    this.colorBtn = this.shadowRoot.querySelector('.new-session-color-btn')
    this.colorGrid = this.shadowRoot.querySelector('.new-session-color-grid')
    this.colorGridCells = this.shadowRoot.querySelectorAll('.new-session-color-grid-cell')

    // event listeners
    this.colorBtn.addEventListener('click', this.revealColorGrid.bind(this))
    this.colorGrid.addEventListener('click', this.setNewSessionColor.bind(this))
  }

  attachListeners() {
    document.addEventListener('click', this.closeColorGridAndRemoveListeners)
    document.addEventListener('keydown', this.closeColorGridOnEsc)
    this.colorBtn.addEventListener('focusout', this.closeColorGridOnFocusOut)
  }

  removeListeners() {
    document.removeEventListener('click', this.closeColorGridAndRemoveListeners)
    document.removeEventListener('keydown', this.closeColorGridOnEsc)
    this.colorBtn.removeEventListener('focusout', this.closeColorGridOnFocusOut)
  }

  revealColorGrid(event) {
    // preventDefault() to stop a parent form from sending
    event.preventDefault()
    // stopPropagation() to prevent the document from getting clicked too 
    event.stopPropagation()

    if (this.gridOpen) {
      // close the grid
      this.toggleGrid()
      this.removeListeners()
    } else {
      // open the grid
      this.toggleGrid()
      this.attachListeners()
    }
  }

  closeColorGridAndRemoveListeners = () => {
    this.toggleGrid()
    this.removeListeners()
  }

  closeColorGridOnEsc = (event) => {
    if (event.key === "Escape") this.closeColorGridAndRemoveListeners()
  }

  closeColorGridOnFocusOut = (event) => {
    if (event.relatedTarget !== null && event.relatedTarget.className !== "new-session-color-grid-cell") {
      this.toggleGrid()
      this.removeListeners()
    }
  }

  toggleGrid() {
    if (this.gridOpen) {
      // close the grid
      this.gridOpen = !this.gridOpen
      this.colorGrid.classList.toggle('reveal-color-grid')
      this.colorGridCells.forEach((element) => {
        element.setAttribute('tabindex', '-1')
        // element.addEventListener('keydown', this.toggleGridOnSpaceEnter)
      })
    } else {
      // open the grid
      this.gridOpen = !this.gridOpen
      this.colorGrid.classList.toggle('reveal-color-grid')
      this.colorGridCells.forEach((element) => {
        element.setAttribute('tabindex', '0')
        // element.removeEventListener('keydown', this.toggleGridOnSpaceEnter)
      })
    }
  }

  setNewSessionColor = (event) => {
    event.preventDefault()

    const selectedColor = event.target.style.backgroundColor

    // @ts-ignore
    this.colorBtn.dataset.selectedColor = selectedColor
    // @ts-ignore
    this.colorBtn.style.backgroundColor = selectedColor
  }
}
