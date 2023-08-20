Blocks Guidelines
=================

<small>**Last updated on 31/03/2023**</small>

### Index

1) Shared ACF fields
2) Shared & block-specific CSS classes
3) Block anchor links
4) Container
5) Block preview mode
6) Block preview thumbnails

<hr>

### Please note
You can find an example block configuration under `blocks/example`.

<hr>

### 1) Shared ACF fields
Some options make sense to be shared across multiple blocks, but defining them on each individual block is time-consuming and inefficient.

The function `register_acf_fields_to_all_blocks_with_exceptions()` registers ACF fields on all blocks. This is useful for setting things like options to control vertical spacing of a given block.

If you wish to exclude specific blocks from the shared ACF fields, you can pass an array of block names to the function as per example below:

    register_acf_fields_to_all_blocks_with_exceptions([
        'acf/hero-carousel',
    ]);

<hr>

### 2) Shared & block-specific CSS classes

#### 2.1) Shared CSS classes
Blocks may contain shared styles that we don't want to set inside individual blocks' CSS classes as this leads to code duplication and makes it hard to manage changes. Such styles should instead be defined in a centralised way inside a `.block` class that must be set on all blocks.

Blocks can also share ACF fields (i.e. removing spacing) that set specific CSS styles (and classes) on each block at runtime, which would lead to code duplication if they were set on each block manually.

The solution to better manage shared styles is to automate the CSS setting tasks via the `get_block_default_classes()` function that handles these scenarios automatically for you. You need to pass the `$block` array to the function so it can decide which shared classes need to be applied.

#### 2.2) Block specific CSS classes
Blocks also need specific class names that we can use to target them in CSS and JS (i.e. for code-spliting). The convention to set the class name for JS files is prefixing `js-` to the class name that identifies the block. If a block is called `hero-carousel` then the JS only class should be defined as `js-hero-carousel`.


#### 2.3) Block example
The following example illustrates how a block would look like:

    <section class="the-block-name  js-the-block-name  <?= get_block_default_classes($block) ?>" ...>
        ...
    </section>

You can add any other classes if needed, for example relating to ACF fields of a specific block. But the base block CSS class definition should be as described above.

#### 2.4) Block vertical spacing
Vertical spacing in blocks should be set with top and bottom **padding**. This can be removed when creating the block in admin, via the "Remove Top Spacing" and "Remove Bottom Spacing" options. Custom spacing can then be managed by using our custom **Spacer** block.

There should be no need for setting **margin** on blocks (apart from rare exceptions). If the design calls for margin to be set, then the same behaviour should be preserved when setting "Remove Top Spacing" and "Remove Bottom Spacing" options on the block, both padding and margin should be removed.

<hr>

### 3) Block anchor links
To enable setting an anchor id on a block you must first add the following line when registering it as per example below:

    myCustomBlock([
        ...
        'supports' => array('anchor' => true)
    ]);

Then in the template file you would add:

    <section <?= render_block_anchor_id_attribute($block) ?> class="the-block-name  js-the-block-name  <?= get_block_default_classes($block) ?>">
        ...
    </section>

The function `render_block_anchor_id_attribute()` outputs the `id` attribute with the block's `anchor id`. The `get_block_default_classes()` will automatically add an additional `js-block-anchor` class to identify it as a block with an anchor link.

#### 3.1) Smooth Scrolling
Clicking on anchor links has the common issue with fixed elements on the page (i.e. header nav) where they cover the element we are scrolling to. There's an utility that handles this cases dynamically. Please see `/scripts/utility/anchor-smooth-scroll.js` for instructions on how to use it.

<hr>

### 4) Container
To ensure blocks are laid out on the page consistently we use pre-defined container classes. Please see `/styles/layout/_container.scss` for all available container classes you can use. You can create new container classes as required.

Example:

    <section <?= render_block_anchor_id_attribute($block) ?> class="the-block-name  js-the-block-name  <?= get_block_default_classes($block) ?>">
        <div class="container">
            ...
        </div>
    </section>

<hr>

### 5) Block preview mode
When adding a block in Gutenberg editor the preview mode renders the block by default. In order to display the block correctly we would need to load the block's CSS and JS in Admin. This can cause issues as JS may not be rendered for the block causing it to look broken. It also means we would have to load the front-end assets for all blocks when editing a page. On top of that, each block also runs queries and executes any logic required to display the block. This significantly increases page load time when editing or creating a new post/page in admin.

To solve the performance issue while providing useful feedback to users when adding blocks, a custom render function `product_render_block_callback()` is used when registering blocks instead of loading the block template directly. This allows us to intercept the block render process and display a message containing the block's name during preview mode instead of rendering the block.

To ensure that all registered blocks use this custom render function we need to set it when defining the block using the `defineBlock()` as below example:

    function defineBlock($cat, $icon, $details) {
        // Renders all blocks through our custom function
        $details['render_callback'] = 'product_render_block_callback';
        
        // ...
    }

<hr>

### 6) Block preview thumbnails
In Gutenberg editor, when selecting from a list of blocks we can set a thumbnail that represents the block so the users sees what the block looks like.

TODO - integrate this with product_render_block_callback()

<hr>

End