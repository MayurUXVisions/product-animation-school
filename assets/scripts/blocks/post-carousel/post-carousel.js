function widthCounter() {
  var winWidth = window.innerWidth || document.documentElement.clientWidth;
  var conWidth = document.querySelector(".container").offsetWidth;
  var countWidth = winWidth - conWidth;
  var count2 = parseInt(countWidth / 2) - 15;

  var containerLeft = document.querySelectorAll(".container-left");
  var containerRight = document.querySelectorAll(".container-right");

  containerLeft.forEach(function(containerLeft) {
    if (containerLeft) {
      containerLeft.style.paddingLeft = count2 + 70 + "px";
    }
  });

  containerRight.forEach(function(containerRight) {
    if (containerRight) {
      containerRight.style.paddingRight  = count2 + 70 + "px";
    }
  });

  
}

window.addEventListener("load", widthCounter);
window.addEventListener("resize", widthCounter);
