const recipeDetailContainerID = document.getElementById('recipeDetailContainer');

function getrecipeDetails() {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s')
    .then((res)=>res.json())
    .then((data) => {
        for (let recipe of data.meals) {
            recipeDetailContainerID.innerHTML += `<img src="${recipe.strMealThumb}" alt="food">
            <h3 class="card-title">${recipe.strMeal}</h3>
            <div class="instructions">${recipe.strInstructions}</div>`
    }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
}
getrecipeDetails();