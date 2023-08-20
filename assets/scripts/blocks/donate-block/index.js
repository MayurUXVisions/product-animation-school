document.addEventListener("click", ({ target }) => {
  if (!target.matches(".js-currency")) return;

  const step1 = target
    .closest(".js-donate-form")
    .querySelector(".donate-form__step-1");

  const forms = [
    ...target.closest(".js-donate-form").querySelectorAll(".donate-form__form"),
  ];

  step1.classList.add('donate-form__step-1--hidden');
  forms.map((form) => {
    if (target.dataset.currency === form.dataset.currency) {
      form.classList.add("donate-form__form--active");
    } else {
      form.classList.remove("donate-form__form--active");
    }
  });
});
