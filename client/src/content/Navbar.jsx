import React from 'react';
import { CookingPot, PlusCircle, User, LogOut, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from './ui/navigation-menu';

const Navbar = ({ isAuthenticated, toggleAuth, user }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link to="/home" className="flex items-center space-x-2">
              <CookingPot className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">RecipeBook</span>
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              {isAuthenticated ? (
                <>
                  <NavigationMenuItem>
                    <Link to="/home">
                      <Button variant="ghost" size="lg" className="text-sm">
                        Home
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/browse">
                      <Button variant="ghost" size="lg" className="text-sm">
                        Browse Recipes
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/create">
                      <Button variant="ghost" size="lg" className="text-sm flex items-center gap-1">
                        <PlusCircle className="h-4 w-4" />
                        Add Recipe
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/favorites">
                      <Button variant="ghost" size="lg" className="text-sm flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Favorites
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/about">
                      <Button variant="ghost" size="lg" className="text-sm">
                        About Us
                      </Button>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-9 px-2" onClick={() => navigate("/profile")}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium">{user.username}</span>
                      </div>
                    </NavigationMenuTrigger>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link to="/auth">
                      <Button variant="ghost" size="lg">Login</Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/auth">
                      <Button size="lg">Sign up</Button>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
