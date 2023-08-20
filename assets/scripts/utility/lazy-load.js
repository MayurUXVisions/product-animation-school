export default () => {
  const showFull = (img) =>
    setTimeout(() => (img.closest('[data-lazy]').dataset.lazy = 1), 300);

  const addLoadOrShow = (img) => {
    img.src = img.dataset.lazyFull;
    if (img.complete && img.naturalHeight !== 0) return showFull(img);
    return img.addEventListener('load', ({ target }) => showFull(target));
  };

  const observer = new IntersectionObserver((entries) =>
    entries.map(
      (entry) =>
        (entry.isIntersecting || entry.intersectionRatio > 0) && addLoadOrShow(entry.target)
    )
  );

  [...document.querySelectorAll('[data-lazy-full]')].map((img) => observer.observe(img));
};
