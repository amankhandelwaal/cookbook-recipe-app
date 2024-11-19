import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom"; // For navigation
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAuthenticated = user.jwt ? true : false;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("http://localhost:3000/recipes", {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        });

        const result = await response.json();

        setRecipes(result);
      } catch (e) {
        console.log("Error in fetching Recipes");
        throw e;
      }
    }

    fetchRecipes();
  }, [user.jwt]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              What would you like to cook today?
            </h1>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <Button variant="outline" onClick={() => navigate("/browse")}>
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
