import React, { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch the initial favorite status
  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/recipe/${recipe._id}/favorite`,
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      );
      setIsFavorited(data.isFavorited);// { isFavorited: true or false }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      await axios.post(
        `http://localhost:3000/recipe/${recipe._id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${user.jwt}` },
        }
      );
      setIsFavorited((prev) => !prev);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`, { state: { recipe, recipeId } });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
      onClick={() => handleRecipeClick(recipe._id)}
    >
      <div className="relative h-48">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {/* Heart Icon for Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents triggering card clicks
            toggleFavorite();
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart
            className={`h-6 w-6 ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {recipe.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.prepTime}
          </div>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
            Serves {recipe.servings}
          </span>
        </div>
      </div>
    </div>
  );
}
