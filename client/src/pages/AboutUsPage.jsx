import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & Head Chef',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    bio: 'With over 15 years of culinary experience, Sarah founded RecipeBook to share her passion for cooking with the world.',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    bio: 'A full-stack developer with a love for both coding and cooking, Michael ensures RecipeBook runs smoothly.',
    social: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    bio: 'Emily builds and nurtures our amazing community of food lovers, ensuring everyone feels welcome.',
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At RecipeBook, we believe that cooking is more than just preparing meals—it's
              about creativity, sharing, and bringing people together.
            </p>
            <p className="text-gray-600">
              We're building a community where food enthusiasts can connect, share their
              culinary adventures, and inspire others to create memorable dining experiences.
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
                <p className="text-orange-600 font-medium mb-4">{member.role}</p>
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

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Community First',
              description: 'Building a supportive and inclusive space for food lovers.',
            },
            {
              title: 'Quality Content',
              description: 'Ensuring every recipe is tested and meets our high standards.',
            },
            {
              title: 'Continuous Innovation',
              description: 'Always improving to provide the best cooking experience.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="bg-orange-50 rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
