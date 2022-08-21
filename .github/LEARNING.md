## Moving Tabs Programmatically

I thought there'd be a web API for navigating to different tabs since we already have `window.location.href = foo.com`. 
But outside of chrome extensions, there isn't one because that would be a security vulnerability it turns out
Kudos to this thread on SO https://stackoverflow.com/questions/46285381/change-chrome-tab-with-javascript

## DOM Manipulation 

You can see it at this commit here. But I ran into an issue where my `window.onload` event and my `window.onfocus` event were firing at the same time.  Which means my handlers for those events were mutating the DOM at the same time. This caused unexpected behaviour and I was getting both their output at the same time (when only one should prevail). 
