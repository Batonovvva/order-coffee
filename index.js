const form = document.querySelector(".order-form");
const addButton = document.querySelector(".add-button");
const firstBeverage = document.querySelector(".beverage");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCloseButton = document.querySelector(".modal-close-button");
const modalOrderCount = document.querySelector(".modal-order-count");
const orderTableBody = document.querySelector(".order-table-body");
const submitButton = document.querySelector(".submit-button");

const highlightedWordsPattern =
  /(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)/gi;

const getBeverages = () => Array.from(form.querySelectorAll(".beverage"));

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getDrinkWord = (count) => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "напитков";
  }

  if (lastDigit === 1) {
    return "напиток";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "напитка";
  }

  return "напитков";
};

const updateWishesPreview = (beverage) => {
  const wishesInput = beverage.querySelector(".wishes-input");
  const wishesPreview = beverage.querySelector(".wishes-preview-text");

  if (!wishesInput || !wishesPreview) {
    return;
  }

  const escapedText = escapeHtml(wishesInput.value);
  wishesPreview.innerHTML = escapedText
    .replace(highlightedWordsPattern, "<b>$1</b>")
    .replaceAll("\n", "<br>");
};

const updateBeverages = () => {
  const beverages = getBeverages();
  const canRemove = beverages.length > 1;

  beverages.forEach((beverage, index) => {
    const beverageCount = beverage.querySelector(".beverage-count");
    const removeButton = beverage.querySelector(".remove-button");
    const milkInputs = beverage.querySelectorAll('input[type="radio"]');

    if (beverageCount) {
      beverageCount.textContent = `Напиток №${index + 1}`;
    }

    if (removeButton) {
      removeButton.disabled = !canRemove;
    }

    milkInputs.forEach((input) => {
      input.name = `milk-${index + 1}`;
    });

    updateWishesPreview(beverage);
  });
};

const collectOrderData = () =>
  getBeverages().map((beverage) => {
    const drink = beverage.querySelector('select[name="drink"]').value;
    const selectedMilkInput = beverage.querySelector('input[type="radio"]:checked');
    const options = Array.from(
      beverage.querySelectorAll('input[type="checkbox"]:checked')
    ).map((input) => input.value);

    return {
      drink,
      milk: selectedMilkInput ? selectedMilkInput.value : "обычном молоке",
      options,
    };
  });

const renderOrderTable = (orderData) => {
  orderTableBody.innerHTML = "";

  orderData.forEach(({ drink, milk, options }) => {
    const row = document.createElement("tr");
    const drinkCell = document.createElement("td");
    const milkCell = document.createElement("td");
    const optionsCell = document.createElement("td");

    drinkCell.textContent = drink;
    milkCell.textContent = milk;
    optionsCell.textContent = options.length ? options.join(", ") : "—";

    row.append(drinkCell, milkCell, optionsCell);
    orderTableBody.append(row);
  });
};

const openModal = (orderData) => {
  const beveragesCount = orderData.length;

  modalOrderCount.textContent = `Вы заказали ${beveragesCount} ${getDrinkWord(
    beveragesCount
  )}`;

  renderOrderTable(orderData);
  modalOverlay.classList.remove("hidden");
};

const closeModal = () => {
  modalOverlay.classList.add("hidden");
};

addButton.addEventListener("click", () => {
  const beverageClone = firstBeverage.cloneNode(true);
  const wishesInput = beverageClone.querySelector(".wishes-input");
  const checkedOptions = beverageClone.querySelectorAll('input[type="checkbox"]');
  const milkInputs = beverageClone.querySelectorAll('input[type="radio"]');
  const drinkSelect = beverageClone.querySelector('select[name="drink"]');

  if (wishesInput) {
    wishesInput.value = "";
  }

  if (drinkSelect) {
    drinkSelect.value = "Капучино";
  }

  checkedOptions.forEach((input) => {
    input.checked = false;
  });

  milkInputs.forEach((input, index) => {
    input.checked = index === 0;
  });

  form.insertBefore(beverageClone, addButton.parentElement);
  updateBeverages();
});

form.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-button");

  if (!removeButton || removeButton.disabled) {
    return;
  }

  const beverage = removeButton.closest(".beverage");

  if (!beverage) {
    return;
  }

  beverage.remove();
  updateBeverages();
});

form.addEventListener("input", (event) => {
  if (!event.target.classList.contains("wishes-input")) {
    return;
  }

  const beverage = event.target.closest(".beverage");

  if (!beverage) {
    return;
  }

  updateWishesPreview(beverage);
});

submitButton.addEventListener("click", () => {
  openModal(collectOrderData());
});

modalCloseButton.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

updateBeverages();
