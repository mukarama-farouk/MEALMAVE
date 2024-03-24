// main.js

const recipeContainerID = document.getElementById('RecipeContainer');
const seeMoreButton = document.getElementById('see-more');

const detailRecipesID = document.getElementById('recipe-details')

const initialDisplayCount = 4; // Number of initially displayed recipes
const loadMoreIncrement = 24; // Number of recipes to load each time "See More" is clicked
let currentDisplayCount = initialDisplayCount; // Initialize current display count

function fetchRecipeAPI() {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s')
        .then((res) => res.json())
        .then((data) => {
            displayRecipes(data.meals.slice(0, initialDisplayCount)); // Display initial recipes
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

function displayRecipes(recipes) {
    for (let recipe of recipes) {
        recipeContainerID.innerHTML += `<div class="card">
            <img class="card-img" src="${recipe.strMealThumb}" alt="food">
            <div class="card-body">
                <h3 class="card-title">${recipe.strMeal}</h3>
                <p class="card-category">${recipe.strCategory}</p>
                <p class="card-area">${recipe.strArea}</p>
                <a href="recipe_detail.htm?id=${recipe.idMeal}" class="view-recipe">View Recipe</a>
            </div>
        </div>`;
    }
}

fetchRecipeAPI();




seeMoreButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior of link
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s')
        .then((res) => res.json())
        .then((data) => {
            const additionalRecipes = data.meals.slice(currentDisplayCount, currentDisplayCount + loadMoreIncrement);
            displayRecipes(additionalRecipes);
            currentDisplayCount += loadMoreIncrement;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
});