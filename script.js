let meals = [];
let currentIndex = 0;

async function fetchMeals() {
  const query = document.getElementById("recipeInput").value.trim() || "potato";
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.meals) {
    document.getElementById("details").innerHTML = "<p>No recipe found!</p>";
    document.getElementById("counter").innerText = "";
    meals = [];
    updateButtons();
    return;
  }

  meals = data.meals;
  currentIndex = 0;
  showDetails(meals[currentIndex]);
  updateButtons();
}

function showDetails(meal) {
  const videoId = meal.strYoutube ? meal.strYoutube.split("v=")[1] : null;

  // Collect ingredients + measures
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }

  // Split instructions into steps
  let instructionsSteps = meal.strInstructions
    .split(/[\r\n.]+/)
    .filter(step => step.trim() !== "")
    .map(step => `<li>${step.trim()}</li>`)
    .join("");

  const detailsDiv = document.getElementById("details");
  detailsDiv.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h3>${meal.strMeal}</h3>
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <h4>Ingredients:</h4>
    <ul>${ingredientsList}</ul>
    <h4>Instructions:</h4>
    <ol>${instructionsSteps}</ol>
    ${videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : "<p>No video available</p>"}
  `;

  document.getElementById("counter").innerText = `Recipe ${currentIndex + 1} of ${meals.length}`;
}

function nextRecipe() {
  if (currentIndex < meals.length - 1) {
    currentIndex++;
    showDetails(meals[currentIndex]);
    updateButtons();
  }
}

function prevRecipe() {
  if (currentIndex > 0) {
    currentIndex--;
    showDetails(meals[currentIndex]);
    updateButtons();
  }
}

function updateButtons() {
  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled = currentIndex === meals.length - 1;
}
