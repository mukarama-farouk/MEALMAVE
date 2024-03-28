document.addEventListener('DOMContentLoaded', function() {
    const recipeContainerID = document.getElementById('RecipeContainer');
    const RecipesContainerID = document.getElementById('RecipesContainer')
    const seeMoreButton = document.getElementById('see-more');
    const recipesTab = document.getElementById('recipes-tab');
    const URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s';

    const initialDisplayCount = 4;
    const loadMoreIncrement = 24;
    let currentDisplayCount = initialDisplayCount;

    function fetchRecipeAPI() {
        fetch(URL)
            .then((res) => res.json())
            .then((data) => {
                displayRecipes(data.meals.slice(0, initialDisplayCount));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    // Function for retrieving all recipes in the recipes page
    function fetchAllRecipesAPI() {
        fetch(URL) 
        .then ((res) => res.json())
        .then((data) => {
            for (let recipe of data.meals) {
                RecipesContainerID.innerHTML += `<div class="card" data-aos="zoom-in">
                    <img class="card-img" src="${recipe.strMealThumb}"   alt="food">
                    <div class="card-body">
                        <h3 class="card-title">${recipe.strMeal}</h3>
                        <p class="card-category">${recipe.strCategory}</p>
                        <p class="card-area">${recipe.strArea}</p>
                        <button onclick="window.location.href='recipe_detail.htm?id=${recipe.idMeal}'" class="view-recipe">View Recipe</button>
                    </div>
                </div>`;
            }
        })
        .catch((error) => {
            console.error('Error getching data:', error)
        })
    }
    fetchAllRecipesAPI();

    // Function for displaying recipes
    function displayRecipes(recipes) {
        for (let recipe of recipes) {
            recipeContainerID.innerHTML += `<div class="card" data-aos="zoom-in">
                <img class="card-img" src="${recipe.strMealThumb}"   alt="food">
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


    recipesTab.addEventListener('click', (event) => {
        event.preventDefault();
        fetch(URL)
                .then((res) => res.json())
                .then((data) => {
                    const additionalRecipes = data.meals.slice(currentDisplayCount, currentDisplayCount + loadMoreIncrement);
                    displayRecipes(additionalRecipes);
                    currentDisplayCount += loadMoreIncrement;
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        recipeContainerID.scrollIntoView({ behavior: "smooth" });
    });


    // JS for when the 'see all' link is clicked
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', (event) => {
            event.preventDefault();
            fetch(URL)
                .then((res) => res.json())
                .then((data) => {
                    const additionalRecipes = data.meals.slice(currentDisplayCount, currentDisplayCount + loadMoreIncrement);
                    displayRecipes(additionalRecipes);
                    currentDisplayCount += loadMoreIncrement;
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            recipeContainerID.scrollIntoView({ behavior: "smooth" });
        });
    }


});

// JS code for recipe detail page

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
                    <div class="detail-card">
                        <div>
                            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class='detail-img'>
                            <div class='image-container'>
                                <h2 class='detail-name'>${recipe.strMeal}</h2>
                                <button id="saveRecipeButton" class="save-recipe-btn">
                                    <i class="ri-heart-line"></i>
                                    <span>Save Recipe</span>
                                </button>
                            </div>
                        </div>
                        <p><strong>Link to watch video:</strong> <a href="${recipe.strYoutube}" target="_blank">${recipe.strYoutube}</a></p>
                        <p class='card-area'><strong>Area:</strong> ${recipe.strArea}</p>
                        <h3 class='detail-ingredients'>Ingredients:</h3>
                        <ul>${ingredients}</ul>
                        <h3 class='detail-instructions'>Instructions:</h3>
                        <p>${recipe.strInstructions}</p>
                    </div>`;
                    const saveRecipeButton = document.getElementById('saveRecipeButton');
                    saveRecipeButton.addEventListener('click', () => {
                        // Implement logic to save the recipe
                        alert('Recipe saved!');
                    });
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


// JS for when a meal is searched for

// Function to search for a meal
// Function to search for a meal
function searchMeal() {
    const searchBar = document.getElementById('searchBar');
    const mealName = searchBar.value.trim();

    // Check if the meal name is empty
    if (mealName === '') {
        alert('Please enter a meal name.');
        return;
    }

    // Construct URL for search endpoint
    const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;

    // Fetch meal details based on the entered name
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            // Check if meals are found
            if (data.meals && data.meals.length > 0) {
                // Redirect to the recipe detail page of the first meal found
                const mealId = data.meals[0].idMeal;
                window.location.href = `pages/recipe_detail.htm?id=${mealId}`;

                // Clear the search bar after searching
                searchBar.value = '';
            } else {
                alert('No meal found with that name.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch meal details. Please try again later.');
        });

}


// JS for when submitting a message
document.addEventListener('DOMContentLoaded', function() {
    const contactFormContainer = document.getElementById('contactFormContainer');
    const getInTouchButton = document.getElementById('contact-footer-button');
    const submitButton = document.getElementById('submitButton');

    getInTouchButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (contactFormContainer.style.display === 'none') {
            contactFormContainer.style.display = 'block';
        } else {
            contactFormContainer.style.display = 'none';
        }
    });


});
