/**
 * Creates and adds script tag to bottom of the page.
 *
 * Features:
 * - scripts are added only once (no duplicates)
 * - event dispatched after script loaded, to notify any component that is listening
 */
export default {
  /**
   * Custom script
   */
  outputVendorScriptTag(vendorFile) {

    // Prevents duplicates
    if ( this._hasScriptBeenAdded(vendorFile) ) {
      document.dispatchEvent(new Event(vendorFile+':loaded'));
      return;
    }

    const src = window.JS_GLOBALS['vendorFiles'][vendorFile];

    let scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'js_' + vendorFile);
    scriptTag.setAttribute('src', src);
    scriptTag.onload = () => {
      // Dispatches event to notify when script has been loaded
      document.dispatchEvent(new Event(vendorFile+':loaded'));
    };

    document.body.appendChild(scriptTag);
  },

  /**
   * List of custom scripts
   */
  outputVendorScriptTags(vendorFiles) {
    let vendorFilesLoaded = [];

    // Checks if vendor files have already been added (prevents duplicates)
    vendorFiles.forEach(vendorFile => {
      if ( this._hasScriptBeenAdded(vendorFile) ) {
        vendorFilesLoaded.push(vendorFile);
      }
    });

    // Vendor files already added, dispatch event (prevent duplicates)
    if ( vendorFilesLoaded.length === vendorFiles.length ) {
      document.dispatchEvent(new Event('multiple-vendors:loaded'));
      return;
    }

    vendorFiles.forEach(vendorFile => {
      // Skips script that has already been added
      if ( this._hasScriptBeenAdded(vendorFile) ) {
        return;
      }

      const src = window.JS_GLOBALS['vendorFiles'][vendorFile];

      let scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'js_' + vendorFile);
      scriptTag.setAttribute('src', src);
      scriptTag.onload = () => {
        vendorFilesLoaded.push(vendorFile);

        // All scripts added, dispatch event
        if ( vendorFilesLoaded.length === vendorFiles.length ) {
          document.dispatchEvent(new Event('multiple-vendors:loaded'));
        }
      };

      document.body.appendChild(scriptTag);
    });
  },

  /**
   * Google Maps
   */
  outputGoogleMapsScriptTag() {

    // Prevents duplicates
    if ( this._hasScriptBeenAdded('google-maps') ) {
      document.dispatchEvent(new Event('google-maps:loaded'));
      return;
    }

    let scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=__KEY__';
    scriptSrc = scriptSrc.replace('__KEY__', window.JS_GLOBALS['mapsApiKey']);

    let scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'js_google-maps');
    scriptTag.setAttribute('async', 'async');
    scriptTag.setAttribute('defer', 'defer');
    scriptTag.setAttribute('src', scriptSrc);
    scriptTag.onload = () => {
      // Dispatches event to notify when script has been loaded
      document.dispatchEvent(new Event('google-maps:loaded'));
    };

    document.body.appendChild(scriptTag);
  },

  _hasScriptBeenAdded(vendorFile) {
    return document.getElementById('js_' + vendorFile);
  },
};

