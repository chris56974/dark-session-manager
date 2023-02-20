export class SessionCard extends HTMLElement {
  color = ""
  name = ""


  static get observedAttributes() {
    return ['color']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  get css() {
    return `
      <style>
        .session-card {
          background-color: dimgrey;
          border-radius: 20px;
          height: 150px;
        }

        .session-content {
          padding: 12px;
        }

        .session-card-heading-container {
          display: flex;
          width: 100%;
        }

        .session-card-heading {
          width: 80%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .delete-session-btn {
          margin-left: auto;
        }

        .session-card-tabs {
          list-style: none;
        }

        .session-card-tab {
          display: flex;
        }

        .session-card-tab__title {
          font-size: var(--font-size-sm);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .replace-tabs-btn {
          width: 48%;
        }

        .add-tabs-btn {
          width: 48%;
        }
      </style>
    `
  }

  render() {
    this.shadowRoot.innerHTML = `
    <article class="session-card">

      <div class="session-content">
        <div class="session-heading-container">
          <h2 class="session-heading" style="${this.color}">${this.name}</h2>
          <button class="delete-session-btn">🗑️</button>
        </div>

        <ul class="session-tabs"></ul>
      </div>
      
      <div class="tab-buttons">
        <button class="replace-tabs-btn">Replace 🔃</button>
        <button class="add-tabs-btn">Add 🔗</button>
      <div>
    </article>
    `
  }
}

