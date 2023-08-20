import waitForElementTransition from 'wait-for-element-transition';

const MobileMenu = {
  _depth: 0,

  _selectors: {
    headerNav: ".site-header-mobile",
    menuItemTopLevel: ".js-nav-menu-item-top-level",
    menuItemSecondLevel: ".js-nav-menu-item-second-level",
    subMenu: '.js-nav-submenu',
    mobileMenu: '.js-nav-menu',
    mobileNav: '.js-mobile-nav',
    MobileMenuContainer: '.js-nav-mobile-menu-container',
    btnGoBack: '.site-header-mobile__back',
    menuItem: '.js-nav-menu-item',
    hamburger: ".hamburger",
    hamburgerClose: ".js-btn-close",
  },

  init() {
    const self = this;
    // Hack :: creates links that look like headers on the deepest menus
    this.buildHeaderLinkForNestedLists_MegaMenuHack();

    // Event :: clicking on items with children, reveals the submenu
    const menu = document.querySelector(this._selectors.mobileMenu);

    menu.querySelectorAll(this._selectors.menuItem).forEach(node => {
      node.querySelector('a').addEventListener('click', self.handleMenuItemClick.bind(self));
    });

    // Event :: go back one level from the current submenu
    document.querySelector(this._selectors.btnGoBack).addEventListener('click', this.goToPreviousLevel.bind(this));

    if (document.querySelector(this._selectors.hamburger)) {
      document
        .querySelector(this._selectors.hamburger)
        .addEventListener("click", this.onMenuShow.bind(this));
      document
        .querySelector(this._selectors.hamburgerClose)
        .addEventListener("click", this.onMenuShow.bind(this));
    }
  },
  buildHeaderLinkForNestedLists_MegaMenuHack() {
    const menu = document.querySelector(this._selectors.mobileMenu);
    
    menu.querySelectorAll('.js-nav-submenu:not([data-depth="0"])').forEach(ulNode => {

      // Builds link item from ulNode's parent menu item
      let linkItemNode = document.createElement('a');
      linkItemNode.innerText = ulNode.previousSibling.innerText;
      linkItemNode.href = ulNode.previousSibling.href;

      // Builds list item with <a> element
      let listItemNode = document.createElement('li');
      listItemNode.appendChild(linkItemNode);
      listItemNode.classList.add('nav-menu-item', 'nav-menu-item--header-link');

      // Adds list item to top of the current list
      ulNode.insertBefore(listItemNode, ulNode.firstChild);
    });
  },
  onMenuShow() {
    this.resetMenuNavigation();
    document
      .querySelector(this._selectors.headerNav)
      .classList.toggle("site-header-mobile--active");
  },

  onSubmenuShow(e) {
    this.currentDepth = parseInt(e.currentTarget.getAttribute('data-depth'));

    e.currentTarget
      .querySelector(this._selectors.subMenu)
      .classList.add("active");
  },

  goToNextLevel(menuItemEl) {
    this._depth += 1;

    this.resetScrollPosition();

    // Shows submenu
    menuItemEl.querySelector(this._selectors.subMenu).classList.add('active');

    // Animates menu to the newly revealed submenu
    document.querySelector(this._selectors.mobileMenu).style.transform = `translateX(-${this._depth * 100}%)`;

    if ( this._depth === 1 ) {
      // Removes helper class, indicating we're navigating into a sub menu
      document.querySelector(this._selectors.mobileNav).classList.add('is-navigating-menu');
    }
  },

  goToPreviousLevel() {
    if ( this._depth === 0 ) {
      return;
    }

    this.resetScrollPosition();

    this._depth -= 1;

    // Animates menu to the previous submenu
    const mobileMenuEl = document.querySelector(this._selectors.mobileMenu);
    mobileMenuEl.style.transform = `translateX(-${this._depth * 100}%)`;

    // Hides submenu we are navigating away from after animation finishes
    waitForElementTransition(mobileMenuEl)
      .then(() => {
        const visibleSubMenus = document.querySelector(this._selectors.mobileMenu).querySelectorAll('.active');
        const deepestChild = visibleSubMenus[visibleSubMenus.length - 1];
        deepestChild.classList.remove('active');
      })
    ;

    if ( this._depth === 0 ) {
      // Removes helper class, indicating we're back to the top level
      document.querySelector(this._selectors.mobileNav).classList.remove('is-navigating-menu');
    }
  },

  /**
   * Scrolls back to the top of menu
   */
  resetScrollPosition() {
    document.querySelector(this._selectors.MobileMenuContainer).scrollTop = 0;
  },

  resetMenuNavigation() {
    // Hides all submenus
    document
      .querySelector(this._selectors.headerNav)
      .querySelectorAll('.active')
      .forEach(node => {
        node.classList.remove('active');
      })
    ;

    this._depth = 0;

    // Removes helper class
    document.querySelector(this._selectors.mobileNav).classList.remove('is-navigating-menu');

    // Resets translateX position after mobileNav animation finishes
    const mobileNavEl = document.querySelector(this._selectors.mobileNav);
    waitForElementTransition(mobileNavEl)
      .then(() => {
        document.querySelector(this._selectors.mobileMenu).style.transform = `translateX(0)`;
      })
    ;
  },

  /**
   * If not in headerNav breakpoint, close it
   */
  handleheaderNavVisibility() {
    // if ( ! this._isOpen ) {
    //   return;
    // }

    // if ( ! isBreakpoint('nav-mobile') ) {
    //   this.close();
    // }
  },

  /**
   * If clicked item has children, show them.
   * Otherwise the link is followed.
   */
  handleMenuItemClick(e) {
    const menuItemEl = e.currentTarget.closest(this._selectors.menuItem);

    // Has submenu, reveal it
    if ( menuItemEl.querySelector(this._selectors.subMenu) ) {
      
      e.preventDefault();
      this.goToNextLevel( menuItemEl );
    }
  },
};

export default MobileMenu;
