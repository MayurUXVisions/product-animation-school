Coding Guidelines
=================

<small>**Last updated on 03/02/2023**</small>


### Index
1) Overview
2) Base configuration
3) Assets structure
4) Wordpress updates
5) Patterns / best practices
    - 5.1) Javascript
    - 5.2) CSS
    - 5.3) Feature building / code splitting
    - 5.4) API calls
    - 5.5) SVG icons

<hr>

### 1) Overview
As part of our ongoing improvements to our processes we will be making changes to how the code is organised as well as adopting patterns to sure coding is easier, more consistent and efficient. We will be updating this document over time to inform of changes as they come along.

<hr>

### 2) Base configuration
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

### 3) Assets structure
All assets are now located at the root of the project, under `/assets/`. This includes all .sccs, .js, images and fonts. Under this folder you will also find configuration for Laravel Mix plugins in use (i.e. eslint, stylelint).

The `webpack.mix.js`, `package.json` and `package-lock.json` are located at the root of the project, so you now run composer/yarn/npm commands at the same level.

The `/dist/` folder containing all the compiled assets is still located under the theme folder.

<hr>

### 4) Wordpress updates
There are new helper functions:

Laravel Mix related:

    # use to include css locations (in Wordpress wp_register_style())
    get_laravel_mix_style()

    # use to include script locations (in Wordpress wp_register_script())
    get_laravel_mix_script()
    
    # use to include a static file directly in a .php template
    get_static_asset()

<hr>

Utility function in `functions/utility.php`:

    function the_content_with_block_containers(
        $content = '',
        $blockBlacklist = [],
        $ignoreList = [],
        $containerClass = 'container',
        $wysiwygClass = 'wysiwyg'
    )

This function replaces usage of Wordpress `the_content()` as it will add container `div` around core Wordpress blocks related to text (i.e. paragraphs, headings, etc...). This means container styles are applied to a `.container` class and not to typography elements. Typography elements will be targeted by the wrapping `.wysiwyg` class. In 99% of the cases you just call the function like so: `the_content_with_block_containers()`.

All custom blocks created will be ignored and outputted in the normal 'bare' fashion so that they can be fully styled.

<hr>

Utility function in `functions/utility.php`:

    function render_partial(
        string $template,
        array $data = []
    )

This is an alternative function to `component()` with 2 main differences. The first one is that you can include any file under the theme folder. The second is that all variables passed in `$data` array are scoped to the file/partial you are including. This means inside the included file/partial you will only have access to variables passed to, in a similar way as VueJS props work.

#### Example
Let's say you want to include a component in your template file:

    <?= render_partial('components/example/index.php', [
        'var1' => 'some value',
        'var2' => 'some value'
    ]) ?>

Then inside the component you make them available like so:

    <?php
        // The component will only have access to $data variable, which holds everything you passed.
        $var1 = $data['var1'];
        $var2 = $data['var2'];
    ?>

    <div>(...)</div>

<hr>

### 5) Patterns / best practices
The following list of patterns and best practices are aimed to improve code organisation, reducing bugs and improve code re-usability to make coding easier. We encourage you to follow them as much as possible.

#### 5.1) Javascript

- All blocks & components should be included in `main.js`, using code-splitting technique if they are not common/global components.

- Due to code-splitting, `DOMContentLoaded` event listeners should only be used in `main.js`.

- When referencing DOM elements add a class prefixed with `js-` to the html element. This class should not have any styles.

      <div class="slider  js-slider">(...)</div>

- Images should always be referenced using the alias `~img`.

- when creating a component, name the main file as `index.js` instead of the block name.

      Folder structure
      /components/clock-countdown/index.js
        
      Then you can import it like so in .js:
      import './components/clock-countdown'
        
      You  can have other helper files under /components/clock-countdown/

<hr>

#### 5.2) CSS

- Imported/partial `.scss` files have an '_' prefixed, while independent/main files do not.

- Common styles are imported via `style.scss`, block / components should be included directly from `.js` (code-splitting).

