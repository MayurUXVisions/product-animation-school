SCSS GUIDE
==========

<small>**Last updated on 03/02/2023**</small>

### Index

1) BEM class naming convention
2) Global styles vs scoped styles
3) .SCSS file naming convention
4) Responsive rules (TODO)
5) Container rules (TODO)
6) WYSIWYG rules (TODO)
7) Useful Mixins (TODO)

<hr>

### 1) BEM class naming convention
BEM stands for Block, Element, Modifier. A block is a distinct piece of HTML markup. An element is a distinct HTML element within that block. A modifier is an optional argument to override one or a couple of CSS rules through declaration of an additional class.
  
Blocks are separated from elements by double underscores (__), and modifiers are separated from elements by double hyphen characters (--). A BEM class should always have one block, optionally a maximum of one element, and also optionally (but way less frequently) have a modifier.

#### Example
Imagine that we have a simple nav-bar. Following the BEM naming convention, we could arrive at a solution like this:

    <nav class="nav-bar">
        <a href="/" class="nav-bar__logo-link">
            <img src="logo.jpg" class="nav-bar__logo-image" alt="Navigate to home page">
        </a>
        <ul class="nav-bar__container">
            <li class="nav-bar__menu-item  nav-bar__menu-item--active">
                <a href="/" class="nav-bar__menu-link">Home</a>
            </li>
            <li class="nav-bar__menu-item">
                <a href="/about" class="nav-bar__menu-link">About</a>
            </li>
            <li class="nav-bar__menu-item">
                <a href="/contact" class="nav-bar__menu-link">Contact</a>
            </li>
        </ul>
    </nav>

Please read online documentation for this convention:
- https://getbem.com/naming/

<hr>

### 2) Global styles vs scoped styles
Global styles affect every element and block on the page, so they should only be used for setting base and common styles. 99% of the time you will define styles specifying the block or component first.

For example, typography can have global styles that set the base color, font-family and size. But then a given heading or paragraph might need to look differently inside a given block. Always set the block-specific styles inside their file, like so:

    .some-block {
        h2 {
            color: red; // overrides base colour
        }

        p {
            font-weight: $f-bold; // overrides base font-weight
        }
    }

This is specially important for typography rules that should only be applied to WYSIWYG elements, normally via `.wysiwyg` class.

    <div class="wysiwyg">
        <h1>The main heading</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid consectetur facilis pariatur repellat ut.</p>
        <p><a href="/">Home page</a></p>
        <p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        </p>
    </div>

The `.wysiwyg` class will hold all the styles:

    .wysiwyg {
        h1 { /* styles go here */ }
        
        h2 { /* styles go here */ }

        // ...
        
        p { /* styles go here */ }

        a { /* styles go here */ }

        ul { /* styles go here */ }

        // ...
    }

This allows us to apply different typography styles to different elements:

    <div class="some-block">
        <h2>Block name</h2>
        <p>These typography elements will inherit the global styles and any overrides defined in .some-block.</p>
    </div>

    <div class="wysiwyg">
        <h2>Content from WYSIWYG editor</h2>
        <p>These typography elements will inherit the global styles and any overrides defined in .wysiwyg, which will be different than the ones in .some-block.</p>
    </div>

<hr>

### 3) .SCSS file naming convention
We can better name files by organising them into 2 categories. Entry points and partials.

The `entry point` is the main file we want to import, for example the `style.scss` which holds all the common css.

The `partial` is a file that is included in another file (its dependency). For example, all files included in `style.scss` are partials (or dependencies of `style.scss`). Partials should be named with an underscore as the prefix. For example:

    main-file.scss
    _some-partial.scss

When code-splitting a block/component, its `.scss` file becomes the `entry point`, so it should be named as the following example:

    /assets/styles/blocks/carousel/carousel.scss

    or

    /assets/styles/blocks/carousel/index.scss

Defining the `entry point` as `index.scss` is another convention, similarly to `index.html` or `index.php`. Webpack will recognise this pattern and when importing the file you can omit the `index.scss` bit as per example:

    @import '~styles/config';

    // this is the same as @import '~styles/config/index';

**PLEASE NOTE:** When importing `.scss` files in javascript you always need to specify the full path, even if they are entry points named as `index.scss`.

    ## inside example javascript file that is code-split

    import '~styles/blocks/carousel/index.scss';

<hr>

### 4) Responsive rules (TODO)

<hr>

### 5) Container rules (TODO)

<hr>

### 6) WYSIWYG rules (TODO)

<hr>

### 7) Useful Mixins (TODO)

<hr>

End