# Design Decisions

This doc describes some of the choices I made when developing this extension and why.

## No framework

I thought workona wasn't that fast on browser startup. So that biased my decision to use vanilla JS in this extension. Turns out workona doesn't run locally, it actually makes a web request to [workona.com](https://workona.com/0). This means the performance hit of adding a framework is not that big a deal as I originally thought. I might switch to a framework later if I decide the application is getting complex.

## No typescript

The browser doesn't understand TS, so I would have to re-compile everytime to see any changes. Either that, or I would have to use some live reload thing. All I really want is intellisense for the chrome APIs and TS can provide that for vanilla JS via `checkJs: true`.