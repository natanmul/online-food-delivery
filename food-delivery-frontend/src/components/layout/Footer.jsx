import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FoodDelivery</h3>
            <p className="text-gray-300">
              Delivering delicious food to your doorstep since 2024.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/restaurants" className="text-gray-300 hover:text-white">Restaurants</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/food-delivery" className="text-gray-300 hover:text-white">Food Delivery</Link></li>
              <li><Link to="/restaurant-partners" className="text-gray-300 hover:text-white">Restaurant Partners</Link></li>
              <li><Link to="/driver-app" className="text-gray-300 hover:text-white">Driver App</Link></li>
              <li><Link to="/business-solutions" className="text-gray-300 hover:text-white">Business Solutions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">support@fooddelivery.com</li>
              <li className="text-gray-300">+1 (555) 123-4567</li>
              <li className="text-gray-300">123 Food Street, City, Country</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;