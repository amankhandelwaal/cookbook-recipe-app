import React, { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/favorites', {
        headers: { Authorization: `Bearer ${user.jwt}` },
      });
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  return (
    <div>
      <Navbar isAuthenticated={!!user} user={user} />
      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Favourite Recipes</h1>
          {favorites.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} user={user} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No favourite recipes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
