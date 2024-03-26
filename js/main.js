document.addEventListener('DOMContentLoaded', function() {
    const recipeContainerID = document.getElementById('RecipeContainer');
    const seeMoreButton = document.getElementById('see-more');

    const initialDisplayCount = 4;
    const loadMoreIncrement = 24;
    let currentDisplayCount = initialDisplayCount;

    function fetchRecipeAPI() {
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s')
            .then((res) => res.json())
            .then((data) => {
                displayRecipes(data.meals.slice(0, initialDisplayCount));
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
                    <button onclick="window.location.href='pages/recipe_detail.htm?id=${recipe.idMeal}'" class="view-recipe">View Recipe</button>
                </div>
            </div>`;
        }
    }

    fetchRecipeAPI();

    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', (event) => {
            event.preventDefault();
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
    }

    function fetchAndDisplayRecipeDetail() {
        const recipeId = getQueryParam('id');
        if (!recipeId) {
            console.error('Recipe ID not found in URL');
            return;
        }
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (data.meals && data.meals.length > 0) {
                    const recipe = data.meals[0];
                    let ingredients = '';
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = recipe[`strIngredient${i}`];
                        const measure = recipe[`strMeasure${i}`];
                        if (ingredient && ingredient !== '' && measure && measure !== '') {
                            ingredients += `<li>${measure} ${ingredient}</li>`;
                        }
                    }
                    document.getElementById('recipeDetailContainer').innerHTML = `
                        <h2>${recipe.strMeal}</h2>
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="max-width: 100%; height: auto;">
                        <p><strong>Category:</strong> ${recipe.strCategory}</p>
                        <p><strong>Area:</strong> ${recipe.strArea}</p>
                        <h3>Ingredients</h3>
                        <ul>${ingredients}</ul>
                        <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
                        
                    `;
                } else {
                    console.error('No recipe details found');
                }
            })
            .catch((error) => {
                console.error('Error fetching recipe details:', error);
            });
    }

    if (document.getElementById('recipeDetailContainer')) {
        fetchAndDisplayRecipeDetail();
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
});
