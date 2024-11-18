import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
            <p className="text-gray-600">
              RecipeBook is your ultimate destination for discovering, sharing, and creating amazing recipes from around the world.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-orange-500">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <p className="text-gray-600">
              Follow us on social media for the latest recipes and updates.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} RecipeBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
