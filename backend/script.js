
const foods = [
  {
    name: "Paneer",
    category: "vegetarian",
    protein: "18g protein / 100g",
    description: "A delicious vegetarian protein source.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600"
  },
  {
    name: "Greek Yogurt",
    category: "vegetarian",
    protein: "10g protein / 100g",
    description: "Thick, creamy Greek yogurt rich in protein.",
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600"
  },
  {
    name: "Lentils",
    category: "vegetarian",
    protein: "9g protein / 100g cooked",
    description: "A great plant-based protein option.",
    image: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=600"
  },
  {
    name: "Chickpeas",
    category: "vegetarian",
    protein: "9g protein / 100g cooked",
    description: "Filling and full of nutrients.",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600"
    
  },
  {
    name: "Chicken Breast",
    category: "nonvegetarian",
    protein: "31g protein / 100g",
    description: "A lean and popular protein source.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600"
  },
  {
    name: "Eggs",
    category: "nonvegetarian",
    protein: "13g protein / 100g",
    description: "An easy and versatile protein food.",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600"
  },
  {
    name: "Fish",
    category: "nonvegetarian",
    protein: "22g protein / 100g",
    description: "Protein-rich and delicious.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600"
  },
  {
    name: "Whey Isolate",
    category: "supplements",
    protein: "Around 25g per serving",
    description: "A convenient protein supplement.",
    image: "https://www.livemomentous.com/cdn/shop/files/Whey-Protein_25-Serv_Unflavored.png?v=1782251788&width=1440"
  },
  {
    name: "Protein Powder",
    category: "supplements",
    protein: "Varies by serving",
    description: "Check the product label for protein content.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600"
  },
  {
    name: "Protein Bar",
    category: "snacks",
    protein: "Varies by bar",
    description: "A convenient snack for busy days.",
    image: "https://images.heb.com/is/image/HEBGrocery/001748225"
  },
  {
    name: "Peanuts",
    category: "snacks",
    protein: "26g protein / 100g",
    description: "A crunchy snack with plant protein.",
    image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=600"
  }
];

// ==================================
// FOOD CARDS
// ==================================

const containers = {
  vegetarian: document.getElementById("vegetarianFoods"),
  nonvegetarian: document.getElementById("nonVegetarianFoods"),
  supplements: document.getElementById("supplementFoods"),
  snacks: document.getElementById("snackFoods")
};

function renderFoods(searchTerm = "") {
  Object.values(containers).forEach(container => {
    if (container) container.innerHTML = "";
  });

  foods.forEach(food => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm) ||
      food.description.toLowerCase().includes(searchTerm) ||
      food.protein.toLowerCase().includes(searchTerm);

    if (!matchesSearch) return;

    const container = containers[food.category];

    if (!container) return;

    const card = document.createElement("article");
    card.className = "food-card";

    const image = document.createElement("img");
    image.className = "food-image";
    image.src = food.image;
    image.alt = food.name;
    image.loading = "lazy";

    image.onerror = function () {
      this.style.display = "none";
    };

    const info = document.createElement("div");
    info.className = "food-info";

    const title = document.createElement("h3");
    title.textContent = food.name;

    const description = document.createElement("p");
    description.textContent = food.description;

    const protein = document.createElement("span");
    protein.className = "protein-tag";
    protein.textContent = food.protein;

    info.append(title, description, protein);
    card.append(image, info);

    container.appendChild(card);
  });

  Object.values(containers).forEach(container => {
    if (container && container.children.length === 0) {
      const message = document.createElement("p");
      message.className = "no-results";
      message.textContent = searchTerm
        ? "No matching foods found."
        : "More foods coming soon!";

      container.appendChild(message);
    }
  });
}

// ==================================
// SEARCH
// ==================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", event => {
    const searchTerm = event.target.value.trim().toLowerCase();
    renderFoods(searchTerm);
  });
}

// ==================================
// DAILY PROTEIN CALCULATOR
// ==================================

const calculateProteinButton =
  document.getElementById("calculateProtein");

