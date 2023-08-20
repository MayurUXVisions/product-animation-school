import '~styles/blocks/image-hero/index.scss';

// Detect Device
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.body.classList.add("ios");
} else if (/Android/i.test(navigator.userAgent)) {
  document.body.classList.add("android");
} else {
  document.body.classList.add("other");
}

// Get the element you want to add the class to
const targetElement = document.querySelector('.image-hero');

// Function to add the class
function addClassOnScroll() {
  // Get the current scroll position
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Calculate the scroll position in viewport height units
  const scrollPositionVh = scrollPosition / window.innerHeight * 100;

  // Check if the scroll position is greater than or equal to 100vh
  if (scrollPositionVh >= 100) {
    // Add the desired class to the target element
    targetElement.classList.add('image-hero__hide');
  } else {
    // Remove the class if the scroll position is less than 100vh
    targetElement.classList.remove('image-hero__hide');
  }
}

// Attach the event listener to the scroll event
window.addEventListener('scroll', addClassOnScroll);


/*function adjustHeight() {
  // Get the viewport height
  var viewportHeight = window.innerHeight; // Subtract 10 pixels

  // Select the elements you want to apply the height to
  var elements = document.querySelectorAll('.image-hero, .image-hero__sticky, .image-hero__img_block, .image-hero__flex');

  // Apply the adjusted viewport height to the selected elements
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.height = viewportHeight + 'px';
  }
}

// Call the adjustHeight function initially
adjustHeight();

// Attach an event listener to the resize event
window.addEventListener('resize', adjustHeight); */