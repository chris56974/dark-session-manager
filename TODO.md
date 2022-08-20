I have to add my content scripts to the manifest.json 
https://developer.chrome.com/docs/extensions/mv3/content_scripts/#static-declarative

leave a comment here if this fixes my problem
https://stackoverflow.com/questions/9106519/port-error-could-not-establish-connection-receiving-end-does-not-exist-in-chr


"content_scripts": [
  {
    "matches": [
      "chrome-extension://hhmaoaobfenfigibpjglhdelfdfnjnip/pages/dsm.html"
    ],
    "css": [
      "pages/dsm.css"
    ],
    "js": [
      "pages/dsm.js"
    ]
  }
],