if (calculateProteinButton) {
  calculateProteinButton.addEventListener("click", () => {
    const weight = Number(document.getElementById("bodyWeight").value);
    const goal = document.getElementById("fitnessGoal").value;
    const result = document.getElementById("proteinResult");

    if (!weight || weight <= 0 || weight > 500) {
      result.textContent = "Please enter a valid weight in kg.";
      return;
    }

    let minimum;
    let maximum;

    if (goal === "muscle") {
      minimum = 1.6;
      maximum = 2.0;
    } else {
      minimum = 1.2;
      maximum = 1.6;
    }

    const minProtein = Math.round(weight * minimum);
    const maxProtein = Math.round(weight * maximum);

    result.textContent =
      `Your estimated daily protein target is ${minProtein}–${maxProtein} grams.`;
  });
}

// ==================================
// BMI CALCULATOR
// ==================================

const bmiButton = document.getElementById("calculateBMI");

if (bmiButton) {
  bmiButton.addEventListener("click", () => {
    const weight = Number(document.getElementById("bmiWeight").value);
    const height = Number(document.getElementById("bmiHeight").value);
    const result = document.getElementById("bmiResult");

    if (!weight || !height || weight <= 0 || height <= 0) {
      result.textContent =
        "Please enter valid height and weight.";
      return;
    }

    if (weight > 500 || height > 300) {
      result.textContent =
        "Please check your measurements.";
      return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category;

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 25) {
      category = "Normal weight";
    } else if (bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obesity range";
    }

    result.textContent =
      `Your BMI is ${bmi.toFixed(1)} — ${category}.`;
  });
}

// ==================================
// FEEDBACK SYSTEM
// ==================================

const feedbackFormName = document.getElementById("reviewName");
const feedbackRating = document.getElementById("reviewRating");
const feedbackText = document.getElementById("reviewMessage");
const feedbackMessage = document.getElementById("feedbackMessage");
const reviewsList = document.getElementById("reviewsList");
const submitFeedbackButton = document.getElementById("submitFeedback");

function getReviews() {
  try {
    return JSON.parse(
      localStorage.getItem("proteinPowerReviews")
    ) || [];
  } catch {
    return [];
  }
}

function displayReviews() {
  if (!reviewsList) return;

  const reviews = getReviews();

  reviewsList.innerHTML = "";

  if (reviews.length === 0) {
    reviewsList.textContent =
      "Be the first to share your feedback!";
    return;
  }

  reviews.slice().reverse().forEach(review => {
    const item = document.createElement("div");
    item.className = "review-item";

    const name = document.createElement("h4");
    name.textContent = review.name;

    const stars = document.createElement("div");
    stars.className = "review-stars";

    const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

    stars.textContent =
      "★".repeat(rating) + "☆".repeat(5 - rating);

    const message = document.createElement("p");
    message.textContent = review.message;

    item.append(name, stars, message);
    reviewsList.appendChild(item);
  });
}

if (submitFeedbackButton) {
  submitFeedbackButton.addEventListener("click", () => {
    const name = feedbackFormName.value.trim();
    const rating = Number(feedbackRating.value);
    const message = feedbackText.value.trim();

    if (!name || !message) {
      feedbackMessage.textContent =
        "Please enter your name and feedback.";
      return;
    }

    const reviews = getReviews();

    reviews.push({
      name: name,
      rating: rating,
      message: message
    });

    localStorage.setItem(
      "proteinPowerReviews",
      JSON.stringify(reviews)
    );

    feedbackMessage.textContent =
      "Thank you! Your feedback has been saved.";

    feedbackFormName.value = "";
    feedbackText.value = "";

    displayReviews();
  });
}

// ==================================
// DAILY PROTEIN TRACKER
// ==================================

const dailyTargetInput = document.getElementById("dailyTarget");
const foodNameInput = document.getElementById("foodName");
const foodProteinInput = document.getElementById("foodProtein");

const addProteinButton = document.getElementById("addProtein");
const totalProteinDisplay = document.getElementById("totalProtein");
const proteinProgress = document.getElementById("proteinProgress");
const trackerStatus = document.getElementById("trackerStatus");
const proteinFoodList = document.getElementById("proteinFoodList");
const resetTrackerButton = document.getElementById("resetTracker");

const today = new Date().toLocaleDateString("en-CA");

