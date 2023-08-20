LARAVEL MIX
===========

<small>**Last updated on 23/02/2023**</small>

### Index

1) Overview
2) Hot module reload (HMR)
3) Aliases
4) Static files
5) Code-splitting
6) Browser support / Polyfills
7) Modernizr / Detectizr
8) Linters

<hr>

### 1) Overview
We have updated to Laravel Mix 6 and set up the project to take advantage of multiple new features that will improve both website performance and developer workflow.

** **INSTALLATION NOTE** **

At the moment there's an issue installing `package.json` with Yarn. Please install using NPM by running `npm install`. You can use Yarn/NPM for any other commands.

Please open `.env.example` and notice the new variables:

    # Indicates whether Hot Module Reload is running or not
    # Possible values: on | off
    WEBPACK_HMR=on
    
    # Path to generated assets relative to public folder (must start, but not end, with slashes)
    PUBLIC_PATH_TO_ASSETS='/app/themes/__THEME_NAME__/dist'
    
    # Name of theme in use
    THEME_NAME='__THEME_NAME__'

Please replace `__THEME_NAME__` accordingly, the variables will be used by Laravel Mix.

Please set `WEBPACK_HMR` to `on` if you want to use Hot Module Reload feature (see Laravel Mix updates) and `off` when you finished using it.

---

Please open `composer.json` and see the new entry:

    (...)
    "autoload": {
        "psr-4": {
            "Theme\\": "web/app/themes/__THEME_NAME__/lib"
        }
    }
    (...)

Please replace `__THEME_NAME__` accordingly and then run in the terminal:

    lando composer dump-autoload

This will load namespaces of some of our new object-oriented services.

<hr>

### 2) Hot Module Reload (HMR)
This feature detects any changes you make to images, `.scss` and `.js` files and automatically re-compiles all the assets exactly as `yarn run watch` does. The big difference is that it also applies the css changes instantly on your browser without having to refresh the page. Javascript changes do require a browser refresh, but this feature will do it automatically for you.

To enable this feature you need to:

1) Update the following variable in `.env`:

       # Indicates whether Hot Module Reload is running or not
       # Possible values: on | off
       WEBPACK_HMR=on

2) Then in the terminal run:

       yarn run dev-server

**PLEASE NOTE** - If you find that can't see any styles applied to your website, chances are the variable is turned off.

<hr>

### 3) Aliases
Aliases are a Webpack feature that solves the problem of using relative paths when referencing files inside `.scss`, `.js` or `.vue` files. This is specially important when including images in `.scss` or `.vue` files, as they require different relative paths which can be confusing.

In `webpack.mix.js` please notice the new aliases:

    .alias({
        '@': path.join(__dirname, 'assets'),
        '~scripts': path.join(__dirname, 'assets', 'scripts'),
        '~styles': path.join(__dirname, 'assets', 'styles'),
        '~img': path.join(__dirname, 'assets', 'img'),
        '~fonts': path.join(__dirname, 'assets', 'fonts'),
    })

Each one points to the root folder of each asset type (scripts, images, styles, static) under the `/assets/` folder. Because of this, if you use aliases in `.scss` and `.vue` you will always get the correct path regardless of how deep the folder structure is. 

Since they are so useful, aliases should always be used when referencing files in `.scss`, `.js` or `.vue`. 

Example usage to reference an image in two different files, `.scss` and `.vue`:

    # Exampe location: /assets/styles/components/global/logo.scss

    .logo {
        background-image: url("~img/logo.png");
    }

<hr>

    # Exampe location: /assets/scripts/blocks/header/Header.vue

    <img :src="require('~img/logo.png')">

As you can see in the example, it does not matter if you include the same image on different files with different folder structures. By using the alias `~img` you will always be pointing to the correct location.

<hr>

### 4) Static files
Static assets are images, SVGs and scripts included directly in PHP. Since these assets are included outside `.scss` and `.js` files, Hot Module Reload will not work for them. When compiling assets, Webpack will copy them to the `/dist/` folder. 

To correctly use static files, place all files (images, svgs, scripts) you want to include in `.php` templates inside the `/assets/static/` folder. Then reference them using the new shortcut function:

    <img src="<?= get_static_asset('/img/logo.png') ?>" alt="">

**PLEASE NOTE** They should not be used in `.scss` or `.vue`.  

<hr>

### 5) Code-splitting
This is a very powerful performance feature that allows breaking the main javascript (`main.js`) and css (`style.css`) files, which are usually very large, into multiple and smaller files. The idea is to group the css and javascript related to a given block and split it from the main javascript/css files. We then would include these files only if we use the block on the page.

Because this involves coding blocks in a different way, there is a separate guide specific for this topic. Please see `CODE_SPLITTING.md`.

<hr>

### 6) Browser support / Polyfills
The list of supported browsers is now set in `package.json`:

    "browserslist": [
        "> 1%"
    ],

Webpack plugins will read from this entry, so you don't need to set it in `webpack.mix.js`.

Sometimes Babel won't be able to polyfill for a specific modern javascript feature, for example `IntersectionObserver`. Any JS polyfills you need, please import them in `main.js` at the top of the file.

<hr>

### 7) Modernizr / Detectizr
To detect the browser, its features or operating system it is easier to include a robust library rather than trying to learn how to handle the detection. The two libraries are merged into 1 file which is un-managed by Webpack and must be included separately in Wordpress like so:

    // Modernizr + Detectizr (should be loaded before main script so that feature detection is done first)
    wp_register_script( 'plugins_script', get_stylesheet_directory_uri() . '/dist/static/modernizr-detectizr.min.js', array(), '1.0.0', true );
    wp_enqueue_script( 'plugins_script' );

This will be commented out by default, if you need to use it then uncomment it.

<hr>

#### 4.7) Linters
Laravel Mix is using ESlint and Stylelint to lint `.js` and `.scss` respectively. They are set up to auto-fix issues when they can. This includes automatically re-ordering css rules and VueJs component structure.

The rules in place help us to follow best practices and to code in a consistent way. This prevents bugs and code duplication. The rules should **NOT** be removed or disabled, unless you have a very strong reason to do so. If you do, please communicate it to us before disabling it.

<hr>

End