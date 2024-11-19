import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

export default function Component() {
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    ingredients: "",
    steps: "",
    imageUrl: "",
    prepTime: "",
    servings: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setRecipe((prev) => ({ ...prev, category: value }));
  };

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const isAuthenticated = user ? true : false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recipe.ingredients.trim() === "" || recipe.steps.trim() === "") {
      alert("At least one ingredient and one step are required.");
      return;
    }

    // Format ingredients and steps as arrays
    const formattedRecipe = {
      username: user.username,
      email: user.email,
      title: recipe.title,
      category: recipe.category,
      ingredients: recipe.ingredients.split("\n"),
      steps: recipe.steps.split("\n"),
      imageUrl: recipe.imageUrl,
      prepTime: parseInt(recipe.prepTime),
      servings: parseInt(recipe.servings),
    };

    try {
      const response = await fetch("http://localhost:3000/recipe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedRecipe),
      });

      if (response.ok) {
        alert("Recipe created successfully!");
        // Reset form or redirect user
      } else {
        alert("Failed to create recipe");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the recipe");
    }
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Card className="w-full max-w-2xl mx-auto mt-16">
        <CardHeader>
          <CardTitle className="text-3xl">Create New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                name="title"
                value={recipe.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={recipe.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main-course">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (one per line)</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={recipe.ingredients}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Steps (one per line)</Label>
              <Textarea
                id="steps"
                name="steps"
                value={recipe.steps}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={recipe.imageUrl}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
              <Input
                id="prepTime"
                name="prepTime"
                type="number"
                value={recipe.prepTime}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Number of Servings</Label>
              <Input
                id="servings"
                name="servings"
                type="number"
                value={recipe.servings}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
