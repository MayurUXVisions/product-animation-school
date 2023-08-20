export default function isBreakpoint (name) {
  const breakpoint = _findBreakpoint(name);

  if (!breakpoint) {
    return false;
  }

  let minWidth = null;
  let maxWidth = null;
  let mediaQuery = null;

  if (breakpoint.minWidth && breakpoint.maxWidth) {
    minWidth = `(min-width: ${breakpoint.minWidth}px)`;
    maxWidth = `(max-width: ${breakpoint.maxWidth}px)`;
    mediaQuery = `${minWidth} and ${maxWidth}`;
  } else if (!breakpoint.minWidth && breakpoint.maxWidth) {
    maxWidth = `(max-width: ${breakpoint.maxWidth}px)`;
    mediaQuery = maxWidth;
  } else if (breakpoint.minWidth && !breakpoint.maxWidth) {
    minWidth = `(min-width: ${breakpoint.minWidth}px)`;
    mediaQuery = minWidth;
  }

  return window.matchMedia(mediaQuery).matches;
}

/**
 * Ensure the breakpoints are the same as in css
 */
function _findBreakpoint (name) {
  const breakpoints = [
    { name: 'mobile', minWidth: null, maxWidth: 599 },
    { name: 'tablet', minWidth: 600, maxWidth: 1023 },
    { name: 'desktop', minWidth: 1024, maxWidth: null },

    // Edge cases
    // { name: 'nav-mobile', minWidth: null, maxWidth: 1340 },
    // { name: 'small-tablet', minWidth: null, maxWidth: 767 }
  ];

  for (const breakpoint of breakpoints) {
    if (breakpoint.name === name) {
      return breakpoint;
    }
  }

  return null;
}