function loadTracker() {
  try {
    const saved = JSON.parse(localStorage.getItem("proteinTracker"));

    if (saved && saved.date === today && Array.isArray(saved.foods)) {
      return saved;
    }
  } catch (error) {
    console.warn("Could not load saved tracker data.", error);
  }

  return {
    date: today,
    target: 0,
    foods: []
  };
}

let trackerData = loadTracker();

function saveTracker() {
  try {
    localStorage.setItem(
      "proteinTracker",
      JSON.stringify(trackerData)
    );
  } catch (error) {
    console.warn("Could not save tracker data.", error);
  }
}

function updateTracker() {
  if (
    !totalProteinDisplay ||
    !dailyTargetInput ||
    !proteinProgress ||
    !trackerStatus ||
    !proteinFoodList
  ) {
    return;
  }

  const total = trackerData.foods.reduce(
    (sum, food) => sum + Number(food.protein || 0),
    0
  );

  totalProteinDisplay.textContent = total.toFixed(1);
  dailyTargetInput.value = trackerData.target || "";

  const percentage = trackerData.target > 0
    ? (total / trackerData.target) * 100
    : 0;

  proteinProgress.style.width =
    Math.min(percentage, 100) + "%";

  if (trackerData.target <= 0) {
    trackerStatus.textContent =
      "Set your daily protein target to begin!";
  } else if (total >= trackerData.target) {
    trackerStatus.textContent =
      "🎉 Congratulations! You've reached your daily protein target!";
  } else {
    trackerStatus.textContent =
      `${(trackerData.target - total).toFixed(1)}g protein remaining today.`;
  }

  proteinFoodList.innerHTML = "";

  if (trackerData.foods.length === 0) {
    proteinFoodList.textContent =
      "No food added yet. Start tracking your meals!";
  }

  trackerData.foods.forEach((food, index) => {
    const item = document.createElement("div");
    item.className = "tracker-food";

    const details = document.createElement("span");
    details.textContent =
      `${food.name} — ${Number(food.protein).toFixed(1)}g`;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-food";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      trackerData.foods.splice(index, 1);
      saveTracker();
      updateTracker();
    });

    item.append(details, removeButton);
    proteinFoodList.appendChild(item);
  });
}

// SAVE DAILY TARGET

if (dailyTargetInput) {
  dailyTargetInput.addEventListener("change", () => {
    const target = Number(dailyTargetInput.value);

    if (!Number.isFinite(target) || target <= 0 || target > 1000) {
      trackerStatus.textContent =
        "Please enter a valid target between 1 and 1000 grams.";
      return;
    }

    trackerData.target = target;
    saveTracker();
    updateTracker();
  });
}

// ADD FOOD

if (addProteinButton) {
  addProteinButton.addEventListener("click", () => {
    const name = foodNameInput.value.trim();
    const protein = Number(foodProteinInput.value);

    if (!name) {
      trackerStatus.textContent = "Please enter a food name.";
      return;
    }

    if (!Number.isFinite(protein) || protein <= 0 || protein > 1000) {
      trackerStatus.textContent =
        "Please enter a valid protein amount.";
      return;
    }

    trackerData.foods.push({
      name: name,
      protein: protein
    });

    saveTracker();
    updateTracker();

    foodNameInput.value = "";
    foodProteinInput.value = "";

    trackerStatus.textContent =
      "✅ Food added successfully!";
  });
}

// RESET TRACKER

if (resetTrackerButton) {
  resetTrackerButton.addEventListener("click", () => {
    const confirmed = confirm(
      "Are you sure you want to reset today's protein tracker?"
    );

    if (!confirmed) return;

    trackerData.foods = [];
    saveTracker();
    updateTracker();
  });
}

// ==================================
// INITIAL WEBSITE DISPLAY
// ==================================

renderFoods();
displayReviews();
updateTracker();

// ==================================
// MOBILE NAVIGATION MENU
// ==================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// ======================================
// AI FOOD NUTRITION SCANNER
// ======================================

