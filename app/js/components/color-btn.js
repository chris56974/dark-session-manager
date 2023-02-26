export class ColorButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open", delegatesFocus: true })
    this.render()

    // grab elements
    this.colorBtn = this.shadowRoot.querySelector('.color-btn')
    this.colorGrid = this.shadowRoot.querySelector('.color-grid')
    this.colorGridCells = this.shadowRoot.querySelectorAll('.color-grid button')
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
        }

        .color-grid {
          display: inline-grid;
          grid-template: repeat(3, 1fr) / repeat(3, 1fr);
          z-index: 100;
        }

        .color-grid button {
          cursor: pointer;
          height: 3em;
          width: 3em;
          border: none;
          display: none;
        }

        .reveal button {
          display: inline-block;
        }
      </style>
    `
  }

  get html() {
    // You can't nest a <button> in a <button>, so I had to use a div instead.
    return /*html*/`
      <div class="color-btn" tabindex="0" role="button">
        <div class="color-grid">
          <button style="background-color: #dadce0; border-top-left-radius: 5px" data-color="grey"></button>
          <button style="background-color: #8ab4f8;" data-color="blue" ></button> 
          <button style="background-color: #f28b82; border-top-right-radius: 5px;" data-color="red"></button>
          <button style="background-color: #fdd663;" data-color="yellow"></button>
          <button style="background-color: #81c995;" data-color="green"></button>
          <button style="background-color: #ff8bcb;" data-color="pink"></button>
          <button style="background-color: #c58af9; border-bottom-left-radius: 5px;" data-color="purple"></button>
          <button style="background-color: #78d9ec;" data-color="cyan"></button>
          <button style="background-color: #fcad70; border-bottom-right-radius: 5px;" data-color="orange"></button>
          </div>
      </div>
    `
  }

  render() {
    this.shadowRoot.innerHTML = `${this.css}${this.html}`
  }

  connectedCallback() {
    this.colorBtn.addEventListener('click', this.toggleGrid)
  }

  toggleGrid = () => {
    this.colorGrid.classList.toggle('reveal')
  }
}
