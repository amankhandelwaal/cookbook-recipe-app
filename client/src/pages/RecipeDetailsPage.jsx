import Navbar from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

function RecipeDetailsPage() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAuthenticated = user ? true : false;
  const { recipe, recipeId } = location.state || {};

  console.log(recipeId);

  const [recipeDetails, setRecipeDetails] = useState({});

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(
        `http://localhost:3000/recipes/byid/${recipeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      );

      const recipeDetails = await response.json();
      console.log(recipeDetails);

      setRecipeDetails(recipeDetails);
    }

    getRecipeDetails();
  }, [recipeId, user.jwt]);

  return (
    <div className="overflow-y-hidden">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <div className="container mx-auto pb-4 py-8 pt-24">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${recipeDetails.username}`}
                />
                <AvatarFallback>
                  {recipeDetails.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recipeDetails.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {recipeDetails.username}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative mb-4">
              <img
                src={
                  recipeDetails.imageUrl ||
                  "/placeholder.svg?height=400&width=800"
                }
                alt={recipeDetails.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary">{recipeDetails.category}</Badge>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{recipeDetails.prepTime} mins</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{recipeDetails.servings} servings</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {recipeDetails.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    {recipeDetails.steps?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RecipeDetailsPage;
