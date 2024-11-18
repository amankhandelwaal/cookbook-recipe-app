import React from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
            <ChefHat className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Where Every Recipe Tells A Story
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of food lovers and explore thousands of delicious recipes from around the world.
            </p>
            <Button size="lg" className="gap-2">
              Browse Recipes
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Recipes</h3>
                <p className="text-gray-600">
                  Access thousands of professionally curated recipes from expert chefs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Follow</h3>
                <p className="text-gray-600">
                  Step-by-step instructions make cooking simple and enjoyable.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share & Connect</h3>
                <p className="text-gray-600">
                  Join a community of food lovers and share your culinary creations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
