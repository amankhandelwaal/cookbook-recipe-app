import React, { useState } from 'react';
import { CookingPot, PlusCircle, Search, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from './ui/navigation-menu';

// Mock useAuth hook
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return {
    isAuthenticated,
    toggleAuth: () => setIsAuthenticated(!isAuthenticated),
    user: { name: 'John Doe' },
  };
};

function Navbar() {
  const { isAuthenticated, toggleAuth, user } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <CookingPot className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">RecipeBook</span>
          </div>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList>
              {isAuthenticated ? (
                <>
                  {/* Main Navigation Items */}
                  <NavigationMenuItem>
                    <Button variant="ghost" size="lg" className="text-sm">
                      Home
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" size="lg" className="text-sm">
                      Browse Recipes
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" size="lg" className="text-sm flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Add Recipe
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" size="lg" className="text-sm">
                      About Us
                    </Button>
                  </NavigationMenuItem>

                  {/* User Menu */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-9 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-48 p-2">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => toggleAuth()}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Button variant="ghost" size="lg" onClick={() => toggleAuth()}>
                      Login
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button size="lg">Sign up</Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;