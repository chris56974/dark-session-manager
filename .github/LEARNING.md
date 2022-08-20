## No dedicated tab for chrome extensions

Chrome extensions have popup.html and options.html but no landing.html it seems.

## Content Script vs Background Script

You use content scripts to manipulate and respond to the DOM of a particular webpage
You use background scripts to respond to events and for APIs
My dsm.js file is not a content script, it's another background script I think

## Content Script Stuff

Content scripts live in an "isolated world". An isolated world is a private execution environment that isn't accessible to the webpage or to other extensions. This means JS variables in a content script is not visible to the host page.

## Gotcha

```js
chrome.windows.onCreated.addListener(async () => {
  await chrome.tabs.create({
    url: "pages/dsm.html",
    active: false,
    pinned: true,
    index: 0,
  });
  await chrome.runtime.sendMessage("bg.js -> dsm.js");
});
```

## Can't use JS to move to the next tab programmatically

I thought it would be easy to navigate to the next tab via JS but it looks like it's disallowed for security reasons.

It makes a lot of sense, interesting to think about.

https://stackoverflow.com/questions/46285381/change-chrome-tab-with-javascript