- Images should always be referenced using the alias `~img`.

- Prefer re-using classes instead of mixins that create styles (i.e. `.container`, `.btn`, typography...).

<hr>

#### 5.3) Feature building / code splitting

- Think of a feature as something with an Entry Point (index.js, index.scss) and potential partials files that compose the feature (_header.scss, _body.scss).

- If files are getting long, consider breaking them down into smaller partials which you then include in the feature's Entry Point.

- A re-usable, self-contained component/block has a .js file that includes the corresponding .scss file.

- Utilities are normally included in multiple blocks / components, but rarely they need to be included in the `main.js`.

<hr>

#### 5.4) API calls

- API calls should be called via a Service file (i.e. `EventService.js`) that is an object with methods to make the calls:

      import client from '~scripts/plugins/axios-plugin';

      export default {
        fetchAllEvents() {
          return client.get('/example/all');
        },

        (...)
      }


- Axios instance should be defined once and re-used in any service that requires it:

      // inside ~scripts/plugins/axios-plugin, from previous example

      import axios from 'axios';

      const client = axios.create({
        // Register the base url here
        baseURL: '/wp-json/zanders/v1',
        withCredentials: false,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
    
      export default client;

Please see the full example in a VueJS app:

    (...)
    methods: {
        loadEvents() {
          this.loading = true;
            
          // Always use a service to make API calls instead of including Axios and querying logic in the component
          EventService.fetchAllEvents()
            .then((response) => {
              this.events = response.data.items;
            })
            .catch((error) => {
               // handle errors here
            })
            .finally(() => {
              this.loading = false;
            })
          ;
        }
    }
    (...)

In `.php` please see the following example of an endpoint:

    /**
     * Endpoint :: Returns all events
     */
    function fetch_all_events_endpoint(\WP_REST_Request $request)
    {
        $queryParams = $request->get_query_params();
    
        $data = _findAllEvents($queryParams);
    
        return new \WP_REST_Response($data, 200);
    }
    api('example/all', 'fetch_all_events_endpoint');

The endpoint itself should have minimal logic. All query logic should be inside different function(s). Please not the usage of `\WP_REST_Request` to handle params received and `\WP_REST_Response` for the response. This will make it easier and more consistent to receive and return data in an API endpoint.

<hr>

#### 5.5) SVG icons
SVG icons can be imported in multiple contexts, either in CSS, VueJS or PHP. As mentioned in `4.3) Static files`, images imported via PHP need to be located under the `/static/` folder, while images imported by css or js are located under `/img/`. The same applies to SVG's.

In CSS, you can simply include them as background images, they should be located under `/img/` folder:

    .logo {
        background-image: url(~img/icons/logo.svg);
    }

In PHP, the function `getSvg()` calls `get_static_asset()` internally, so SVG's imported this way must be located under `/static/` folder. The function has been to updated to also allow passing class names for the SVG element.

    <?= getSvg('svg/logo.svg', 'svg-icon--logo') ?>

In VueJS, there is a new `SvgIcon.vue` component which holds multiple SVG icons. You can choose which one to include in your template by specifying its `name` as the prop.

Example:

    <template>
        <div>
            <svg-icon name="the-svg-icon-name" />
        </div>
    </template>

    <script>
    import SvgIcon from '~js/components/SvgIcon';
    export default {
        components: {
            SvgIcon,
            ...
        }
    }
    </script>

<hr>

#### 5.6) Image Sizing

Image sizes should be constrained through CSS. We should not be expecting the Content manager to size images to exactly the right size for the space. This is for two reasons; 

- Although preferable, content managers will not always be able to provide the exact right size image, but it should still look as it does in the design. 

- Images need to be 2x or 3x the size of the space to look acceptable on retina or Hi-DPI displays. Having the image fit the space exactly will make them look blurry on these devices. 

Please define image sizes within scss and use Object-fit where necessary to achieve the desired look; 

    .image-container {
        img {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
    }


The end

