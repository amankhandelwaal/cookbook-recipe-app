import React from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe }) {

  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`, { state: {recipe, recipeId} });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow" onClick={() => handleRecipeClick(recipe._id)}>
      <div className="relative h-48">
        <img
          src={recipe.imageUrl} // Updated to match API's image field
          alt={recipe.title}       // Updated to match API's name field
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {recipe.title}  {/* Updated to match API's name field */}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.prepTime} {/* Matches API's cook_time field */}
          </div>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
            Serves {recipe.servings} {/* Matches API's difficulty_level field */}
          </span>
        </div>
      </div>
    </div>
  );
}
