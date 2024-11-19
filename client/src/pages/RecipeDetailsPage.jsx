import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RecipeDetailsPage() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const { recipe, recipeId } = location.state || {};

  console.log(recipeId);

  const [recipeDetails, setRecipeDetails] = useState({});

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(`http://localhost:3000/recipes/byid/${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`
        }
      });

      const recipeDetails = await response.json();
      console.log(recipeDetails);

      setRecipeDetails(recipeDetails);
    }

    getRecipeDetails();

  }, [recipeId, user.jwt]);

  return (
    <>
      <h1>Recipe ID: {recipeId}</h1>
      <h1>Recipe Name: {recipeDetails.title}</h1>
      {/* Add more details as needed */}
    </>
  );
}

export default RecipeDetailsPage;