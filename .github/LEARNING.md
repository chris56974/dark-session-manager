## Moving Tabs Programmatically

I thought there'd be a web API for navigating to different tabs since we already have `window.location.href = foo.com`. 
But outside of chrome extensions, there isn't one because that would be a security vulnerability it turns out
Kudos to this thread on SO https://stackoverflow.com/questions/46285381/change-chrome-tab-with-javascript

## DOM Manipulation 

You can see it at this commit here c8ac39d65eed6e4e596c5f1dffef0fb7604e93df. But I ran into an issue where my `window.onload` event and my `window.onfocus` event were firing at the same time. Which means my handlers for those events were mutating the DOM at the same time. This caused unexpected behaviour and I was getting both their output at the same time (when only one should prevail). I fixed it by not mutating it, but by replacing it. I think this is similar to React [Reconciliation](https://reactjs.org/docs/reconciliation.html) but I'm not sure.

## check-js instead of TS

I miss TS a bit. I had to use @ts-ignore a couple of times, but other than that it was okay. 
