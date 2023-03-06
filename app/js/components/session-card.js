export class SessionCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
    this.render()
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
          text-overflow: ellipsis;
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
            <h2>${this.name}</h2>
            <button class="delete-session-btn">🚮</button>
          </div>
          <ul>${this.tabListItems}</ul>
        </div>
        <div class="session-btns">
          <button class="replace-tabs-btn">🔄</button>
          <button class="add-tabs-btn">⤴️</button>
        </div>
      </article>
    `
  }

  render() {
    this.shadowRoot.innerHTML = `${this.css}${this.html}`
  }

  connectedCallback() {
    this.name = this.getAttribute('name')
    this.render()
  }

  set tabs(tabs) {
    /** 
     * Tabs is set from outside the web component 
     * 
     * @example 
     * const foo = createElement('session-card')
     * foo.tabs = [[google, firefox], [www.google.com, www.firefox.com]]
     */

    const [tabTitles, tabUrls] = tabs
    const listItems = []

    for (let i = 0; i < tabTitles.length; i++) {
      listItems.push(`<li><a target="_blank" href="${tabUrls[i]}">${tabTitles[i]}</a></li>`)
    }

    this.tabListItems = listItems.join('')
  }
}