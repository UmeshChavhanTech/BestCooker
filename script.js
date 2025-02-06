const dishes = {
    breakfast: {
        "Pancakes": ["Flour - 200g", "Milk - 250ml", "Eggs - 2"],
        "Omelette": ["Eggs - 2", "Milk - 50ml", "Salt - 1g"]
    },
    lunch: {
        "Pizza": ["Dough - 300g", "Cheese - 100g", "Tomato Sauce - 150ml"],
        "Pasta": ["Pasta - 200g", "Tomato Sauce - 100ml", "Cheese - 50g"],
        "Burger": ["Bun - 1", "Patty - 150g", "Lettuce - 20g"]
    },
    drinks: {
        "Smoothie": ["Milk - 200ml", "Banana - 1", "Honey - 10g"],
        "Lemonade": ["Lemon - 1", "Water - 250ml", "Sugar - 50g"]
    },
    tea: {
        "Green Tea": ["Tea Leaves - 5g", "Water - 250ml"],
        "Masala Tea": ["Tea Leaves - 5g", "Milk - 200ml", "Spices - 2g"]
    },
    coffee: {
        "Espresso": ["Coffee - 15g", "Water - 100ml"],
        "Cappuccino": ["Coffee - 10g", "Milk - 150ml", "Foam - 50ml"]
    }
};

const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// **Search Bar Event Listener**
document.getElementById('searchBar').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    let results = document.getElementById('searchResults');
    results.innerHTML = '';
    for (let category in dishes) {
        for (let dish in dishes[category]) {
            if (dish.toLowerCase().includes(query)) {
                results.innerHTML += `<div class='dish' onclick='showIngredients("${category}", "${dish}")'>${dish}</div>`;
            }
        }
    }
});

// **Filter Dishes Function**
function filterDishes(category) {
    let results = document.getElementById('searchResults');
    results.innerHTML = '';

    if (category === 'all') {
        for (let cat in dishes) {
            for (let dish in dishes[cat]) {
                results.innerHTML += `<div class='dish' onclick='showIngredients("${cat}", "${dish}")'>${dish}</div>`;
            }
        }
    } else {
        for (let dish in dishes[category]) {
            results.innerHTML += `<div class='dish' onclick='showIngredients("${category}", "${dish}")'>${dish}</div>`;
        }
    }
}

// **Show Calculated Ingredients Function**
function showIngredients(category, dish) {
    let ingredients = dishes[category][dish];
    let people = prompt("Enter number of people:");
    
    if (!people || isNaN(people) || people <= 0) {
        alert("Please enter a valid number.");
        return;
    }

    let calculatedIngredients = ingredients.map(ing => {
        let parts = ing.split(' - ');
        let quantity = parseFloat(parts[1]) * people;
        let unit = parts[1].replace(/[0-9.]/g, '').trim();

        // Convert g to kg, ml to L
        if (unit === 'g' && quantity >= 1000) {
            quantity = (quantity / 1000).toFixed(2) + ' kg';
        } else if (unit === 'ml' && quantity >= 1000) {
            quantity = (quantity / 1000).toFixed(2) + ' L';
        } else {
            quantity = quantity + ' ' + unit;
        }
        
        return `${parts[0]} - ${quantity}`;
    });

    // **Display the calculated ingredients on the page**
    let outputList = document.getElementById('outputList');
    outputList.innerHTML = '';

    calculatedIngredients.forEach(item => {
        let listItem = document.createElement('li');
        listItem.textContent = item;
        outputList.appendChild(listItem);
    });

    // **Make output visible**
    document.getElementById('outputContainer').style.display = 'block';
    
    addToHistory(dish);
}

// **Share Function**
function shareResults() {
    let outputText = "Calculated Ingredients:\n";
    document.querySelectorAll("#outputList li").forEach(item => {
        outputText += "- " + item.textContent + "\n";
    });

    navigator.clipboard.writeText(outputText)
        .then(() => alert("Ingredients copied to clipboard!"))
        .catch(err => console.error("Error copying text: ", err));
}

// **History Functions**
function addToHistory(dish) {
    if (!searchHistory.includes(dish)) {
        searchHistory.push(dish);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    searchHistory.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromHistory(index);

        listItem.appendChild(removeButton);
        historyList.appendChild(listItem);
    });
}

function removeFromHistory(index) {
    searchHistory.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

window.onload = () => {
    displaySearchHistory();
    filterDishes('all');
};

// **Share Function with WhatsApp Integration**
function shareOnWhatsApp() {
    let outputText = "🛒 *Calculated Ingredients:* \n";
    document.querySelectorAll("#outputList li").forEach(item => {
        outputText += `✅ ${item.textContent}\n`;
    });

    // Encode the text for WhatsApp sharing
    let whatsappMessage = encodeURIComponent(outputText);
    let whatsappURL = `https://wa.me/?text=${whatsappMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");
}

// **Show Calculated Ingredients Function (Updated)**
function showIngredients(category, dish) {
    let ingredients = dishes[category][dish];
    let people = prompt("Enter number of people:");
    
    if (!people || isNaN(people) || people <= 0) {
        alert("Please enter a valid number.");
        return;
    }

    let calculatedIngredients = ingredients.map(ing => {
        let parts = ing.split(' - ');
        let quantity = parseFloat(parts[1]) * people;
        let unit = parts[1].replace(/[0-9.]/g, '').trim();

        // Convert g to kg, ml to L
        if (unit === 'g' && quantity >= 1000) {
            quantity = (quantity / 1000).toFixed(2) + ' kg';
        } else if (unit === 'ml' && quantity >= 1000) {
            quantity = (quantity / 1000).toFixed(2) + ' L';
        } else {
            quantity = quantity + ' ' + unit;
        }
        
        return `${parts[0]} - ${quantity}`;
    });

    // **Display the calculated ingredients on the page**
    let outputList = document.getElementById('outputList');
    outputList.innerHTML = '';

    calculatedIngredients.forEach(item => {
        let listItem = document.createElement('li');
        listItem.textContent = item;
        outputList.appendChild(listItem);
    });

    // **Make output visible**
    document.getElementById('outputContainer').style.display = 'block';
    
    addToHistory(dish);

    // **Add Share Button for WhatsApp**
    let shareButton = document.getElementById('shareButton');
    shareButton.style.display = 'block';
    shareButton.onclick = shareOnWhatsApp;
}

