function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215)
        .toString(16).padStart(6, "0").toUpperCase();
}

function generatePalette() {
    const palette = document.getElementById("palette");
    palette.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const color = randomColor();
        const card = document.createElement("div");

        card.className = "color-card";

        card.innerHTML = `
            <div class="color-box"
                 style="background:${color}"
                 onclick="copyColor('${color}')">
            </div>

            <p class="color-code">${color}</p>

            <button onclick="copyColor('${color}')">
                Копировать
            </button>

            <br><br>

            <button class="favorite"
                onclick="addFavorite('${color}')">
                ⭐ Сохранить
            </button>
        `;

        palette.appendChild(card);
    }
}

function copyColor(color) {
    navigator.clipboard.writeText(color)
        .then(() => alert("Цвет скопирован: " + color))
        .catch(() => alert("Не удалось скопировать цвет"));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function addFavorite(color) {
    let favorites = getFavorites();

    if (!favorites.includes(color)) {
        favorites.push(color);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showFavorites();
    } else {
        alert("Этот цвет уже сохранён!");
    }
}

function showFavorites() {
    const container = document.getElementById("favorites");
    container.innerHTML = "";

    const favorites = getFavorites();

    favorites.forEach(color => {
        const item = document.createElement("div");
        item.className = "favorite-item";

        item.innerHTML = `
            <div class="favorite-color"
                 style="background:${color}">
            </div>

            <p>${color}</p>

            <button onclick="copyColor('${color}')">
                Копировать
            </button>

            <button onclick="removeFavorite('${color}')">
                Удалить
            </button>
        `;

        container.appendChild(item);
    });
}

function removeFavorite(color) {
    let favorites = getFavorites();
    favorites = favorites.filter(c => c !== color);

    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
}

function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function brightness(rgb) {
    return (
        0.299 * rgb.r +
        0.587 * rgb.g +
        0.114 * rgb.b
    );
}

function checkContrast() {
    const color1 = document.getElementById("color1").value;
    const color2 = document.getElementById("color2").value;

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const b1 = brightness(rgb1);
    const b2 = brightness(rgb2);

    const difference = Math.abs(b1 - b2);

    let result;

    if (difference > 125) {
        result = "Хорошая контрастность";
    } else if (difference > 60) {
        result = "Средняя контрастность";
    } else {
        result = "Низкая контрастность";
    }

    document.getElementById("contrastResult").innerText =
        result + " (" + difference.toFixed(1) + ")";
}

showFavorites();
generatePalette();