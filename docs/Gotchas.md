## Gotchas 

### Web Components 

#### foo.bind(this) creates a new function, making it difficult to remove event listeners

I had to use this.method.bind(this) a couple times to make sure that `this` pointed to my web component and not the button that fired the event. What's interesting to note however, is that this.method.bind(this) will create a new function everytime it's called. So it will be impossible to remove that event listener unless you create a reference in the constructor.

#### Be weary of your selectors when using the transition property

Make sure the selectors match when transitioning scale(0) to scale(1) or something.

##### The display property can also prevent transitions from happening

### You can't nest a button element in a button element

If you ever see child elements appear outside the parent element that they're supposed to be nested under, you're likely writing invalid HTML.