const foodImageInput = document.getElementById("foodImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const analyzeFoodButton = document.getElementById("analyzeFood");
const scannerStatus = document.getElementById("scannerStatus");
const nutritionResults = document.getElementById("nutritionResults");

let scannedProtein = 0;

// Preview selected food image
foodImageInput.addEventListener("change", function () {
    const file = this.files[0];

    nutritionResults.style.display = "none";
    scannerStatus.textContent = "";

    if (!file) {
        imagePreviewContainer.style.display = "none";
        return;
    }

    if (!file.type.startsWith("image/")) {
        scannerStatus.textContent = "Please select a valid image.";
        this.value = "";
        imagePreviewContainer.style.display = "none";
        return;
    }

    if (file.size > 8 * 1024 * 1024) {
        scannerStatus.textContent = "Image must be smaller than 8 MB.";
        this.value = "";
        imagePreviewContainer.style.display = "none";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreviewContainer.style.display = "block";
    };

    reader.readAsDataURL(file);
});

// Analyse food using the AI backend
analyzeFoodButton.addEventListener("click", async function () {
    const file = foodImageInput.files[0];

    if (!file) {
        scannerStatus.textContent = "Please choose a food picture first!";
        return;
    }

    const formData = new FormData();
    formData.append("foodImage", file);

    analyzeFoodButton.disabled = true;
    analyzeFoodButton.textContent = "⏳ Analysing your food...";
    scannerStatus.textContent = "AI is analysing your food. Please wait...";
    nutritionResults.style.display = "none";

    try {
        const response = await fetch("https://protein-power.onrender.com/analyze", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Food analysis failed.");
        }

        // Display nutrition information
        document.getElementById("scannedFoodName").textContent =
            data.food_name || "Your Food";

        document.getElementById("scannedServing").textContent =
            "Estimated serving: " + (data.serving_size || "Not available");

        document.getElementById("scanCalories").textContent = data.calories ?? "N/A";
        document.getElementById("scanProtein").textContent = data.protein ?? "N/A";
        document.getElementById("scanCarbs").textContent = data.carbs ?? "N/A";
        document.getElementById("scanFat").textContent = data.fat ?? "N/A";
        document.getElementById("scanSugar").textContent = data.sugar ?? "N/A";
        document.getElementById("scanFiber").textContent = data.fiber ?? "N/A";

        document.getElementById("scanConfidence").textContent =
            data.confidence || "Not available";

        document.getElementById("scanNotes").textContent =
            data.notes || "";

        scannedProtein = Number(data.protein) || 0;
        saveFoodScan(data);
        updateNutritionDashboard();

        nutritionResults.style.display = "block";
        scannerStatus.textContent = "✅ Food analysis completed!";

    } catch (error) {
        console.error("Food scanner error:", error);

        scannerStatus.textContent =
            "❌ " + error.message +
            " Please check that your backend is running.";
    } finally {
        analyzeFoodButton.disabled = false;
        analyzeFoodButton.textContent = "🔍 Analyse My Food";
    }
});

// Add scanned protein to the existing daily tracker
document.getElementById("addScannedProtein").addEventListener("click", function () {
    if (scannedProtein <= 0) {
        alert("No valid protein amount is available to add.");
        return;
    }

    document.getElementById("foodName").value =
        document.getElementById("scannedFoodName").textContent;

    document.getElementById("foodProtein").value = scannedProtein;

    document.getElementById("addProtein").click();

    document.getElementById("tracker").scrollIntoView({
        behavior: "smooth"
    });
});
// ======================================
// FOOD SCAN HISTORY
// ======================================

const scanHistoryList = document.getElementById("scanHistoryList");
const clearScanHistoryButton = document.getElementById("clearScanHistory");

function getScanHistory() {
    try {
        return JSON.parse(localStorage.getItem("proteinPowerScanHistory")) || [];
    } catch (error) {
        console.warn("Could not load scan history.", error);
        return [];
    }
}

function saveScanHistory() {
    localStorage.setItem(
        "proteinPowerScanHistory",
        JSON.stringify(getScanHistory())
    );
}

function displayScanHistory() {
    if (!scanHistoryList) return;

    const history = getScanHistory();
    scanHistoryList.innerHTML = "";

    if (history.length === 0) {
        scanHistoryList.textContent =
            "No food scans saved yet. Start scanning your meals!";
        return;
    }

    history.forEach((scan, index) => {
        const item = document.createElement("div");
        item.className = "scan-history-item";

        const title = document.createElement("h3");
        title.textContent = scan.food_name;

        const date = document.createElement("p");
        date.textContent = scan.date;

        const nutrition = document.createElement("p");
        nutrition.textContent =
            `🔥 ${scan.calories} kcal | 💪 ${scan.protein}g protein | 🍞 ${scan.carbs}g carbs | 🥑 ${scan.fat}g fat`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-food";
        removeButton.textContent = "Delete";

        removeButton.addEventListener("click", () => {
            const updatedHistory = getScanHistory();
            updatedHistory.splice(index, 1);

            localStorage.setItem(
                "proteinPowerScanHistory",
                JSON.stringify(updatedHistory)
            );

            displayScanHistory();
        });

        item.append(title, date, nutrition, removeButton);
        scanHistoryList.appendChild(item);
    });
}

// Save each successful AI scan
function saveFoodScan(data) {
    const history = getScanHistory();

    history.unshift({
        food_name: data.food_name || "Unknown food",
        serving_size: data.serving_size || "Not available",
        calories: data.calories ?? 0,
        protein: data.protein ?? 0,
        carbs: data.carbs ?? 0,
        fat: data.fat ?? 0,
        sugar: data.sugar ?? 0,
        fiber: data.fiber ?? 0,
        confidence: data.confidence || "Not available",
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "proteinPowerScanHistory",
        JSON.stringify(history.slice(0, 50))
    );

    displayScanHistory();
}

// Clear all saved scans
if (clearScanHistoryButton) {
    clearScanHistoryButton.addEventListener("click", () => {
        if (!confirm("Are you sure you want to clear all scan history?")) {
            return;
        }

        localStorage.removeItem("proteinPowerScanHistory");
        displayScanHistory();
    });
}

// Display saved scans when the website opens
displayScanHistory();
// ===============================
// NUTRITION DASHBOARD
// ===============================

function updateNutritionDashboard() {
    const history = getScanHistory();

    // Match scans saved today
    const today = new Date().toLocaleDateString();

    const todaysScans = history.filter(scan => {
        if (!scan.date) return false;
        return scan.date.startsWith(today);
    });

    // Calculate today's scanned nutrition
    const totals = todaysScans.reduce((sum, scan) => {
        sum.calories += Number(scan.calories) || 0;
        sum.protein += Number(scan.protein) || 0;
        sum.carbs += Number(scan.carbs) || 0;
        sum.fat += Number(scan.fat) || 0;
        return sum;
    }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
        // Update nutrition chart values
    document.getElementById("chartProtein").textContent =
        totals.protein.toFixed(1) + " g";

    document.getElementById("chartCarbs").textContent =
        totals.carbs.toFixed(1) + " g";

    document.getElementById("chartFat").textContent =
        totals.fat.toFixed(1) + " g";

    // Compare macro amounts visually
    const maxMacro = Math.max(
        totals.protein,
        totals.carbs,
        totals.fat,
        1
    );

    document.getElementById("proteinBar").style.width =
        (totals.protein / maxMacro * 100) + "%";

    document.getElementById("carbsBar").style.width =
        (totals.carbs / maxMacro * 100) + "%";

    document.getElementById("fatBar").style.width =
        (totals.fat / maxMacro * 100) + "%";
        
    document.getElementById("dashboardCalories").textContent =
        Math.round(totals.calories);

    document.getElementById("dashboardProtein").textContent =
        totals.protein.toFixed(1);

    document.getElementById("dashboardCarbs").textContent =
        totals.carbs.toFixed(1);

    document.getElementById("dashboardFat").textContent =
        totals.fat.toFixed(1);

    document.getElementById("dashboardScanCount").textContent =
        "Food scans today: " + todaysScans.length;

    document.getElementById("dashboardMessage").textContent =
        todaysScans.length > 0
            ? "Great work! Your nutrition totals are based on today's saved food scans."
            : "No food scans saved today yet. Scan a meal to see your nutrition here.";
}

// Show dashboard totals when the page loads
updateNutritionDashboard();
