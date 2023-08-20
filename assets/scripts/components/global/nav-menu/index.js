import Headroom from "headroom.js";
import MobileMenu from "./mobile-menu";

const NavMenu = {
  _selectors: {
    donateButton: ".js-donate",
    topContainer: ".js-top-level",
    menu: ".js-desktop-nav-menu",
    menuItemTopLevel: ".js-nav-menu-item-top-level",
  },

  init() {
    // Initialises Headroom.js
    const headroom = new Headroom(
      document.querySelector(this._selectors.topContainer),
      {
        tolerance: {
          // Gives a bit of margin when scrolling up before showing the menu
          up: 0,
          down: 0,
        },
      }
    );
    headroom.init();

    window.addEventListener("resize", () => {
      this.resetSubmenuPosition();
    });

    document
      .querySelector(this._selectors.menu)
      .querySelectorAll(this._selectors.menuItemTopLevel)
      .forEach((node) => {
        if (node.hasAttribute("data-has-children")) {
          node.addEventListener("mouseenter", this.setSubmenu.bind(this));
          node.addEventListener("mouseleave", this.resetSubmenu.bind());
          node.addEventListener("touchstart", this.setSubmenu.bind(this));
          node.addEventListener("touchmove", this.resetSubmenu.bind(this));
        }
      });

    // Initialises sidebar menu
    MobileMenu.init();
  },
  setSubmenu(e) {
    this.setSubmenuPosition(e);
    this.showSubmenu(e);
  },
  resetSubmenu() {
    [...document.querySelectorAll(".js-nav-menu-item-top-level")].map((el) =>
      el.classList.remove("js-nav-menu-item-top-level--active")
    );
  },
  showSubmenu(e) {
    const menuItem = e.currentTarget;
    menuItem.classList.add("js-nav-menu-item-top-level--active");
  },
  setSubmenuPosition(e) {

    const menuItem = e.currentTarget;
    const menuItemRect = menuItem.getBoundingClientRect();
    const parentRect = menuItem.parentElement.getBoundingClientRect();
    const liLeftOffset = menuItemRect.left - parentRect.left;
    const lastChild = menuItem.parentElement.lastChild;
    const subMenu = menuItem.querySelector(".nav-desktop-menu__submenu");

    if (menuItem !== lastChild) {
      subMenu.style.left = `${liLeftOffset}px`;
      subMenu.style.width = `calc(100% - ${liLeftOffset}px)`;
    } else {
      const prevMenuItem = menuItem.previousSibling;
      const prevMenuItemRect = prevMenuItem.getBoundingClientRect();
      const lastSubmenuWidth = prevMenuItemRect.width + menuItemRect.width;

      subMenu.style.width = `${lastSubmenuWidth}px`;
    }
  },
  resetSubmenuPosition() {
    [...document.querySelectorAll(".nav-desktop-menu__submenu")].map((el) => {
      el.style.left = "";
      el.style.width = "";
    });
  },
};

export default NavMenu;
