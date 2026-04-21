"use strict";

const form = document.querySelector(".order-form");
const addButton = document.querySelector(".add-button");
const firstBeverage = document.querySelector(".beverage");

const highlightedWordsPattern =
  /(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)/gi;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  showModal();
});

addButton.addEventListener("click", function () {
  addBeverage();
});

form.addEventListener("click", function (event) {
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

form.addEventListener("input", function (event) {
  if (!event.target.classList.contains("wishes-input")) {
    return;
  }

  const beverage = event.target.closest(".beverage");

  if (!beverage) {
    return;
  }

  updateWishesPreview(beverage);
});

updateBeverages();

function getBeverages() {
  return Array.from(form.querySelectorAll(".beverage"));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getDrinkWord(count) {
  const lastOne = count % 10;
  const lastTwo = count % 100;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "напитков";
  }

  if (lastOne === 1) {
    return "напиток";
  }

  if (lastOne >= 2 && lastOne <= 4) {
    return "напитка";
  }

  return "напитков";
}

function updateWishesPreview(beverage) {
  const wishesInput = beverage.querySelector(".wishes-input");
  const wishesPreview = beverage.querySelector(".wishes-preview-text");

  if (!wishesInput || !wishesPreview) {
    return;
  }

  const escapedText = escapeHtml(wishesInput.value);

  wishesPreview.innerHTML = escapedText
    .replace(highlightedWordsPattern, "<b>$1</b>")
    .replaceAll("\n", "<br>");
}

function updateBeverages() {
  const beverages = getBeverages();
  const canRemove = beverages.length > 1;

  beverages.forEach(function (beverage, index) {
    const beverageCount = beverage.querySelector(".beverage-count");
    const removeButton = beverage.querySelector(".remove-button");
    const milkInputs = beverage.querySelectorAll('input[type="radio"]');

    if (beverageCount) {
      beverageCount.textContent = `Напиток №${index + 1}`;
    }

    if (removeButton) {
      removeButton.disabled = !canRemove;
    }

    milkInputs.forEach(function (input) {
      input.name = `milk-${index + 1}`;
    });

    updateWishesPreview(beverage);
  });
}

function collectOrderData() {
  return getBeverages().map(function (beverage) {
    const drink = beverage.querySelector('select[name="drink"]').value;
    const selectedMilkInput = beverage.querySelector('input[type="radio"]:checked');
    const options = Array.from(
      beverage.querySelectorAll('input[type="checkbox"]:checked')
    ).map(function (input) {
      return input.value;
    });
    const wishes = beverage.querySelector(".wishes-input").value.trim();

    return {
      drink: drink,
      milk: selectedMilkInput ? selectedMilkInput.value : "обычном молоке",
      options: options,
      wishes: wishes,
    };
  });
}

function renderOrderTable(orderData, tableBody) {
  tableBody.innerHTML = "";

  orderData.forEach(function (item) {
    const row = document.createElement("tr");
    const drinkCell = document.createElement("td");
    const milkCell = document.createElement("td");
    const optionsCell = document.createElement("td");
    const wishesCell = document.createElement("td");

    drinkCell.textContent = item.drink;
    milkCell.textContent = item.milk;
    optionsCell.textContent = item.options.length ? item.options.join(", ") : "—";
    wishesCell.textContent = item.wishes ? item.wishes : "—";

    row.append(drinkCell, milkCell, optionsCell, wishesCell);
    tableBody.append(row);
  });
}

function showModal() {
  const orderData = collectOrderData();
  const count = orderData.length;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const closeButton = document.createElement("button");
  closeButton.className = "modal-close";
  closeButton.type = "button";
  closeButton.textContent = "x";

  const title = document.createElement("p");
  title.className = "modal-title";
  title.textContent = "Заказ принят!";

  const text = document.createElement("p");
  text.className = "modal-text";
  text.textContent = `Вы заказали ${count} ${getDrinkWord(count)}`;

  const table = document.createElement("table");
  table.className = "order-table";

  const tableHead = document.createElement("thead");
  const tableHeadRow = document.createElement("tr");

  const drinkHeader = document.createElement("th");
  drinkHeader.textContent = "Напиток";

  const milkHeader = document.createElement("th");
  milkHeader.textContent = "Молоко";

  const optionsHeader = document.createElement("th");
  optionsHeader.textContent = "Дополнительно";

  const wishesHeader = document.createElement("th");
  wishesHeader.textContent = "Пожелания";

  const tableBody = document.createElement("tbody");

  tableHeadRow.append(drinkHeader, milkHeader, optionsHeader, wishesHeader);
  tableHead.append(tableHeadRow);
  table.append(tableHead, tableBody);

  renderOrderTable(orderData, tableBody);

  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeModal();
    }
  });

  modal.append(closeButton, title, text, table);
  overlay.append(modal);
  document.body.append(overlay);

  function closeModal() {
    overlay.remove();
  }
}

function addBeverage() {
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

  checkedOptions.forEach(function (input) {
    input.checked = false;
  });

  milkInputs.forEach(function (input, index) {
    input.checked = index === 0;
  });

  form.insertBefore(beverageClone, addButton.parentElement);
  updateBeverages();
}