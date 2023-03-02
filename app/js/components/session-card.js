export class SessionCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `${this.css}${this.html}`
    this.name = ""
    this.color = ""
  }

  get css() {
    return /*html*/`
      <style>
        article {
          background-color: grey;
          border-radius: 20px;
          height: 200px;
        }

        .card-content {
          padding: 10px;
        }

        .heading-div {
          display: flex; 
          align-items: center;
        }

        h2 {
          font-size: 24px;
          color: white;
          width: 10ch;
          white-space: nowrap;
          margin: 0;
          vertical-align: center;
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
          height: 100%;
          width: 20ch;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .replace-tabs-btn {
          width: 40%;
          margin-top: auto;
          border: none;
          border-bottom-left-radius: 20px;
          padding: 7px 0;
        }

        .add-tabs-btn {
          width: 40%;
          margin-top: auto;
          border-bottom-right-radius: 20px;
          border: none;
          padding: 7px 0;
        }
      </style>
    `
  }

  get html() {
    return /*html*/`
      <article class="card">
        <div class="card-content">
          <div class="heading-div">
            <h2 style="color: ${this.color};">${this.name}</h2>
            <button class="delete-session-btn">🚮</button>
          </div>
          <ul class="session-tabs">
            ${this.posts}
          </ul>
        </div>
        <div class="session-btns">
          <button class="replace-tabs-btn">🔄</button>
          <button class="add-tabs-btn">⤴️</button>
        </div>
      </article>
    `
  }

  // this is set from outside the web component
  set posts(posts) {
    console.log(posts)
  }
}