import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useLocation } from 'react-router-dom'; // Import useLocation to get URL query parameters

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

  const location = useLocation(); // Use location hook to access the URL
  const user = JSON.parse(localStorage.getItem("userInfo")); // Retrieve user info from localStorage
  const isAuthenticated = user ? true : false;

  useEffect(() => {
    // Get search term from URL query parameters (if it exists)
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    if (query) {
      setSearchTerm(query); // Set the search term from the URL
    }
  }, [location]);

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedDifficulty, selectedDietary, searchTerm]); // Re-fetch recipes when these values change

  const fetchRecipes = () => {
    let url = `http://localhost:3000/recipes?`;

    if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
    if (selectedDifficulty !== 'All') url += `difficulty=${selectedDifficulty}&`;
    if (selectedDietary.length) url += `dietary=${selectedDietary.join(',')}&`;
    if (searchTerm) url += `search=${searchTerm}`; // Pass search term in query

    // Log URL to ensure it's correct
    console.log("Fetching recipes with URL:", url);

    axios
      .get(url, { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then((response) => {
        console.log("Fetched recipes:", response.data); // Check if recipes are fetched
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error); // Log errors
      });
  };

  const toggleDietaryOption = (option) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <div className="min-h-screen bg-gray-50 mt-16">
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
                onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // If Enter key is pressed, redirect with search query
                    window.location.href = `/browse?query=${searchTerm}`;
                  }
                }}
              />
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            ) : (
              <p className="text-center text-gray-500">No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
