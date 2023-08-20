CODE SPLITTING
==============

<small>**Last updated on 03/02/2023**</small>

### Index

1) Description
2) When to code-split functionality
3) Examples

   3.1) Carousel Block (simple example)
   3.2) VueJS component (advanced example)

<hr>

### 1) Description
This is a very powerful Webpack feature that allows splitting functionality into separate code files and only importing them when needed, giving us a performance boost by requiring the browser to download smaller bits of code when required, instead of a big file containing all the code for the entire project.

This is achieved by grouping the css and javascript related to a given block and splitting it from the main javascript (`main.js`) and css (`style.css`) files. We then include these files only if the block is being used on the page.

When using code-splitting, Webpack generates a new and smaller `.js` file (normally named with a number, i.e. `213.js`) that contains the javascript and css code for a given block/component that you are code-splitting. This file will be included automatically on the page, via an AJAX request, when using the `import()` function to import it. Please note that this is different from the normal `import` statement, which directly includes another file during asset compilation.

The end result is a smaller `main.js` and `style.css`, which is always loaded on every page, and new smaller `.js` files that will be included on the page only if they are required.

<hr>

### 2) When to code-split functionality
When working on a feature always ask yourself the question: **Is this a common feature?**

Common features are present on all pages, this includes menus and footers. Such features should be included in the main javascript and css files and not be code-split.

However, if the feature you are building is only required on certain pages (i.e. blocks, components) then you would code-split by including the `.scss` file and any other dependencies inside the block/component's main file (`index.js`) and only import it (using `import()`) when the block/component is present in the DOM.

<hr>

### 3) Examples

#### 3.1) Carousel block (simple example)
Consider the example of a carousel block. You would normally create the `.js` file with the carousel logic and a `.scss` file with its styles. Because the carousel block will only be present on some pages, it needs to be code-split. 

To do this, we first include the block's `.scss` inside its `.js` file, like so:

    ## /scripts/blocks/carousel/index.js

    // Imports the block's styles
    import '~styles/blocks/carousel/index.scss';
    
    // Imports the js for an example plugin this block may require
    import some-plugin from 'carousel-plugin';

    // Execute the logic for this block
    const carousel = new Carousel();
    
    // ...

Since the block's `.scss` is included in the `.js` file, we must make sure it is not being included through `styles.scss`. This also means that the `.scss` will not have access to any mixins, functions or variables (remember we are just including 1 single file). To give access to all mixins, functions and variables we need to include them on top of the `.scss` file like so:

    ## /styles/blocks/carousel/index.scss

    // Includes all mixins, functions and variables
    @import "~styles/config";

    .carousel {
        // ...
    }

This will provide access to everything the file may need in a very efficient way, since nothing inside the `/config/` folder generates css.

The final piece of the code-split lifecycle is to conditionally import the block's `.js` and `.css` only when the block is present in the DOM. To do this, we do the following in `main.js` file:

    if ( document.querySelector('.js-carousel') ) {
      import('./blocks/carousel');
    }

By using the `import` statement as a function, Webpack will do 2 things:

1) Create a new file containing all the `.css` and `.js` the block needs (i.e. `325.js`)
2) Transform `import('./blocks/carousel')` into a function that loads the newly generated file asynchronously (AJAX), only if the `.js-carousel` exists in the DOM.

You don't need to do anything else, by coding the block this way Webpack will know which files to extract and when to include them on the page.


#### 3.2) VueJS component (advanced example)
Consider the following example of a VueJS app for a clock countdown component. First we create an `index.js` under `./components/clock-countdown/` that holds the initialisation logic for our component, as well as styles.

    import Vue from 'vue';
    import ClockCountdown from './App.vue';
    import '~styles/components/clock-countdown/index.scss';

    new Vue({
      el: '#clock-countdown',
      components: {
        ClockCountdown
      }
    });

Then in our `main.js` file we **conditionally import** the code we just wrote, like so:

    if ( document.getElementById('clock-countdown') ) {
      import('./components/clock-countdown');
    }

If you need to execute some logic AFTER the file is imported, know that the `import()` function returns a `Promise` and you can hook to it to execute the custom logic, like so:

    if ( document.getElementById('clock-countdown') ) {
      import('./components/clock-countdown').then(() => {

        // custom logic executed after file is included
        // ...

      });
    }

If the file you are importing is a Class or an Object, know that it is passed as the argument in the `.then()` callback, like so:

    if ( document.getElementById('clock-countdown') ) {
      import('./components/clock-countdown').then((component) => {

        // if component is a Class
        new component.default();

        // else if component is an Object
        component.default.methodName();
      });
    }

<hr>

End
