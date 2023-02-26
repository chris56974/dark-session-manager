## Gotchas 

### foo.bind(this) creates a new function, making it difficult to remove event listeners

I had to use this.method.bind(this) a couple times to make sure that `this` pointed to my web component and not the button that fired the event. What's interesting to note however, is that this.method.bind(this) will create a new function everytime it's called. So it will be impossible to remove that event listener unless you create a reference in the constructor.

### You can 

