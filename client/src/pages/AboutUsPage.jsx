import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Aman Khandelwal',
    srn: 'PES2UG23CS051',
    image: '',
    bio: '',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Alayna Monteiro',
    srn: 'PES2UG23CS050',
    image: '',
    bio: '',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Amogh Acharya',
    srn: 'PES2UG23CS055',
    image: '',
    bio: '',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About RecipeBook
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're passionate about bringing people together through the joy of cooking.
            Our platform makes it easy to discover, share, and create amazing recipes.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Inspiration</h2>
            <p className="text-gray-600">
              It all started during a group project meeting that was supposed to be about “serious coding.” 
              Instead, we spent half the time arguing over which food delivery app had the best discounts and the other half Googling “easy recipes with 3 ingredients.” 
              That's when someone said, "What if there was a recipe site made for people like us—who love food but have no time, skills, or patience?"

              And just like that, the idea was born. A website where food meets simplicity, sprinkled with a bit of humor, 
              and served fresh for everyone who's ever burned toast. 
              Enjoy the chaos—we mean, the recipes!
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80"
              alt="Cooking together"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-lg p-6 text-center"
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mb-4">{member.srn}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="icon" onClick={() => window.open(member.social.twitter)}>
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.open(member.social.linkedin)}>
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.open(member.social.github)}>
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
