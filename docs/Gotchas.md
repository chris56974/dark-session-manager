# Gotchas 

## `this.foo = this.bar.bind(this)` creates a new method for this.foo (it doesn't reuse this.bar) 

> In vanilla ES5, you have to be careful when defining methods that use `this` alongside event listeners. Because `this` refers to whatever calls the method (HTMLButton) and not the class instance itself. 

In order to fix what `this` points to, you might bind it i.e. `this.foo = this.bar.bind(this)`. This fixes the `this` problem, but if you don't bind it in the constructor you could get code that looks like this...

```js
constructor() {
  this.p = <p>hi</p>
}
connectedCallback() {
  // this.bar.bind(this) is a new function!
  this.p.addEventListener('click', this.bar.bind(this))
}

disconnectedCallback() {
  // this.bar.bind(this) is also a new function! It's not the same this.bar.bind(this)!
  this.p.removeEventListener('click', this.bar.bind(this))
}
```

So you can't remove the event listener. You have to do this instead.

```js
constructor() {
  this.p = <p>hi</p>
  this.foo = this.bar.bind(this)
}
connectedCallback() {
  this.p.addEventListener('click', this.foo)
}

disconnectedCallback() {
  this.p.removeEventListener('click', this.foo)
}
```

Or you have to make this.bar an ES6+ class field.

## `display: none;` can prevent transitions from happening

## If see child elements outside of their parent element, you're writing invalid HTML 

This happens when you do stuff like nest a button inside a button, which is not allowed.

## ::-webkit-scrollbar-anything will not work until you change SOMETHING inside ::-webkit-scrollbar {}

https://stackoverflow.com/questions/44212713/styling-webkit-scrollbar-track-not-working