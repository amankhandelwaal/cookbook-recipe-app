import React from 'react';
import { Clock } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={recipe.image_url} // Updated to match API's image field
          alt={recipe.name}       // Updated to match API's name field
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {recipe.name}  {/* Updated to match API's name field */}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {recipe.description}  {/* Matches API's description field */}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.cook_time} {/* Matches API's cook_time field */}
          </div>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
            {recipe.difficulty_level} {/* Matches API's difficulty_level field */}
          </span>
        </div>
      </div>
    </div>
  );
}
