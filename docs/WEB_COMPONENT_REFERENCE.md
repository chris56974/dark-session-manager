This is to remind myself how to build a vanilla web component

```js 
const template = document.createElement('template')
template.innerHTML = ``

export class ColorSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // event listeners
  }

  disconnectedCallback() {
    // remove listeners
  }

  changeColorBtnToSelectedColor(e) {
    const colorGridCell = e.target
    const selectedColor = colorGridCell.style.backgroundColor
    // newSessionColorBtn.dataset.selectedColor = colorGridCell.dataset.color
    // newSessionColorBtn.style.borderColor = selectedColor
  }
}

// Register the card component
customElements.define('color-selector', ColorSelector);
```