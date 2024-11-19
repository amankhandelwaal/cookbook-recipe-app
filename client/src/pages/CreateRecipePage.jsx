import React, { useState } from "react";
import axios from "axios";

const CreateRecipe = () => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the recipe data to be sent to the backend
    const recipePayload = {
      username: "chef_john", // Replace with logged-in user's username
      email: "john@example.com", // Replace with logged-in user's email
      title: recipeTitle,
      category: recipeCategory,
      ingredients: ingredients.split(','),
      steps: steps.split(','),
      imageUrl: imageUrl,
      prepTime: prepTime,
      servings: servings,
    };

    try {
      // Send POST request to create a new recipe
      const response = await axios.post("http://localhost:3000/recipe", recipePayload, {
        headers: {
          "Authorization": `Bearer ${TOKEN}`, // Ensure token is set correctly
          "Content-Type": "application/json",
        },
      });
      console.log("Recipe created successfully:", response.data);
      setMessage("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      setMessage("Error creating recipe.");
    }
  };

  return (
    <div>
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Title:</label>
          <input
            type="text"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
            placeholder="Enter recipe title"
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={recipeCategory}
            onChange={(e) => setRecipeCategory(e.target.value)}
            placeholder="Enter recipe category"
            required
          />
        </div>
        <div>
          <label>Ingredients (comma separated):</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (comma separated)"
            required
          />
        </div>
        <div>
          <label>Steps (comma separated):</label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="Enter preparation steps (comma separated)"
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <div>
          <label>Preparation Time (in minutes):</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="Enter preparation time"
          />
        </div>
        <div>
          <label>Servings:</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="Enter number of servings"
          />
        </div>
        <button type="submit">Create Recipe</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateRecipe;
