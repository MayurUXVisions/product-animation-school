import '~styles/components/video/video-autoplay.scss';

// Polyfill
import 'intersection-observer';
import isBreakpoint from '~scripts/utility/media-query';
import _debounce from 'lodash.debounce';


/**
 * Loads and autoplays videos as they appear in the viewport.
 *
 * Intersection Observer tutorial
 * https://www.youtube.com/watch?v=gQ8WggeHoJU
 */
const VideoAutoplay = {
  _selectors: {
    iframeWrapper: '.js-video-autoplay-iframe-wrapper'
  },

  _currentBreakpoint: 'desktop',

  _options: {
    root: null,
    rootMargin: "0px 0px",
    threshold: 0.05
  },

  _observer: null,

  init() {
    // Keeps track of current breakpoint to prevents replacing videos if no breakpoint change has occurred
    this._currentBreakpoint = isBreakpoint('mobile')
      ? 'mobile'
      : 'desktop'
    ;

    // Registers observer
    this._observer = new IntersectionObserver(VideoAutoplay.intersectionCallback, this._options);

    /**
     * Event :: observe video blocks
     */
    document.querySelectorAll('.js-video-autoplay-iframe-wrapper').forEach(node => {
      VideoAutoplay._observer.observe(node);
    });

    /**
     * Event :: browser resize
     */
    window.onresize = _debounce(() => {
      VideoAutoplay.handleResize();
    }, 200);
  },

  /**
   * Callback function for when intersection happens
   */
  intersectionCallback(entries) {
    entries.forEach(entry => {
      if ( entry.isIntersecting && !entry.target.classList.contains('video-loaded') ) {
        VideoAutoplay.replaceVideoIframe(entry.target, VideoAutoplay._currentBreakpoint);
        VideoAutoplay._observer.unobserve(entry.target);
      }
    });
  },

  /**
   * Replaces video according to breakpoint
   */
  replaceVideoIframe(iframeWrapperEl, currentBreakpoint) {
    // If no mobile version available, shows desktop
    if ( iframeWrapperEl.getAttribute('data-video-mobile') === '' ) {
      currentBreakpoint = 'desktop';
    }

    // Replaces iframe
    iframeWrapperEl.innerHTML = JSON.parse( iframeWrapperEl.getAttribute('data-video-' + currentBreakpoint) );

    // Marks as video loaded and stops observing to avoid loading multiple times the iframe
    iframeWrapperEl.classList.add('video-loaded');
  },

  /**
   * Callback function for resize event
   */
  handleResize() {
    if (isBreakpoint('mobile')) {
      if (this._currentBreakpoint === 'mobile') {
        // No breakpoint change, do nothing
        return;
      }

      this._currentBreakpoint = 'mobile';
    }
    // Defaults to desktop breakpoint
    else {
      if (this._currentBreakpoint === 'desktop') {
        // No breakpoint change, do nothing
        return;
      }

      this._currentBreakpoint = 'desktop';
    }

    // Loops through all blocks on the page
    document.querySelectorAll(this._selectors.iframeWrapper).forEach(node => {
      // Replaces video on the ones which already loaded and are playing
      if ( node.classList.contains('video-loaded') ) {
        VideoAutoplay.replaceVideoIframe(node, VideoAutoplay._currentBreakpoint);
      }
    });
  }
};

export default VideoAutoplay;
