import '~styles/components/accordion/simple-accordion.scss';

/**
 * Accordion logic includes:
 * - duplicate instantiation prevention
 * - unique accordion id based on content hash (optional)
 *
 *
 * Example usage (html):
 *     <div class="simple-accordion  js-simple-accordion">
 *         <?php foreach($faqsList as $item): ?>
 *             <div class="simple-accordion__item  js-simple-accordion-item">
 *                 <div class="simple-accordion__trigger  js-simple-accordion-trigger">
 *                     <?= $item['question'] ?>
 *                     <span class="icon-plus-minus"></span>
 *                 </div>
 *                 <div class="simple-accordion__content  wysiwyg">
 *                     <?= apply_filters('the_content', $item['answer']) ?>
 *                 </div>
 *             </div>
 *         <?php endforeach ?>
 *     </div>
 */
class SimpleAccordion {
  constructor(el, generateId = false) {
    // Already initialised, ignore
    if ( el.getAttribute('data-init') !== null ) {
      return;
    }

    const self = this;

    this._selectors = {
      container: '.js-simple-accordion',
      accordionItem: '.js-simple-accordion-item',
      triggerBtn: '.js-simple-accordion-trigger',
    };

    // Event :: Toggle item
    el.querySelectorAll(this._selectors.triggerBtn).forEach(node => {
      node.addEventListener('click', self.toggleItem.bind(self));
    });

    // Marks accordion as being initialised to prevent duplicate initialisations
    el.setAttribute('data-init', 1);

    // Generates unique id based on content (optional feature)
    if ( generateId ) {
      el.setAttribute('data-id', this._generateContentHash(el.textContent));
    }
  }

  toggleItem(e) {
    const itemEl = e.currentTarget.closest(this._selectors.accordionItem);

    if ( ! itemEl.classList.contains('expanded') ) {
      this.expandItem(itemEl);
    } else {
      this.collapseItem(itemEl);
    }
  }

  expandItem(itemEl) {
    itemEl.classList.add('expanded');
  }

  collapseItem(itemEl) {
    itemEl.classList.remove('expanded');
  }

  /**
   * Generates a content hash to be used as id on each accordion component
   *
   * Taken from:
   * - https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-52171480
   */
  _generateContentHash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
}

export default SimpleAccordion;