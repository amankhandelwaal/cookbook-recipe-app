import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import axios from 'axios'; // For API calls
import { useNavigate } from 'react-router-dom'; // For navigation

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const TOKEN = localStorage.getItem("userInfo").jwt;

  console.log(TOKEN)

  useEffect(async () => {
    // Fetch featured recipes on load
    const response = await fetch("http://localhost:3000/recipes", 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
        }
      }
    )
    const result = await response.json()

    console.log(result)

  }, [TOKEN]);

  const handleSearch = () => {
    axios
      .get(`http://localhost:3000/recipes?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      })
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error('Error fetching search results:', error));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              What would you like to cook today?
            </h1>

            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearch} className="mt-4 w-full">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <Button variant="outline" onClick={() => navigate('/recipes')}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
