import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [formType, setFormType] = useState('login');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const validateForm = (data) => {
    const schema = validationSchemas[formType];
    const newErrors = {};

    Object.keys(schema).forEach((key) => {
      const validation = schema[key].validate(data[key] || '');
      if (validation !== true) {
        newErrors[key] = validation;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // form is being submitted
    e.preventDefault();
    setServerError('');
    setIsSubmitting(true);

    // change the form data to have
    // {
    //   "username": "chef_john",
    //   "email": "john@example.com",
    //   "password": "securepass123"
    // }

    // change form data entries
    
    const formData = new FormData(e.target);
    const data = formType === 'login' ? 
    { 
      username: formData.get('username'),
      password: formData.get('password'),
    }:{
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    // Debugging logs
    console.log('Form Data:', data);

    try {
      const endpoint = formType === 'login' ? 'http://localhost:3000/login' : 'http://localhost:3000/register/user';
      const response = await fetch (endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json();

      console.log("Response:", result);

      // Save the JWT token to localStorage

      const { jwt, username, email } = result.user;
      localStorage.setItem('userInfo', JSON.stringify({jwt, username, email}));

      if (response.status == 200) {
        navigate("/home")
      }
    } catch (error) {
      console.log("Error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {formType === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {formType === 'login'
              ? 'Sign in to access your recipes'
              : 'Join our cooking community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formType === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="johndoe"
                />
                {errors.username && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="johndoe"
              />
              {errors.email && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : formType === 'login' ? 'Sign In' : 'Create Account'}
          </Button>

          {serverError && (
            <div className="mt-4 text-center text-sm text-red-600">
              <AlertCircle className="h-5 w-5 inline-block mr-1" />
              {serverError}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            {formType === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}