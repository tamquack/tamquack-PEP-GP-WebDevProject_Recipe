/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const recipeListContainer = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");

    const searchButton = document.getElementById("search-button");
    const addRecipeButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "block";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "block";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    window.onload = getRecipes;
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value;
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            recipes = data;
            refreshRecipeList();
        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("Failed to fetch recipes");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
   async function addRecipe() {
    const name = addRecipeNameInput.value;
    const instructions = addRecipeInstructionsInput.value;
    if (!name || !instructions) {
        alert("Both name and instructions are required.");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify({ name, instructions })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        await getRecipes(); 
        
        // Clear the form inputs
        addRecipeNameInput.value = '';
        addRecipeInstructionsInput.value = '';
        
    } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe");
    }
}

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameInput.value;
        const updatedInstructions = updateRecipeInstructionsInput.value;
        if (!name || !updatedInstructions) {
            alert("Both name and updated instructions are required.");
            return;
        }
        try {
            const recipe = recipes.find(r => r.name === name);
            if (!recipe) {
                alert("Recipe not found.");
                return;
            }
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify({ instructions: updatedInstructions })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            Object.assign(recipe, data);
            refreshRecipeList();
        } catch (error) {
            console.error("Error updating recipe:", error);
            alert("Failed to update recipe");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameInput.value;
        if (!name) {
            alert("Recipe name is required.");
            return;
        }
        try {
            const recipe = recipes.find(r => r.name === name);
            if (!recipe) {
                alert("Recipe not found.");
                return;
            }
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");
            recipes = recipes.filter(r => r.id !== recipe.id);
            refreshRecipeList();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");
            recipes = await response.json();
            refreshRecipeList();
        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("Failed to fetch recipes");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListContainer.innerHTML = ""; // Clear existing list
        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeListContainer.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("is-admin");
        
        window.location.href = "../login/login-page.html";
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Failed to log out");
    }
}

});
