# [Dark Session Manager (DSM)](https://github.com/chris56974/dark-session-manager)

DSM is a session manager inspired by [Workona](https://workona.com/), except the emphasis is not on work but on organized browsing. They do a bunch of other stuff that I don't plan on doing like cloud integrations (Figma, GCloud, Zoom), [universal search](https://workona.com/help/search/), [templates](https://workona.com/templates/),[mobile apps](https://workona.com/help/mobile-support/), etc. So check them out instead if you want all that. 

## Basics

This extension only uses a single extension page (app/dsm.html). It doesn't use any content scripts, which are scripts that get injected to the webpage the user is browsing. The default CSP does everything I need, it only loads scripts and styles from the same origin.

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; style-src 'self'"
}
```

## Shortcuts

I would love to override the browser shortcuts but I don't think I can.

- `J` -> move left one tab
- `K` -> move right one tab

## Design 

You can find the [logo at figma](https://www.figma.com/file/f3AxaotOiuVRECkb7Iqy8k/Dark-Session-Manager-Logo?node-id=0%3A1).

## License

MIT

## Attribution 

- [Fluid Type Scale](https://www.fluid-type-scale.com/)
