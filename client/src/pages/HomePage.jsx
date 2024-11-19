import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAuthenticated = user?.jwt ? true : false;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("http://localhost:3000/recipes", {
          headers: {
            Authorization: `Bearer ${user?.jwt}`,
          },
        });

        const result = await response.json();
        setRecipes(result);
      } catch (e) {
        console.error("Error in fetching recipes", e);
      }
    }

    fetchRecipes();
  }, [user?.jwt]);

  // Handle search query and redirect to BrowsePage
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?query=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} />

      {/* Hero Search Section */}
      <div
        style={{
          backgroundImage: `url('/hero.jpg')`, // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '50vh', // Adjust height as per your design
        }}
        className="flex items-center justify-center"
      >
        <div className="text-center bg-white/70 py-4 px-8 rounded-lg">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="What would you like to cook today?"
              className="p-2 w-80 md:w-96 rounded-lg text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="ml-4">Search</Button>
          </form>
        </div>
      </div>

      {/* Featured Recipes Section with Custom Transparency */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 rounded-lg shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.6)", // White with 60% opacity
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-2xl font-bold text-gray-900 cursor-pointer"
            onClick={() => navigate("/browse")}
          >
            Featured Recipes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
