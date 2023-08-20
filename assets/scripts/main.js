// This is the webpack entry point
// Refrain from putting actual code in here and just import the modules you need;

import VendorScriptLoader from './utility/vendor-script-loader';
import LazyLoad from './utility/lazy-load';
import '~scripts/fonts.js';
import '~scripts/blocks/sub-nav/sub-nav';
import '~scripts/blocks/post-carousel/post-carousel';
import '~scripts/components/global/gravity-custom-select/custom-select';
import NavMenu from './components/global/nav-menu';
/**
 * Code-splitting :: Blocks
 *
 * Manages blocks that should load dynamically (only when they exist in the DOM)
 * using Webpack's code-splitting feature.
 */
function registerBlocks() {
  if (document.querySelector(".hero_section")) {
    import("~scripts/blocks/hero");
  }

  if (document.querySelector(".interactive-map")) {
    document.addEventListener("multiple-vendors:loaded", () => {
      import("~scripts/blocks/interactive-map");
    });

    VendorScriptLoader.outputVendorScriptTags(["vendor-vue"]);
  }

  if (document.querySelector(".double-image-carousel")) {
    import("~scripts/blocks/double-image-carousel");
  }

  if (document.querySelector(".image-text-block")) {
    import("~scripts/blocks/standard-image-text");
  }

  if (document.querySelector(".text_image_columns")) {
    import("~scripts/blocks/text-image-columns");
  }

  if (document.querySelector(".custom-title")) {
    import("~scripts/blocks/custom-title");
  }

  /*if (document.querySelector(".hero_image_section")) {
    import("~scripts/blocks/hero-image-section");
  }*/

  if (document.querySelector(".single_post")) {
    import("~scripts/blocks/case-study-post");
  }

  if (document.querySelector(".post_carousel")) {
    import("~scripts/blocks/post-carousel");
  }

  if (document.querySelector(".image-hero")) {
    import("~scripts/blocks/image-hero");
  }

  /*if (document.querySelector(".multiple-image-text")) {
    import("~scripts/blocks/multiple-image-text");
  }*/

  if (document.querySelector(".two-text-columns")) {
    import("~scripts/blocks/two-text-columns");
  }

  if (document.querySelector(".cta-buttons")) {
    import("~scripts/blocks/cta-buttons");
  }

  if (document.querySelector(".plain-hero")) {
    import("~scripts/blocks/plain-hero");
  }

  if (document.querySelector(".sub-nav")) {
    import("~scripts/blocks/sub-nav");
  }

  if (document.querySelector(".contact_us")) {
    import("~scripts/blocks/contact-us");
  }

  if (document.querySelector(".donate-block")) {
    import("~scripts/blocks/donate-block");
  }

  if (document.querySelector(".statistics")) {
    import("~scripts/blocks/statistics");
  }

  // if ( document.querySelector('.interactive-map') ) {
  //   // Loads component only after vendor file is loaded
  //   document.addEventListener('google-maps:loaded', () => {
  //     // alert('Google Maps loaded');
  //   });

  //   VendorScriptLoader.outputGoogleMapsScriptTag();
  // }

  if (document.getElementById("feed")) {
    // Loads component only after vendor files are loaded
    document.addEventListener("multiple-vendors:loaded", () => {
      import("~scripts/blocks/feed");
    });

    VendorScriptLoader.outputVendorScriptTags(["vendor-vue", "vendor-vuex"]);
  }
}
/**
 * Code-splitting :: Components
 *
 * Manages components that should load dynamically (only when they exist in the DOM)
 * using Webpack's code-splitting feature.
 */
function registerComponents() {
  if (document.querySelector(".js-video-autoplay")) {
    import("~scripts/components/video/video-autoplay").then((component) => {
      component.default.init();
    });
  }
}

/**
 * Code-splitting :: Template pages
 *
 * Loads styles for specific template pages dynamically (only when they exist in the DOM)
 * using Webpack's code-splitting feature.
 */
function registerTemplatePages() {
  // Example
  // // Single Event page
  // if ( document.querySelector('.single-event') ) {
  //   import('~styles/templates/single-event.scss');
  // }
}


/**
 * DOMContentLoaded events should be listened to on this file only.
 */
document.addEventListener("DOMContentLoaded", registerBlocks);
document.addEventListener("DOMContentLoaded", registerComponents);
document.addEventListener("DOMContentLoaded", registerTemplatePages);

/**
 * Load common components here
 */
document.addEventListener("DOMContentLoaded", () => {
  // Example
  // // Initiates Header Nav Menu
  NavMenu.init();

  // Applies lazy-loading to images on the page
  LazyLoad();
}); 