# [Dark Session Manager (DSM)](https://github.com/chris56974/dark-session-manager)

DSM is a session manager inspired by [Workona](https://workona.com/), except the emphasis is not on work but on organized browsing. They do a bunch of other stuff that I don't plan on doing like cloud integrations (Figma, GCloud, Zoom), [universal search](https://workona.com/help/search/), [templates](https://workona.com/templates/), [mobile apps](https://workona.com/help/mobile-support/), etc. So check them out if you want that stuff.

## Chrome Extension Basics

This chrome extension only uses a single "extension page" at app/dsm.html.

It doesn't use any content scripts (scripts that are injected into the webpage that the user is browsing).

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; style-src 'self'"
}
```

### Development

1. Go to the extensions page of your browser (brave://extensions) and enable "developer mode".

2. Then click "load unpacked" and point it to the directory holding DSM.

## Shortcuts

I would love to override the browser shortcuts but I don't think I can.

- `J` -> move left one tab
- `K` -> move right one tab

## Design

You can find the [logo on figma](https://www.figma.com/file/f3AxaotOiuVRECkb7Iqy8k/Dark-Session-Manager-Logo?node-id=0%3A1).

I used vanilla JS web components because I wanted DSM to be really fast. Vanilla JS also got unwieldy after a while, I wanted a way to modularize my code and it worked pretty well for it.

## Ideas

Tab favicons. Settings modal.

## [License MIT](https://github.com/chris56974/dark-session-manager/LICENSE)

## Attribution

- [Fluid Type Scale](https://www.fluid-type-scale.com/)

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
