/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const adminLink = document.getElementById("admin-link");
const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
window.onload = getIngredients(); 


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const ingredientName = addIngredientNameInput.value;
    if (!ingredientName.trim()) {
        alert("Ingredient name cannot be empty.");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify({ name: ingredientName })
        });
        if (!response.ok) throw new Error("Network response was not ok");
        addIngredientNameInput.value = ''; 
        await getIngredients();
    } catch (error) {
        console.error("Error adding ingredient:", error);
        alert(error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            headers: {

                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });
        ingredients = await response.json()
        refreshIngredientList();
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        alert(error);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const ingredientName = deleteIngredientNameInput.value.trim();
    if (!ingredientName) {
        alert("Ingredient name cannot be empty.");
        return;
    }
    try {
        const ingredient = ingredients.find(ing => ing.name === ingredientName);
        if (!ingredient) {
            alert("Ingredient not found.");
            return;
        }
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");
        await getIngredients();
    } catch (error) {
        console.error("Error deleting ingredient:", error);
        alert(error);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container 
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = ""; // Clear existing list
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
