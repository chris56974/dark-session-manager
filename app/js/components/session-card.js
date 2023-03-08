export class SessionCard extends HTMLElement {
  #tabs = []
  #cardHeading = ""

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `${this.css}${this.html}`
  }

  get css() {
    return /*html*/`
      <style>
        article {
          display: flex;
          flex-direction: column;
          background-color: rgb(51 51 51);
          border-radius: 20px;
          height: 200px;
        }

        .content {
          padding: 10px;
          height: 60%;
        }

        .heading-div {
          display: flex; 
          align-items: center;
          margin-bottom: 10px;
        }

        h2 {
          font-size: 24px;
          color: rgb(239, 239, 239);
          width: 10ch;
          white-space: nowrap;
          margin: 0;
        }

        button {
          cursor: pointer;
          font-size: 1.5em;
        }

        .delete-session-btn {
          border: none;
          margin-left: auto;
          background: transparent;
        }

        ul {
          list-style: none;
          font-size: 14px;
          padding: 0;
          margin: 0;
          width: 20ch;
          height: 60%;
          width: 100%;
          overflow-y: auto;
        }

        ul::-webkit-scrollbar {
          width: .6em;
          height: 90%;
        }

        ul::-webkit-scrollbar-thumb {
          background-color: grey;
          border-radius: 20em;

        }

        li {
          padding-block: 2px;
          white-space: nowrap;
          overflow: hidden;
        }

        a {
          color: cyan;
        }

        .session-btns {
          margin-top: auto;
          height: 25%;
        }

        .replace-tabs-btn {
          background-color: grey;
          border: none;
          width: 49%;
          border-bottom-left-radius: 20px;
          height: 100%;
        }

        .add-tabs-btn {
          background-color: grey;
          border: none;
          width: 49%;
          border-bottom-right-radius: 20px;
          height: 100%;
        }
      </style>
    `
  }

  get html() {
    return /*html*/`
      <article>
        <div class="content">
          <div class="heading-div">
            <h2>${this.#cardHeading}</h2>
            <button class="delete-session-btn">🚮</button>
          </div>
          <ul>
            ${this.#tabs.map((tab) => `
              <li><a target="_blank" href="${tab.url}">${tab.title}</a></li>
            `).join('\n')}
          </ul>
        </div>
        <div class="session-btns">
          <button class="replace-tabs-btn">🔄</button>
          <button class="add-tabs-btn">⤴️</button>
        </div>
      </article>
    `
  }

  set tabs(tabs) {
    /** 
     * Tabs is set from outside the web component 
     * 
     * @example 
     * const foo = createElement('session-card')
     * foo.tabs = [[google, firefox], [www.google.com, www.firefox.com]]
     */

    this.#tabs = tabs
    this.render()
  }

  set cardHeading(cardHeading) {
    this.#cardHeading = cardHeading
    this.render()
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.delete-session-btn').addEventListener('click', this.deleteSession)
    this.shadowRoot.querySelector('.replace-tabs-btn').addEventListener('click', this.replaceTabs)
    this.shadowRoot.querySelector('.add-tabs-btn').addEventListener('click', this.addTabs)
  }

  deleteSession = (event) => {
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('delete-session'))
  }

  replaceTabs = (event) => {
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('replace-tabs'))
  }

  addTabs = (event) => {
    event.preventDefault()
    this.dispatchEvent(new CustomEvent('add-tabs'))
  }
}

customElements.define('session-card', SessionCard)