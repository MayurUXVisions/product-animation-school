import '~styles/blocks/hero/index.scss';

// Detect Device
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.body.classList.add("ios");
} else if (/Android/i.test(navigator.userAgent)) {
  document.body.classList.add("android");
} else {
  document.body.classList.add("other");
}