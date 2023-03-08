# [Dark Session Manager (DSM)](https://github.com/chris56974/dark-session-manager)

DSM is a session manager inspired by [Workona](https://workona.com/), except the emphasis is not on work but on organized browsing.

## Development

1. Clone/fork the directory 

2. Go to the extensions page of your browser (brave://extensions) and enable "developer mode".

3. Then click "load unpacked" and point it to this directory

4. The extension should then be available in your extensions page

## Chrome Extension Notes

This chrome extension doesn't use any content scripts (scripts that are injected into the webpage that the user is currently browsing).

The default CSP was enough for my needs, it looks something like this...

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; style-src 'self'"
}
```

## Shortcuts

I would love to override the browser's default shortcuts, but I don't think I can.

- `J` -> move one tab to the left of DSM
- `K` -> move one tab to the right of DSM

## Design

You can find the [logo on figma](https://www.figma.com/file/f3AxaotOiuVRECkb7Iqy8k/Dark-Session-Manager-Logo?node-id=0%3A1).

## [License MIT](https://github.com/chris56974/dark-session-manager/LICENSE)

## Attribution

- [Fluid Type Scale](https://www.fluid-type-scale.com/)

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
