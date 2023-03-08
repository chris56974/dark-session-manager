# Gotchas 

## `this.foo = this.bar.bind(this)` creates a new method for this.foo (it doesn't reuse this.bar) 

> In vanilla ES5, you have to be careful when writing event handlers that use `this`. Because `this` refers to whatever calls the callback method (HTMLButton) and not the class instance itself. 

To fix this, you could bind `this` in the constructor via `this.foo = this.bar.bind(this)`. Or you could use class field syntax for the methods. 

I tried to get tricky though and I tried to bind `this` outside of the constructor like this.

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

It had issues though, because I couldn't remove the event listeners and there was no reference to any of the methods in the connectedCallback. So I did this instead

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

## `display: none;` can prevent `transition: foo` from happening

## If you see child elements outside of their parent element, you're writing invalid HTML 

This happens when you do stuff like nest a button inside a button. I ran into this for my color button web component.

## ::-webkit-scrollbar-anything will not work until you change at least ONE property in ::-webkit-scrollbar {}

Just how it is I guess

https://stackoverflow.com/questions/44212713/styling-webkit-scrollbar-track-not-working