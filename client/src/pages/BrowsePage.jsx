import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import axios from 'axios';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

export default function BrowsePage() {
  const [recipes, setRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const TOKEN = JSON.parse(localStorage.getItem("userInfo")).jwt; // Replace with actual token

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedDifficulty, selectedDietary, searchTerm]);

  const fetchRecipes = () => {
    let url = `http://localhost:3000/recipes?`;

    if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
    if (selectedDifficulty !== 'All') url += `difficulty=${selectedDifficulty}&`;
    if (selectedDietary.length) url += `dietary=${selectedDietary.join(',')}&`;
    if (searchTerm) url += `search=${searchTerm}`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error('Error fetching recipes:', error));
  };

  const toggleDietaryOption = (option) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
