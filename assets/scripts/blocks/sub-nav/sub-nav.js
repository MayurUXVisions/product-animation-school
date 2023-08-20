
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', sticky_relocate);
  sticky_relocate();
});
          
function sticky_relocate() {
  if (!document.querySelector('#sticky-anchor')) return;
  var window_top = window.pageYOffset;
  var div_top = document.querySelector('#sticky-anchor').getBoundingClientRect().top + window.pageYOffset;
  if (window_top > div_top) {
    document.querySelector('.sub-nav').classList.add('stick');
  } else {
    document.querySelector('.sub-nav').classList.remove('stick');
  }
}

// Search Bar JS
const search = document.querySelector('.submenu-list');
const btn_hambuger = document.querySelector('.sub-nav__hambuger');

const node = document.querySelector('.submenu-list');
let isCursorInside = false;

if ( document.querySelector('.sub-nav__hambuger') ) {
  btn_hambuger.addEventListener('click', () => {
    search.classList.toggle('active');
    search.classList.toggle('disable');
  });

  node.addEventListener('mouseover', function() {
    isCursorInside = true;
  });

  node.addEventListener('mouseout', function() {
    isCursorInside = false;
  });

  document.addEventListener('click', function() {
    if(!isCursorInside) {
      search.classList.remove('active');
      
    }
  });
}