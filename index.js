"use strict";

const form = document.querySelector('form')

form.addEventListener("submit", function (event) {
    event.preventDefault();
    showModal();
});


function showModal() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";

    
    const closeButton = document.createElement("button");
    closeButton.className = "modal-close";
    closeButton.type = "button";
    closeButton.textContent = "x";

    const text = document.createElement("p");
    text.textContent = "Заказ принят";

    closeButton.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    modal.append(closeButton, text);
    overlay.append(modal);
    document.body.append(overlay);

    function closeModal() {
        overlay.remove();
    }
}

function getWord(count) {
    const lastOne = count % 10;
    const lastTwo = count % 100;

    if(lastTwo >= 11 && lastTwo <= 14) {
        return "напитков";
    }

    if(lastOne === 1) {
        return "напиток";
    }
    if(lastOne >= 2 && lastOne <= 4) {
        return "напитка";
    }
    return "напитков";
}
