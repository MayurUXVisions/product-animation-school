// Polyfill (for Safari, mainly)
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

/**
 * This utility allows smooth scrolling to an element (using anchor tags) with
 * the ability of adding an offset that prevents the item (to be scrolled) from
 * being hidden by any elements fixed to the top of the page (i.e. header navs,
 * secondary navs, wp admin bars, ...).
 *
 * The offset is calculated by two separate functions depending on the scroll
 * direction, as sometimes the fixed elements might hide/reveal depending
 * on scroll direction.
 *
 * HOW TO USE:
 *
 * Add a data attribute to elements on the page that are fixed (i.e. header navigation),
 * specifying whether they are visible when scrolling up, scrolling down or both.
 *
 *    // Options are: up | down | all
 *    data-anchor-scroll-direction="all"
 *
 * Example:
 *
 *  <header class="header-nav" data-anchor-scroll-direction="up">
 *    ...
 *  </header>
 *
 *  <div class="secondary-nav" data-anchor-scroll-direction="all">
 *    ...
 *  </div>
 *
 * OVERRIDING CORE FUNCTIONS
 * If you want to add a custom function to calculate the offset you can completely
 * override them by passing in the new functions as params in the .init() method.
 *
 * - - - - - - - - - - -
 *
 *
 * Safari doesn't like smooth scrolling, so you need to include a polyfill.
 * - https://www.npmjs.com/package/smoothscroll-polyfill
 *
 *
 * Inspired by:
 * - https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
 *
 * Alternatives:
 * - Scroll into view (js) - https://caniuse.com/?search=scrollIntoView
 *
 * Scroll behavior (css) - https://caniuse.com/?search=scroll-behavior
 *
 * Other smooth scrolling techniques - https://css-tricks.com/snippets/jquery/smooth-scrolling/
 */
export default {
  _offsetFunctions: {

    /**
     * Offset function to run when scrolling up
     *
     * Offset is the combined height of any elements fixed to the top of the page when scrolling up.
     * This prevents the scrolled item to be hidden by the fixed elements.
     */
    scrollUpOffsetFn: () => {
      let offset = 0;

      if ( document.querySelectorAll('*[data-anchor-scroll-direction="up"]').length > 0 ) {
        document.querySelectorAll('*[data-anchor-scroll-direction="up"]').forEach(node => {
          offset += node.clientHeight;
        });
      }

      if ( document.querySelectorAll('*[data-anchor-scroll-direction="all"]').length > 0 ) {
        document.querySelectorAll('*[data-anchor-scroll-direction="all"]').forEach(node => {
          offset += node.clientHeight;
        });
      }

      // Page has WP Admin bar
      if ( document.getElementById('wpadminbar') ) {
        offset += document.getElementById('wpadminbar').clientHeight;
      }

      return offset;
    },

    /**
     * Offset function to run when scrolling down
     *
     * Offset is the combined height of any elements fixed to the top of the page when scrolling down.
     * This prevents the scrolled item to be hidden by the fixed elements.
     */
    scrollDownOffsetFn: () => {
      let offset = 0;

      if ( document.querySelectorAll('*[data-anchor-scroll-direction="down"]').length > 0 ) {
        document.querySelectorAll('*[data-anchor-scroll-direction="down"]').forEach(node => {
          offset += node.clientHeight;
        });
      }

      if ( document.querySelectorAll('*[data-anchor-scroll-direction="all"]').length > 0 ) {
        document.querySelectorAll('*[data-anchor-scroll-direction="all"]').forEach(node => {
          offset += node.clientHeight;
        });
      }

      // Page has WP Admin bar
      if ( document.getElementById('wpadminbar') ) {
        offset += document.getElementById('wpadminbar').clientHeight;
      }

      return offset;
    }
  },

  init(scrollUpOffsetFn, scrollDownOffsetFn) {
    // Override function
    if ( typeof scrollUpOffsetFn !== 'undefined' ) {
      this._offsetFunctions.scrollUpOffsetFn = scrollUpOffsetFn;
    }

    // Override function
    if ( typeof scrollDownOffsetFn !== 'undefined' ) {
      this._offsetFunctions.scrollDownOffsetFn = scrollDownOffsetFn;
    }

    this.setEvent();
  },

  setEvent() {
    // Targets any anchor tag on the page, including any new ones added dynamically
    document.querySelector('body').addEventListener('click', (e) => {
      if ( e.target.nodeName === 'A' ) {
        const href = e.target.getAttribute('href');

        // Not an anchor link, allow default link behaviour
        if ( href.indexOf('#') === -1 ) {
          return;
        }

        const id = href.split('#')[1];
        const currentScrollPos = parseInt(window.scrollY);
        const element = document.getElementById(id);
        const elementTopPos = parseInt(element.getBoundingClientRect().top);

        const directionToScroll = elementTopPos < 0
          ? 'up'
          : 'down'
        ;

        const yOffset = directionToScroll === 'up'
          ? this._offsetFunctions.scrollUpOffsetFn()
          : this._offsetFunctions.scrollDownOffsetFn()
        ;

        // Position to scroll on the page
        const y = elementTopPos + currentScrollPos - yOffset;

        window.scrollTo({top: y, behavior: 'smooth'});

        // Adding the anchor id to the url would make browser scroll behaviour to override this function
        // window.location.hash = href;

        e.preventDefault();
      }
    });
  }
};
